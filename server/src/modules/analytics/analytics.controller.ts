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
import { AnalyticsService } from './analytics.service';
import {
  AnalyticsQueryDto,
  TimeRange,
  ExportReportDto,
} from './dto/analytics-query.dto';
import {
  DashboardSummaryResponseDto,
} from './dto/dashboard-stats.dto';
import {
  RevenueStatsDto,
  RevenueSummaryDto,
  PaymentMethodStatsDto,
} from './dto/revenue-stats.dto';
import {
  BookingMetricsDto,
  TopServicesDto,
} from './dto/booking-metrics.dto';
import {
  BusinessPerformanceListDto,
  BusinessPerformanceDto,
} from './dto/business-performance.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ==================== DASHBOARD STATISTICS ====================

  @Get('dashboard')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics', type: DashboardSummaryResponseDto })
  async getDashboardStats(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<DashboardSummaryResponseDto> {
    return this.analyticsService.getDashboardStats(user.id, user.role, query);
  }

  // ==================== REVENUE STATISTICS ====================

  @Get('revenue')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get revenue statistics' })
  @ApiResponse({ status: 200, description: 'Revenue statistics', type: RevenueStatsDto })
  async getRevenueStats(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<RevenueStatsDto> {
    return this.analyticsService.getRevenueStats(user.id, user.role, query);
  }

  @Get('revenue/summary')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get revenue summary' })
  @ApiResponse({ status: 200, description: 'Revenue summary', type: RevenueSummaryDto })
  async getRevenueSummary(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<RevenueSummaryDto> {
    return this.analyticsService.getRevenueSummary(user.id, user.role, query);
  }

  @Get('revenue/payment-methods')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get payment method statistics' })
  @ApiResponse({ status: 200, description: 'Payment method stats', type: [PaymentMethodStatsDto] })
  async getPaymentMethodStats(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<PaymentMethodStatsDto[]> {
    return this.analyticsService.getPaymentMethodStats(user.id, user.role, query);
  }

  // ==================== BOOKING METRICS ====================

  @Get('bookings')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get booking metrics' })
  @ApiResponse({ status: 200, description: 'Booking metrics', type: BookingMetricsDto })
  async getBookingMetrics(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
  ): Promise<BookingMetricsDto> {
    return this.analyticsService.getBookingMetrics(user.id, user.role, query);
  }

  @Get('bookings/top-services')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get top services by bookings' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top services', type: TopServicesDto })
  async getTopServices(
    @CurrentUser() user: any,
    @Query() query: AnalyticsQueryDto,
    @Query('limit') limit: number = 10,
  ): Promise<TopServicesDto> {
    return this.analyticsService.getTopServices(user.id, user.role, query, limit);
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
    return this.analyticsService.getBusinessPerformance(query, page, limit);
  }

  @Get('businesses/:businessId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get business performance by ID' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, description: 'Business performance', type: BusinessPerformanceDto })
  async getBusinessPerformanceById(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<BusinessPerformanceDto> {
    return this.analyticsService.getBusinessPerformanceById(user.id, user.role, businessId, query);
  }

  // ==================== EXPORT REPORTS ====================

  @Post('export/revenue')
  @Roles('ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export revenue report as CSV' })
  async exportRevenueReport(
    @CurrentUser() user: any,
    @Body() dto: ExportReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const { data, filename } = await this.analyticsService.exportRevenueReport(
      user.id,
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