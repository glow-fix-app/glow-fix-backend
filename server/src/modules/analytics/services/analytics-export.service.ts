import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { ExportReportDto } from '../dto/request/analytics-query.dto';

@Injectable()
export class AnalyticsExportService {
  private readonly logger = new Logger(AnalyticsExportService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async exportRevenueReport(
    userId: string,
    userRole: string,
    dto: ExportReportDto,
  ): Promise<{ data: any[]; filename: string }> {
    const start = dto.start_date ? new Date(dto.start_date) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = dto.end_date ? new Date(dto.end_date) : new Date();

    const businessFilter: any = {};
    if (userRole === 'MANAGER') {
      const business = await this.analyticsRepository.findBusinessByManagerId(userId);
      if (business) {
        businessFilter.businessId = business.id;
      }
    }

    const paidStatus = await this.analyticsRepository.getPaidStatus();
    const payments = await this.analyticsRepository.findPaymentsInRangeByStatus(
      start, end, paidStatus?.id, businessFilter, {
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
      }
    );

    const reportData = payments.map((p: any) => ({
      date: p.paidAt?.toISOString().split('T')[0],
      booking_code: `BK-${p.bookingId.slice(0, 8).toUpperCase()}`,
      customer_name: p.booking.vehicle?.client?.user?.fullName || 'Unknown',
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
}
