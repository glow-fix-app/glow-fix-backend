import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsQueryDto } from '../dto/request/analytics-query.dto';
import { BookingMetricsDto, TopServicesDto, BookingStatusCountDto } from '../dto/response/booking-metrics.dto';
import { getDateRange } from '../utils/analytics.utils';

@Injectable()
export class AnalyticsBookingService {
  private readonly logger = new Logger(AnalyticsBookingService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async getBookingMetrics(
    userId: string,
    userRole: string,
    query: AnalyticsQueryDto,
  ): Promise<BookingMetricsDto> {
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const bookings: any[] = await this.analyticsRepository.findBookingsInRange(start, end, businessFilter, {
      statusHistory: {
        include: { status: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      cancellation: true,
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
        const completedAt = booking.statusHistory.find((s: any) => s.status?.context === 'COMPLETED')?.createdAt;
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

    const bookingsByHour = new Array(24).fill(0);
    for (const booking of bookings) {
      const hour = booking.scheduledAt.getHours();
      bookingsByHour[hour]++;
    }

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
    const { start, end } = getDateRange(query.range, query.start_date, query.end_date);

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const results = await this.analyticsRepository.getTopServicesRaw(start, end, businessFilter, limit);

    return {
      top_services: results.map((r: any) => ({
        service_id: r.service_id,
        service_name: r.service_name,
        category_name: r.category_name,
        booking_count: Number(r.booking_count),
        total_revenue: Number(r.total_revenue),
      })),
    };
  }
}
