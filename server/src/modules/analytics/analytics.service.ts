import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  AnalyticsQueryDto,
  TimeRange,
  ExportReportDto,
} from './dto/analytics-query.dto';
import {
  DashboardStatsDto,
  DashboardTrendsDto,
  DashboardSummaryResponseDto,
} from './dto/dashboard-stats.dto';
import {
  RevenueStatsDto,
  RevenueSummaryDto,
  PaymentMethodStatsDto,
  RevenuePointDto,
} from './dto/revenue-stats.dto';
import {
  BookingMetricsDto,
  TopServicesDto,
  BookingStatusCountDto,
} from './dto/booking-metrics.dto';
import {
  BusinessPerformanceDto,
  BusinessPerformanceListDto,
} from './dto/business-performance.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==================== DATE RANGE HELPERS ====================

  private getDateRange(range?: TimeRange, startDate?: string, endDate?: string): { start: Date; end: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let end = new Date(today);
    end.setHours(23, 59, 59, 999);

    let start = new Date(today);

    switch (range ?? TimeRange.THIS_MONTH) {
      case TimeRange.TODAY:
        start = today;
        break;
      case TimeRange.YESTERDAY:
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case TimeRange.THIS_WEEK:
        start.setDate(today.getDate() - today.getDay());
        break;
      case TimeRange.LAST_WEEK:
        start.setDate(today.getDate() - today.getDay() - 7);
        end.setDate(today.getDate() - today.getDay() - 1);
        break;
      case TimeRange.THIS_MONTH:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case TimeRange.LAST_MONTH:
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case TimeRange.THIS_QUARTER:
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case TimeRange.THIS_YEAR:
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case TimeRange.CUSTOM:
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        }
        break;
    }

    return { start, end };
  }

  // ==================== DASHBOARD STATISTICS ====================

  async getDashboardStats(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<DashboardSummaryResponseDto> {
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);
    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    previousStart.setDate(previousStart.getDate() - diffDays);
    previousEnd.setDate(previousEnd.getDate() - diffDays);

    // For manager role, filter by business
    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    // Current period stats
    const currentStats = await this.getPeriodStats(start, end, businessFilter);
    const previousStats = await this.getPeriodStats(previousStart, previousEnd, businessFilter);

    // Calculate trends
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

    const periodLabel = this.getPeriodLabel(query.range ?? TimeRange.THIS_MONTH, start, end);

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
    // Get paid payments
    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        status: { context: 'PAID' },
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      select: { amount: true },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const platformFees = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFees;

    // Get bookings
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...businessFilter,
      },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const completedBookings = bookings.filter(b =>
      b.statusHistory[0]?.status?.context === 'COMPLETED'
    ).length;
    const cancelledBookings = bookings.filter(b =>
      b.statusHistory[0]?.status?.context === 'CANCELLED'
    ).length;
    const pendingBookings = bookings.filter(b =>
      ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'].includes(b.statusHistory[0]?.status?.context || 'PENDING')
    ).length;

    const completionRate = bookings.length > 0 ? (completedBookings / bookings.length) * 100 : 0;
    const averageOrderValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;

    // Get users
    const userWhere: any = {
      createdAt: { gte: start, lte: end },
    };
    if (businessFilter.businessId) {
      // For manager, count clients who booked with this business
      userWhere.client = {
        vehicles: {
          some: {
            bookings: { some: { businessId: businessFilter.businessId } }
          }
        }
      };
    }

    const newUsers = await this.prisma.user.count({
      where: userWhere,
    });

    const totalUsers = await this.prisma.user.count();

    // Get businesses
    let newBusinesses = 0;
    let totalBusinesses = 0;
    let activeBusinesses = 0;
    let pendingBusinesses = 0;

    if (!businessFilter.businessId) {
      newBusinesses = await this.prisma.business.count({
        where: { createdAt: { gte: start, lte: end } },
      });
      totalBusinesses = await this.prisma.business.count();
      activeBusinesses = await this.prisma.business.count({
        where: {
          statusHistory: { some: { status: { context: 'APPROVED' } } },
        },
      });
      pendingBusinesses = await this.prisma.business.count({
        where: {
          statusHistory: { some: { status: { context: 'PENDING_REVIEW' } } },
        },
      });
    }

    // Get loyalty stats
    const loyaltyStats = await this.prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
      },
      _sum: {
        points: true,
      },
    });

    const totalPointsIssued = loyaltyStats._sum.points || 0;
    const totalPointsRedeemed = await this.prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        points: { lt: 0 },
      },
      _sum: { points: true },
    });

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
      total_points_issued: totalPointsIssued,
      total_points_redeemed: Math.abs(totalPointsRedeemed._sum.points || 0),
    };
  }

  // ==================== REVENUE STATISTICS ====================

  async getRevenueStats(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<RevenueStatsDto> {
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);
    const groupBy = query.group_by || 'day';

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        statusId: paidStatus?.id,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      include: {
        booking: {
          include: {
            business: true,
          },
        },
      },
      orderBy: { paidAt: 'asc' },
    });

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
          const week = this.getWeekNumber(date);
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
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        statusId: paidStatus?.id,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      select: { amount: true, paidAt: true },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const platformFees = totalRevenue * 0.1;
    const netRevenue = totalRevenue - platformFees;

    const daysInPeriod = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const averageDailyRevenue = totalRevenue / daysInPeriod;
    const projectedMonthlyRevenue = averageDailyRevenue * 30;

    // Calculate growth
    const previousStart = new Date(start);
    const previousEnd = new Date(end);
    const diffDays = daysInPeriod;
    previousStart.setDate(previousStart.getDate() - diffDays);
    previousEnd.setDate(previousEnd.getDate() - diffDays);

    const previousPayments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: previousStart, lte: previousEnd } },
          { paidAt: null, createdAt: { gte: previousStart, lte: previousEnd } }
        ],
        statusId: paidStatus?.id,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      select: { amount: true },
    });

    const previousRevenue = previousPayments.reduce((sum, p) => sum + Number(p.amount), 0);
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
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        statusId: paidStatus?.id,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      include: {
        paymentMethod: true,
      },
    });

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

  // ==================== BOOKING METRICS ====================

  async getBookingMetrics(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<BookingMetricsDto> {
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        ...businessFilter,
      },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        cancellation: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    let totalCompletionTime = 0;
    let totalCancellationTime = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let noShowCount = 0;

    for (const booking of bookings) {
      const status = booking.statusHistory[0]?.status?.context || 'PENDING';
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      if (status === 'COMPLETED') {
        completedCount++;
        const createdAt = booking.createdAt.getTime();
        const completedAt = booking.statusHistory.find(s => s.status?.context === 'COMPLETED')?.createdAt;
        if (completedAt) {
          totalCompletionTime += (completedAt.getTime() - createdAt) / (1000 * 60 * 60);
        }
      } else if (status === 'CANCELLED') {
        cancelledCount++;
        if (booking.cancellation?.cancelledAt) {
          totalCancellationTime += (booking.cancellation.cancelledAt.getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60);
        }
      } else if (status === 'NO_SHOW') {
        noShowCount++;
      }
    }

    const bookingsByStatus: BookingStatusCountDto[] = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0,
    }));

    // Bookings by hour of day
    const bookingsByHour = new Array(24).fill(0);
    for (const booking of bookings) {
      const hour = booking.scheduledAt.getHours();
      bookingsByHour[hour]++;
    }

    // Bookings by day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bookingsByDay = new Array(7).fill(0);
    for (const booking of bookings) {
      const day = booking.scheduledAt.getDay();
      bookingsByDay[day]++;
    }

    return {
      total_bookings: bookings.length,
      completed_bookings: completedCount,
      cancelled_bookings: cancelledCount,
      no_show_bookings: noShowCount,
      average_completion_time_hours: completedCount > 0 ? Math.round(totalCompletionTime / completedCount * 10) / 10 : 0,
      average_cancellation_time_hours: cancelledCount > 0 ? Math.round(totalCancellationTime / cancelledCount * 10) / 10 : 0,
      bookings_by_status: bookingsByStatus,
      bookings_by_hour: bookingsByHour.map((count, hour) => ({ hour, count })),
      bookings_by_day_of_week: bookingsByDay.map((count, index) => ({ day: dayNames[index], count })),
    };
  }

  async getTopServices(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
    limit: number = 10,
  ): Promise<TopServicesDto> {
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const results = await this.prisma.$queryRaw<Array<any>>`
      SELECT 
        s.id as service_id,
        s.title as service_name,
        c.name as category_name,
        COUNT(*) as booking_count,
        SUM(bi.price) as total_revenue
      FROM booking_items bi
      JOIN bookings b ON bi.booking_id = b.id
      JOIN business_service bs ON bi.business_service_id = bs.id
      JOIN services s ON bs.service_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE b.created_at >= ${start}
        AND b.created_at <= ${end}
        ${businessFilter.businessId ? Prisma.sql`AND b.business_id = ${businessFilter.businessId}::uuid` : Prisma.sql``}
      GROUP BY s.id, s.title, c.name
      ORDER BY booking_count DESC
      LIMIT ${limit}
    `;

    return {
      top_services: results.map(r => ({
        service_id: r.service_id,
        service_name: r.service_name,
        category_name: r.category_name,
        booking_count: Number(r.booking_count),
        total_revenue: Number(r.total_revenue),
      })),
    };
  }

  // ==================== BUSINESS PERFORMANCE ====================

  async getBusinessPerformance(
    query: AnalyticsQueryDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<BusinessPerformanceListDto> {
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const total = await this.prisma.business.count();

    const businesses = await this.prisma.business.findMany({
      include: {
        manager: {
          select: { fullName: true, email: true },
        },
      },
      skip,
      take,
    });

    const businessPerformance: BusinessPerformanceDto[] = [];

    for (const business of businesses) {
      const bookings = await this.prisma.booking.findMany({
        where: {
          businessId: business.id,
          createdAt: { gte: start, lte: end },
        },
        include: {
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          payment: {
            include: { status: true },
          },
        },
      });

      const completedBookings = bookings.filter(b =>
        b.statusHistory[0]?.status?.context === 'COMPLETED'
      ).length;
      const cancelledBookings = bookings.filter(b =>
        b.statusHistory[0]?.status?.context === 'CANCELLED'
      ).length;

      let totalRevenue = 0;
      for (const booking of bookings) {
        if (booking.payment?.status?.context === 'PAID') {
          totalRevenue += Number(booking.totalPrice);
        }
      }
      totalRevenue = totalRevenue;
      const platformFees = totalRevenue * 0.1;

      // Get reviews
      const reviews = await this.prisma.review.findMany({
        where: { booking: { businessId: business.id } },
      });
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Get active services
      const activeServices = await this.prisma.businessService.count({
        where: { businessId: business.id, isActive: true },
      });

      // Calculate growth (compare with previous period)
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - diffDays);
      const previousBookings = await this.prisma.booking.count({
        where: {
          businessId: business.id,
          createdAt: { gte: previousStart, lt: start },
        },
      });
      const growthPercent = previousBookings > 0
        ? ((bookings.length - previousBookings) / previousBookings) * 100
        : bookings.length > 0 ? 100 : 0;

      const reviewsWithComment = await this.prisma.review.count({
        where: { booking: { businessId: business.id }, comment: { not: null } },
      });
      const responseRate = reviews.length > 0
        ? Math.round((reviewsWithComment / reviews.length) * 100)
        : 0;

      businessPerformance.push({
        business_id: business.id,
        business_name: business.businessName,
        total_bookings: bookings.length,
        completed_bookings: completedBookings,
        cancelled_bookings: cancelledBookings,
        total_revenue: totalRevenue,
        platform_fees: platformFees,
        net_revenue: totalRevenue - platformFees,
        average_rating: Math.round(averageRating * 10) / 10,
        total_reviews: reviews.length,
        active_services: activeServices,
        response_rate: responseRate,
        growth_percent: Math.round(growthPercent * 10) / 10,
      });
    }

    businessPerformance.sort((a, b) => b.total_revenue - a.total_revenue);

    return {
      data: businessPerformance,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getBusinessPerformanceById(
    userId: string,
    userRole: string,
    businessId: string,
    query: AnalyticsQueryDto,
  ): Promise<BusinessPerformanceDto> {
    // Verify access for managers
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { id: businessId, managerId: userId },
      });
      if (!business) {
        throw new ForbiddenException('Access denied');
      }
    }
    const { start, end } = this.getDateRange(query.range, query.start_date, query.end_date);

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new Error('Business not found');
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        businessId,
        createdAt: { gte: start, lte: end },
      },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payment: {
            include: { status: true },
          },
      },
    });

    const completedBookings = bookings.filter(b =>
      b.statusHistory[0]?.status?.context === 'COMPLETED'
    ).length;
    const cancelledBookings = bookings.filter(b =>
      b.statusHistory[0]?.status?.context === 'CANCELLED'
    ).length;

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.payment?.status?.context === 'PAID') {
        totalRevenue += Number(booking.totalPrice);
      }
    }
    totalRevenue = totalRevenue;
    const platformFees = totalRevenue * 0.1;

    const reviews = await this.prisma.review.findMany({
      where: { booking: { businessId } },
    });
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const activeServices = await this.prisma.businessService.count({
      where: { businessId, isActive: true },
    });

    const reviewsWithComment = await this.prisma.review.count({
      where: { booking: { businessId }, comment: { not: null } },
    });
    const responseRate = reviews.length > 0
      ? Math.round((reviewsWithComment / reviews.length) * 100)
      : 0;

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - diffDays);
    const previousBookings = await this.prisma.booking.count({
      where: {
        businessId,
        createdAt: { gte: previousStart, lt: start },
      },
    });
    const growthPercent = previousBookings > 0
      ? ((bookings.length - previousBookings) / previousBookings) * 100
      : bookings.length > 0 ? 100 : 0;

    return {
      business_id: business.id,
      business_name: business.businessName,
      total_bookings: bookings.length,
      completed_bookings: completedBookings,
      cancelled_bookings: cancelledBookings,
      total_revenue: totalRevenue,
      platform_fees: platformFees,
      net_revenue: totalRevenue - platformFees,
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length,
      active_services: activeServices,
      response_rate: responseRate,
      growth_percent: Math.round(growthPercent * 10) / 10,
    };
  }

  // ==================== EXPORT REPORTS ====================

  async exportRevenueReport(
    userId: string,
    userRole: string,
    dto: ExportReportDto,
  ): Promise<{ data: any[]; filename: string }> {
    const start = dto.start_date ? new Date(dto.start_date) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = dto.end_date ? new Date(dto.end_date) : new Date();

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.prisma.business.findFirst({
        where: { managerId: userId },
      });
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.prisma.status.findFirst({
      where: { context: 'PAID' },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [
          { paidAt: { gte: start, lte: end } },
          { paidAt: null, createdAt: { gte: start, lte: end } }
        ],
        statusId: paidStatus?.id,
        ...(businessFilter.businessId ? { booking: { businessId: businessFilter.businessId } } : {}),
      },
      include: {
        booking: {
          include: {
            business: true,
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
        paymentMethod: true,
        status: true,
      },
      orderBy: { paidAt: 'asc' },
    });

    const reportData = payments.map(p => ({
      date: p.paidAt?.toISOString().split('T')[0],
      booking_code: `BK-${p.bookingId.slice(0, 8).toUpperCase()}`,
      customer_name: p.booking.vehicle.client.user.fullName,
      business_name: p.booking.business.businessName,
      amount: Number(p.amount),
      fee: Number(p.amount) * 0.1,
      net: Number(p.amount) * 0.9,
      payment_method: p.paymentMethod.name,
      status: p.status.context,
    }));

    const filename = `revenue_report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.csv`;

    return { data: reportData, filename };
  }

  // ==================== PRIVATE HELPERS ====================

  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
  }

  private getPeriodLabel(range: TimeRange | undefined, start: Date, end: Date): string {
    const effectiveRange = range ?? TimeRange.THIS_MONTH;
    if (effectiveRange === TimeRange.CUSTOM) {
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    const labels: Record<TimeRange, string> = {
      [TimeRange.TODAY]: 'Today',
      [TimeRange.YESTERDAY]: 'Yesterday',
      [TimeRange.THIS_WEEK]: 'This Week',
      [TimeRange.LAST_WEEK]: 'Last Week',
      [TimeRange.THIS_MONTH]: 'This Month',
      [TimeRange.LAST_MONTH]: 'Last Month',
      [TimeRange.THIS_QUARTER]: 'This Quarter',
      [TimeRange.THIS_YEAR]: 'This Year',
      [TimeRange.CUSTOM]: 'Custom Range',
    };
    return labels[effectiveRange];
  }
}