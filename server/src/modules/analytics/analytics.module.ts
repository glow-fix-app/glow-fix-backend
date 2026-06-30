import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { AnalyticsDashboardService } from './services/analytics-dashboard.service';
import { AnalyticsRevenueService } from './services/analytics-revenue.service';
import { AnalyticsBookingService } from './services/analytics-booking.service';
import { AnalyticsBusinessService } from './services/analytics-business.service';
import { AnalyticsExportService } from './services/analytics-export.service';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsRepository,
    AnalyticsDashboardService,
    AnalyticsRevenueService,
    AnalyticsBookingService,
    AnalyticsBusinessService,
    AnalyticsExportService,
  ],
  exports: [
    AnalyticsDashboardService,
    AnalyticsRevenueService,
    AnalyticsBookingService,
    AnalyticsBusinessService,
    AnalyticsExportService,
  ],
})
export class AnalyticsModule {}