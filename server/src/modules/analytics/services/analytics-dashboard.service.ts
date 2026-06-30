import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsQueryDto, TimeRange } from '../dto/request/analytics-query.dto';
import { DashboardSummaryResponseDto, DashboardStatsDto, DashboardTrendsDto } from '../dto/response/dashboard-stats.dto';
import { getDateRange, getPeriodLabel } from '../utils/analytics.utils';

@Injectable()
export class AnalyticsDashboardService {
  private readonly logger = new Logger(AnalyticsDashboardService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getDashboardStats(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<DashboardSummaryResponseDto> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);
    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    previousStart.setDate(previousStart.getDate() - diffDays);
    previousEnd.setDate(previousEnd.getDate() - diffDays);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const currentStats = await this.getPeriodStats(start, end, businessFilter);
    const previousStats = await this.getPeriodStats(previousStart, previousEnd, businessFilter);

    const trends: DashboardTrendsDto = {
      revenue_trend: previousStats.total_revenue > 0
        ? ((currentStats.total_revenue - previousStats.total_revenue) / previousStats.total_revenue) * 100
        : 0,
      bookings_trend: previousStats.total_bookings > 0
        ? ((currentStats.total_bookings - previousStats.total_bookings) / previousStats.total_bookings) * 100
        : 0,
      users_trend: previousStats.new_users > 0
        ? ((currentStats.new_users - previousStats.new_users) / previousStats.new_users) * 100
        : 0,
      businesses_trend: previousStats.new_businesses > 0
        ? ((currentStats.new_businesses - previousStats.new_businesses) / previousStats.new_businesses) * 100
        : 0,
    };

    const periodLabel = getPeriodLabel(query.range, start, end);

    return {
      stats: currentStats,
      trends,
      period: periodLabel,
    };
  }

  private async getPeriodStats(
    start: Date,
    end: Date,
    businessFilter: any,
  ): Promise<DashboardStatsDto> {
    const paidStatus = await this.analyticsRepository.getPaidStatus();
    const payments = await this.analyticsRepository.findPaymentsInRangeByStatus(
      start, end, paidStatus?.id, businessFilter, {}, { amount: true }
    );

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const platformFees = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFees;

    const bookings = await this.analyticsRepository.findBookingsInRange(start, end, businessFilter, {
      statusHistory: {
        include: { status: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    });

    const completedBookings = bookings.filter((b: any) =>
      b.statusHistory[0]?.status?.context === 'COMPLETED'
    ).length;
    const cancelledBookings = bookings.filter((b: any) =>
      b.statusHistory[0]?.status?.context === 'CANCELLED'
    ).length;
    const pendingBookings = bookings.filter((b: any) =>
      ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'].includes(b.statusHistory[0]?.status?.context || 'PENDING')
    ).length;

    const completionRate = bookings.length > 0 ? (completedBookings / bookings.length) * 100 : 0;
    const averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;

    const userWhere: any = {
      createdAt: { gte: start, lte: end },
    };
    if (businessFilter.businessId) {
      userWhere.client = {
        vehicles: {
          some: {
            bookings: { some: { businessId: businessFilter.businessId } }
          }
        }
      };
    }

    const newUsers = await this.analyticsRepository.countUsers(userWhere);
    const totalUsers = await this.analyticsRepository.countUsers({});

    let newBusinesses = 0;
    let totalBusinesses = 0;
    let activeBusinesses = 0;
    let pendingBusinesses = 0;

    if (!businessFilter.businessId) {
      newBusinesses = await this.analyticsRepository.countBusinesses({ createdAt: { gte: start, lte: end } });
      totalBusinesses = await this.analyticsRepository.countBusinesses();
      activeBusinesses = await this.analyticsRepository.countBusinesses({
        statusHistory: { some: { status: { context: 'APPROVED' } } },
      });
      pendingBusinesses = await this.analyticsRepository.countBusinesses({
        statusHistory: { some: { status: { context: 'PENDING_REVIEW' } } },
      });
    }

    const loyaltyStats = await this.analyticsRepository.getLoyaltyStats(start, end);

    return {
      total_revenue: totalRevenue,
      total_fees: platformFees,
      net_revenue: netRevenue,
      total_bookings: bookings.length,
      completed_bookings: completedBookings,
      cancelled_bookings: cancelledBookings,
      pending_bookings: pendingBookings,
      completion_rate: Math.round(completionRate * 10) / 10,
      total_users: totalUsers,
      new_users: newUsers,
      new_businesses: newBusinesses,
      total_businesses: totalBusinesses,
      active_businesses: activeBusinesses,
      pending_businesses: pendingBusinesses,
      average_order_value: Math.round(averageOrderValue * 100) / 100,
      total_points_issued: loyaltyStats.issued,
      total_points_redeemed: Math.abs(loyaltyStats.redeemed),
    };
  }
}
