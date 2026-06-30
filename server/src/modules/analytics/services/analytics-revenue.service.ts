import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsQueryDto } from '../dto/request/analytics-query.dto';
import { RevenueStatsDto, RevenueSummaryDto, PaymentMethodStatsDto, RevenuePointDto } from '../dto/response/revenue-stats.dto';
import { getDateRange, getWeekNumber } from '../utils/analytics.utils';

@Injectable()
export class AnalyticsRevenueService {
  private readonly logger = new Logger(AnalyticsRevenueService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getRevenueStats(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<RevenueStatsDto> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);
    const groupBy = query.group_by || 'day';

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.analyticsRepository.getPaidStatus();
    const payments: any[] = await this.analyticsRepository.findPaymentsInRangeByStatus(
      start, end, paidStatus?.id, businessFilter, {
        booking: {
          include: {
            business: true,
          },
        },
      }
    );

    const revenueByDate = new Map<string, { revenue: number; fees: number; bookings: number }>();

    for (const payment of payments) {
      let key: string;
      const date = payment.paidAt || payment.createdAt;
      const amount = Number(payment.amount);
      const fee = amount * 0.1;

      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const week = getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      const existing = revenueByDate.get(key) || { revenue: 0, fees: 0, bookings: 0 };
      existing.revenue += amount;
      existing.fees += fee;
      existing.bookings += 1;
      revenueByDate.set(key, existing);
    }

    const revenuePoints: RevenuePointDto[] = Array.from(revenueByDate.entries())
      .map(([date, data]) => ({
        date,
        revenue: Math.round(data.revenue * 100) / 100,
        fees: Math.round(data.fees * 100) / 100,
        net_revenue: Math.round((data.revenue - data.fees) * 100) / 100,
        bookings_count: data.bookings,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      daily: groupBy === 'day' ? revenuePoints : [],
      weekly: groupBy === 'week' ? revenuePoints : [],
      monthly: groupBy === 'month' ? revenuePoints : [],
      yearly: groupBy === 'year' ? revenuePoints : [],
    };
  }

  async getRevenueSummary(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<RevenueSummaryDto> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.analyticsRepository.getPaidStatus();
    const payments: any[] = await this.analyticsRepository.findPaymentsInRangeByStatus(
      start, end, paidStatus?.id, businessFilter, {}, { amount: true, paidAt: true }
    );

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const platformFees = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFees;

    const daysInPeriod = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const averageDailyRevenue = totalRevenue / daysInPeriod;
    const projectedMonthlyRevenue = averageDailyRevenue * 30;

    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    const diffDays = daysInPeriod;
    previousStart.setDate(previousStart.getDate() - diffDays);
    previousEnd.setDate(previousEnd.getDate() - diffDays);

    const previousPayments = await this.analyticsRepository.findPaymentsInRangeByStatus(
      previousStart, previousEnd, paidStatus?.id, businessFilter, {}, { amount: true }
    );

    const previousRevenue = previousPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const revenueGrowthPercent = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : totalRevenue > 0 ? 100 : 0;

    return {
      total_revenue: Math.round(totalRevenue * 100) / 100,
      platform_fees: Math.round(platformFees * 100) / 100,
      net_revenue: Math.round(netRevenue * 100) / 100,
      average_daily_revenue: Math.round(averageDailyRevenue * 100) / 100,
      projected_monthly_revenue: Math.round(projectedMonthlyRevenue * 100) / 100,
      revenue_growth_percent: Math.round(revenueGrowthPercent * 10) / 10,
    };
  }

  async getPaymentMethodStats(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<PaymentMethodStatsDto[]> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.analyticsRepository.getPaidStatus();
    const payments: any[] = await this.analyticsRepository.findPaymentsInRangeByStatus(
      start, end, paidStatus?.id, businessFilter, { paymentMethod: true }
    );

    const methodStats = new Map<string, { total_amount: number; count: number }>();

    for (const payment of payments) {
      const methodName = payment.paymentMethod.name;
      const amount = Number(payment.amount);

      const existing = methodStats.get(methodName) || { total_amount: 0, count: 0 };
      existing.total_amount += amount;
      existing.count += 1;
      methodStats.set(methodName, existing);
    }

    const totalAmount = Array.from(methodStats.values()).reduce((sum, m) => sum + m.total_amount, 0);

    return Array.from(methodStats.entries()).map(([method, stats]) => ({
      method,
      total_amount: Math.round(stats.total_amount * 100) / 100,
      count: stats.count,
      percentage: totalAmount > 0 ? Math.round((stats.total_amount / totalAmount) * 100) : 0,
    }));
  }
}
