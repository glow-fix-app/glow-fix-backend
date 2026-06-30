import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DiagnosticReportsService } from './services/diagnostic-reports.service';
import { CreateDiagnosticReportDto } from './dto/request/create-report.dto';
import { UpdateDiagnosticReportDto } from './dto/request/update-report.dto';
import { ClientActionDto } from './dto/request/client-action.dto';
import {
  DiagnosticReportResponseDto,
  ReportSummaryDto,
} from './dto/response/report-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '@glow-fix/types';

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
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.createReport(user.sub, dto);
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
    @CurrentUser() user: JwtPayload,
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() dto: UpdateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.updateReport(user.sub, reportId, dto);
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
    @CurrentUser() user: JwtPayload,
    @Param('bookingId') bookingId: string,
  ): Promise<DiagnosticReportResponseDto | null> {
    return this.diagnosticReportsService.getReportByBookingId(
      bookingId,
      user.sub,
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
    @CurrentUser() user: JwtPayload,
    @Param('bookingId') bookingId: string,
  ): Promise<ReportSummaryDto | null> {
    return this.diagnosticReportsService.getReportSummary(
      bookingId,
      user.sub,
      user.role,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all reports for current client' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getMyReports(
    @CurrentUser() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: ReportSummaryDto[]; meta: any }> {
    return this.diagnosticReportsService.getClientReports(user.sub, page, limit);
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
    @CurrentUser() user: JwtPayload,
    @Param('reportId', ParseUUIDPipe) reportId: string,
  ): Promise<DiagnosticReportResponseDto> {
    return this.diagnosticReportsService.getReportById(
      reportId,
      user.sub,
      user.role,
    );
  }
}
