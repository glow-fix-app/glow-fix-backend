import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AnalyticsDashboardService } from './services/analytics-dashboard.service';
import { AnalyticsRevenueService } from './services/analytics-revenue.service';
import { AnalyticsBookingService } from './services/analytics-booking.service';
import { AnalyticsBusinessService } from './services/analytics-business.service';
import { AnalyticsExportService } from './services/analytics-export.service';
import {
  AnalyticsQueryDto,
  TimeRange,
  ExportReportDto,
} from './dto/request/analytics-query.dto';
import {
  DashboardSummaryResponseDto,
} from './dto/response/dashboard-stats.dto';
import {
  RevenueStatsDto,
  RevenueSummaryDto,
  PaymentMethodStatsDto,
} from './dto/response/revenue-stats.dto';
import {
  BookingMetricsDto,
  TopServicesDto,
} from './dto/response/booking-metrics.dto';
import {
  BusinessPerformanceListDto,
  BusinessPerformanceDto,
} from './dto/response/business-performance.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '@glow-fix/types';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(
    private readonly dashboardService: AnalyticsDashboardService,
    private readonly revenueService: AnalyticsRevenueService,
    private readonly bookingService: AnalyticsBookingService,
    private readonly businessService: AnalyticsBusinessService,
    private readonly exportService: AnalyticsExportService,
  ) {}

  // ==================== DASHBOARD STATISTICS ====================

  @Get('dashboard')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics', type: DashboardSummaryResponseDto })
  async getDashboardStats(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ): Promise<DashboardSummaryResponseDto> {
    return this.dashboardService.getDashboardStats(user.sub, user.role, query);
  }

  // ==================== REVENUE STATISTICS ====================

  @Get('revenue')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get revenue statistics' })
  @ApiResponse({ status: 200, description: 'Revenue statistics', type: RevenueStatsDto })
  async getRevenueStats(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ): Promise<RevenueStatsDto> {
    return this.revenueService.getRevenueStats(user.sub, user.role, query);
  }

  @Get('revenue/summary')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get revenue summary' })
  @ApiResponse({ status: 200, description: 'Revenue summary', type: RevenueSummaryDto })
  async getRevenueSummary(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ): Promise<RevenueSummaryDto> {
    return this.revenueService.getRevenueSummary(user.sub, user.role, query);
  }

  @Get('revenue/payment-methods')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get payment method statistics' })
  @ApiResponse({ status: 200, description: 'Payment method stats', type: [PaymentMethodStatsDto] })
  async getPaymentMethodStats(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ): Promise<PaymentMethodStatsDto[]> {
    return this.revenueService.getPaymentMethodStats(user.sub, user.role, query);
  }

  // ==================== BOOKING METRICS ====================

  @Get('bookings')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get booking metrics' })
  @ApiResponse({ status: 200, description: 'Booking metrics', type: BookingMetricsDto })
  async getBookingMetrics(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
  ): Promise<BookingMetricsDto> {
    return this.bookingService.getBookingMetrics(user.sub, user.role, query);
  }

  @Get('bookings/top-services')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get top services by bookings' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top services', type: TopServicesDto })
  async getTopServices(
    @CurrentUser() user: JwtPayload,
    @Query() query: AnalyticsQueryDto,
    @Query('limit') limit: number = 10,
  ): Promise<TopServicesDto> {
    return this.bookingService.getTopServices(user.sub, user.role, query, limit);
  }

  // ==================== BUSINESS PERFORMANCE ====================

  @Get('businesses')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get business performance list (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Business performance list', type: BusinessPerformanceListDto })
  async getBusinessPerformance(
    @Query() query: AnalyticsQueryDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<BusinessPerformanceListDto> {
    return this.businessService.getBusinessPerformance(query, page, limit);
  }

  @Get('businesses/:businessId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get business performance by ID' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, description: 'Business performance', type: BusinessPerformanceDto })
  async getBusinessPerformanceById(
    @CurrentUser() user: JwtPayload,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<BusinessPerformanceDto> {
    return this.businessService.getBusinessPerformanceById(user.sub, user.role, businessId, query);
  }

  // ==================== EXPORT REPORTS ====================

  @Post('export/revenue')
  @Roles('ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export revenue report as CSV' })
  async exportRevenueReport(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ExportReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const { data, filename } = await this.exportService.exportRevenueReport(
      user.sub,
      user.role,
      dto,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    if (data.length === 0) {
      res.send('No data available');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(',')),
    ];

    res.send(csvRows.join('\n'));
  }
}