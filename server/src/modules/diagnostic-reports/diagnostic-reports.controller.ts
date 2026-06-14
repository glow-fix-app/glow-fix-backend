import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DiagnosticReportsService } from './diagnostic-reports.service';
import { CreateDiagnosticReportDto } from './dto/create-report.dto';
import { UpdateDiagnosticReportDto } from './dto/update-report.dto';
import { ClientActionDto } from './dto/client-action.dto';
import {
  DiagnosticReportResponseDto,
  ReportSummaryDto,
} from './dto/report-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Diagnostic Reports')
@ApiBearerAuth()
@Controller({ path: 'diagnostic-reports', version: '1' })
export class DiagnosticReportsController {
  constructor(
    private readonly diagnosticReportsService: DiagnosticReportsService,
  ) {}

  // ==================== MANAGER/PROVIDER ENDPOINTS ====================

  @Post()
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Create a diagnostic report (manager only)' })
  @ApiResponse({
    status: 201,
    description: 'Report created',
    type: DiagnosticReportResponseDto,
  })
  async createReport(
    @CurrentUser() user: any,
    @Body() dto: CreateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.createReport(user.id, dto);
  }

  @Put(':reportId')
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Update a diagnostic report (manager only)' })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report updated',
    type: DiagnosticReportResponseDto,
  })
  async updateReport(
    @CurrentUser() user: any,
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() dto: UpdateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.updateReport(user.id, reportId, dto);
  }

  // ==================== CLIENT ENDPOINTS ====================

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get diagnostic report by booking ID' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report details',
    type: DiagnosticReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getReportByBookingId(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
  ): Promise<DiagnosticReportResponseDto | null> {
    return this.diagnosticReportsService.getReportByBookingId(
      bookingId,
      user.id,
      user.role,
    );
  }

  @Get('booking/:bookingId/summary')
  @ApiOperation({ summary: 'Get report summary for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report summary',
    type: ReportSummaryDto,
  })
  async getReportSummary(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
  ): Promise<ReportSummaryDto | null> {
    return this.diagnosticReportsService.getReportSummary(
      bookingId,
      user.id,
      user.role,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all reports for current client' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getMyReports(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: ReportSummaryDto[]; meta: any }> {
    return this.diagnosticReportsService.getClientReports(user.id, page, limit);
  }

  // ==================== SHARED ENDPOINTS ====================

  @Get(':reportId')
  @ApiOperation({ summary: 'Get diagnostic report by ID' })
  @ApiParam({ name: 'reportId', description: 'Report UUID' })
  @ApiResponse({
    status: 200,
    description: 'Report details',
    type: DiagnosticReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getReportById(
    @CurrentUser() user: any,
    @Param('reportId', ParseUUIDPipe) reportId: string,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.getReportById(
      reportId,
      user.id,
      user.role,
    );
  }
}
