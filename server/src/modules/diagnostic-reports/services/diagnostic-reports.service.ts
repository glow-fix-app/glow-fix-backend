import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DiagnosticReportsRepository } from '../repositories/diagnostic-reports.repository';
import { DiagnosticReportMapper } from '../mappers/diagnostic-report.mapper';
import { CreateDiagnosticReportDto } from '../dto/request/create-report.dto';
import { UpdateDiagnosticReportDto } from '../dto/request/update-report.dto';
import { DiagnosticReportResponseDto, ReportSummaryDto } from '../dto/response/report-response.dto';
import { DIAGNOSTIC_EVENTS, DEFAULT_VALID_HOURS } from '../constants/diagnostic-report.constants';
import {
  BookingNotFoundException,
  BusinessOwnershipException,
  ReportNotFoundException,
  ReportAccessDeniedException,
  ReportAlreadyRespondedException,
  ClientNotFoundException,
} from '../exceptions/diagnostic-report.exceptions';

@Injectable()
export class DiagnosticReportsService {
  private readonly logger = new Logger(DiagnosticReportsService.name);

  constructor(
    private readonly repository: DiagnosticReportsRepository,
    private readonly mapper: DiagnosticReportMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReport(
    managerId: string,
    dto: CreateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    const booking = await this.repository.findBookingWithRelations(dto.booking_id);

    if (!booking) {
      throw new BookingNotFoundException();
    }

    if (booking.business.managerId !== managerId) {
      throw new BusinessOwnershipException();
    }

    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + (dto.valid_hours || DEFAULT_VALID_HOURS));

    const existingReport = await this.repository.findExistingReport(dto.booking_id);
    if (existingReport) {
      await this.repository.deleteReportChildren(existingReport.id);
    }

    const reportData = {
      summary: dto.summary,
      validUntil,
      estimatedDuration: dto.estimated_duration,
      findings: dto.findings,
      recommendedRepairs: dto.recommended_repairs,
    };

    const report = await this.repository.upsertReport(dto.booking_id, reportData);

    await this.repository.findOrCreateBookingStatus(dto.booking_id, 'DIAGNOSIS_SENT');

    this.logger.log(
      `Diagnostic report created for booking ${dto.booking_id} by manager ${managerId}`,
    );

    this.eventEmitter.emit(DIAGNOSTIC_EVENTS.REPORT_CREATED, {
      bookingId: dto.booking_id,
      clientId: booking.vehicle.client.userId,
      reportId: report.id,
    });

    return this.mapper.toResponseDto(report);
  }

  async getReportByBookingId(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<DiagnosticReportResponseDto | null> {
    const report = await this.repository.findReportByBookingId(bookingId);

    if (!report) return null;

    this.assertAccess(report, userId, userRole);

    if (report.validUntil && new Date() > report.validUntil && !report.clientAction) {
      report.summary = '[EXPIRED] ' + report.summary;
    }

    return this.mapper.toResponseDto(report);
  }

  async getReportById(
    reportId: string,
    userId: string,
    userRole: string,
  ): Promise<DiagnosticReportResponseDto> {
    const report = await this.repository.findReportById(reportId);

    if (!report) {
      throw new ReportNotFoundException();
    }

    this.assertAccess(report, userId, userRole);

    return this.mapper.toResponseDto(report);
  }

  async updateReport(
    managerId: string,
    reportId: string,
    dto: UpdateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    const report = await this.repository.findReportForUpdate(reportId);

    if (!report) {
      throw new ReportNotFoundException();
    }

    if (report.booking.business.managerId !== managerId) {
      throw new BusinessOwnershipException();
    }

    if (report.clientAction) {
      throw new ReportAlreadyRespondedException();
    }

    await this.repository.updateReport(reportId, {
      summary: dto.summary,
      estimatedDuration: dto.estimated_duration,
      updatedAt: new Date(),
    });

    if (dto.findings) {
      await this.repository.replaceFindings(reportId, dto.findings);
    }

    if (dto.recommended_repairs) {
      await this.repository.replaceRepairs(reportId, dto.recommended_repairs);
    }

    const finalReport = await this.repository.findReportWithDetails(reportId);

    this.logger.log(
      `Diagnostic report ${reportId} updated by manager ${managerId}`,
    );

    return this.mapper.toResponseDto(finalReport!);
  }

  async getReportSummary(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<ReportSummaryDto | null> {
    const report = await this.repository.findReportByBookingId(bookingId);

    if (!report) return null;

    this.assertAccess(report, userId, userRole);

    return this.mapper.toSummaryDto(report);
  }

  async getClientReports(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: ReportSummaryDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const client = await this.repository.findClientByUserId(userId);

    if (!client) {
      throw new ClientNotFoundException();
    }

    const [reports, total] = await this.repository.findClientReportsWithCount(client.id, skip, take);

    const data = reports.map((report) => this.mapper.toSummaryDto(report));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private assertAccess(report: any, userId: string, userRole: string): void {
    const isClient = report.booking.vehicle.client.userId === userId;
    const isManager = report.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new ReportAccessDeniedException();
    }
  }
}
