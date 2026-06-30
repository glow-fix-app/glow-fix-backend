import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsQueryDto } from '../dto/request/analytics-query.dto';
import { BusinessPerformanceListDto, BusinessPerformanceDto } from '../dto/response/business-performance.dto';
import { getDateRange } from '../utils/analytics.utils';

@Injectable()
export class AnalyticsBusinessService {
  private readonly logger = new Logger(AnalyticsBusinessService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getBusinessPerformance(
    query: AnalyticsQueryDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<BusinessPerformanceListDto> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const { total, businesses } = await this.analyticsRepository.getPaginatedBusinesses(skip, take);

    const businessPerformance: BusinessPerformanceDto[] = [];

    for (const business of businesses) {
      const bookings: any[] = await this.analyticsRepository.findBookingsInRange(
        start, end, { businessId: business.id }, {
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          payment: {
            include: { status: true },
          },
        }
      );

      const completedBookings = bookings.filter((b: any) =>
        b.statusHistory[0]?.status?.context === 'COMPLETED'
      ).length;
      const cancelledBookings = bookings.filter((b: any) =>
        b.statusHistory[0]?.status?.context === 'CANCELLED'
      ).length;

      let totalRevenue = 0;
      for (const booking of bookings) {
        if (booking.payment?.status?.context === 'PAID') {
          totalRevenue += Number(booking.totalPrice);
        }
      }
      const platformFees = totalRevenue * 0.1;

      const reviews = await this.analyticsRepository.getBusinessReviews(business.id);
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      const activeServices = await this.analyticsRepository.countActiveServices(business.id);

      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - diffDays);
      
      const previousBookings = await this.analyticsRepository.countBookingsInRange(business.id, previousStart, start);
      
      const growthPercent = previousBookings > 0
        ? ((bookings.length - previousBookings) / previousBookings) * 100
        : bookings.length > 0 ? 100 : 0;

      const reviewsWithComment = await this.analyticsRepository.countReviewsWithComment(business.id);
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
    if (userRole === 'MANAGER') {
      const managerBusiness = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (!managerBusiness || managerBusiness.id !== businessId) {
        throw new ForbiddenException('Access denied');
      }
    }
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);

    const business = await this.analyticsRepository.findBusinessById(businessId);

    if (!business) {
      throw new Error('Business not found');
    }

    const bookings: any[] = await this.analyticsRepository.findBookingsInRange(
      start, end, { businessId }, {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payment: {
          include: { status: true },
        },
      }
    );

    const completedBookings = bookings.filter((b: any) =>
      b.statusHistory[0]?.status?.context === 'COMPLETED'
    ).length;
    const cancelledBookings = bookings.filter((b: any) =>
      b.statusHistory[0]?.status?.context === 'CANCELLED'
    ).length;

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.payment?.status?.context === 'PAID') {
        totalRevenue += Number(booking.totalPrice);
      }
    }
    const platformFees = totalRevenue * 0.1;

    const reviews = await this.analyticsRepository.getBusinessReviews(businessId);
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

    const activeServices = await this.analyticsRepository.countActiveServices(businessId);

    const reviewsWithComment = await this.analyticsRepository.countReviewsWithComment(businessId);
    const responseRate = reviews.length > 0
      ? Math.round((reviewsWithComment / reviews.length) * 100)
      : 0;

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - diffDays);
    const previousBookings = await this.analyticsRepository.countBookingsInRange(businessId, previousStart, start);
    
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
}
