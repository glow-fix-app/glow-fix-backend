import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateDiagnosticReportDto } from './dto/create-report.dto';
import { UpdateDiagnosticReportDto } from './dto/update-report.dto';
import { ClientActionDto, ClientAction } from './dto/client-action.dto';
import {
  DiagnosticReportResponseDto,
  ReportSummaryDto,
} from './dto/report-response.dto';
import { DIAGNOSTIC_EVENTS } from './diagnostic-reports.events';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiagnosticReportsService {
  private readonly logger = new Logger(DiagnosticReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReport(
    managerId: string,
    dto: CreateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.booking_id },
      include: {
        business: true,
        vehicle: {
          include: {
            client: {
              include: { user: true },
            },
          },
        },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.business.managerId !== managerId) {
      throw new ForbiddenException('You do not own this business');
    }

    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + (dto.valid_hours || 72));

    // If a report already exists, delete its nested records first, then update
    const existingReport = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: dto.booking_id },
    });

    if (existingReport) {
      await this.prisma.reportFinding.deleteMany({ where: { reportId: existingReport.id } });
      await this.prisma.recommendedRepair.deleteMany({ where: { reportId: existingReport.id } });
    }

    const report = await this.prisma.diagnosticReport.upsert({
      where: { bookingId: dto.booking_id },
      create: {
        bookingId: dto.booking_id,
        summary: dto.summary,
        validUntil,
        estimatedDuration: dto.estimated_duration,
        findings: {
          create: dto.findings.map((f) => ({
            title: f.title,
            description: f.description,
            priority: f.priority,
          })),
        },
        recommendedRepairs: {
          create: dto.recommended_repairs.map((r) => ({
            businessServiceId: r.business_service_id,
            title: r.title,
            description: r.description,
            price: r.price ? new Prisma.Decimal(r.price.toString()) : undefined,
            durationMinutes: r.duration_minutes,
            isSelected: false,
          })),
        },
      },
      update: {
        summary: dto.summary,
        validUntil,
        estimatedDuration: dto.estimated_duration,
        findings: {
          create: dto.findings.map((f) => ({
            title: f.title,
            description: f.description,
            priority: f.priority,
          })),
        },
        recommendedRepairs: {
          create: dto.recommended_repairs.map((r) => ({
            businessServiceId: r.business_service_id,
            title: r.title,
            description: r.description,
            price: r.price ? new Prisma.Decimal(r.price.toString()) : undefined,
            durationMinutes: r.duration_minutes,
            isSelected: false,
          })),
        },
      },
      include: {
        findings: true,
        recommendedRepairs: true,
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    const diagnosisSentStatus = await this.prisma.status.findFirst({
      where: { context: 'DIAGNOSIS_SENT' },
    });

    if (diagnosisSentStatus) {
      await this.prisma.bookingStatus.create({
        data: {
          bookingId: dto.booking_id,
          statusId: diagnosisSentStatus.id,
        },
      });
    }

    this.logger.log(
      `Diagnostic report created for booking ${dto.booking_id} by manager ${managerId}`,
    );

    this.eventEmitter.emit(DIAGNOSTIC_EVENTS.REPORT_CREATED, {
      bookingId: dto.booking_id,
      clientId: booking.vehicle.client.userId,
      reportId: report.id,
    });

    return this.mapToResponseDto(report);
  }

  async getReportByBookingId(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<DiagnosticReportResponseDto> {
    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId },
      include: {
        findings: true,
        recommendedRepairs: true,
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
      },
    });

    if (!report) {
      throw new NotFoundException(
        'No diagnostic report found for this booking',
      );
    }

    const isClient = report.booking.vehicle.client.userId === userId;
    const isManager = report.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new ForbiddenException('You do not have access to this report');
    }

    if (
      report.validUntil &&
      new Date() > report.validUntil &&
      !report.clientAction
    ) {
      report.summary = '[EXPIRED] ' + report.summary;
    }

    return this.mapToResponseDto(report);
  }

  async getReportById(
    reportId: string,
    userId: string,
    userRole: string,
  ): Promise<DiagnosticReportResponseDto> {
    const report = await this.prisma.diagnosticReport.findUnique({
      where: { id: reportId },
      include: {
        findings: true,
        recommendedRepairs: true,
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
      },
    });

    if (!report) {
      throw new NotFoundException('Diagnostic report not found');
    }

    const isClient = report.booking.vehicle.client.userId === userId;
    const isManager = report.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new ForbiddenException('You do not have access to this report');
    }

    return this.mapToResponseDto(report);
  }

  async updateReport(
    managerId: string,
    reportId: string,
    dto: UpdateDiagnosticReportDto,
  ): Promise<DiagnosticReportResponseDto> {
    const report = await this.prisma.diagnosticReport.findUnique({
      where: { id: reportId },
      include: {
        booking: {
          include: {
            business: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Diagnostic report not found');
    }

    if (report.booking.business.managerId !== managerId) {
      throw new ForbiddenException('You do not own this business');
    }

    if (report.clientAction) {
      throw new BadRequestException(
        'Cannot update report after client has responded',
      );
    }

    const updatedReport = await this.prisma.diagnosticReport.update({
      where: { id: reportId },
      data: {
        summary: dto.summary,
        estimatedDuration: dto.estimated_duration,
        updatedAt: new Date(),
      },
      include: {
        findings: true,
        recommendedRepairs: true,
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (dto.findings) {
      await this.prisma.reportFinding.deleteMany({
        where: { reportId },
      });

      await this.prisma.reportFinding.createMany({
        data: dto.findings.map((f) => ({
          reportId,
          title: f.title,
          description: f.description,
          priority: f.priority,
        })),
      });
    }

    if (dto.recommended_repairs) {
      await this.prisma.recommendedRepair.deleteMany({
        where: { reportId },
      });

      await this.prisma.recommendedRepair.createMany({
        data: dto.recommended_repairs.map((r) => ({
          reportId,
          businessServiceId: r.business_service_id,
          title: r.title,
          description: r.description,
          price: r.price ? new Prisma.Decimal(r.price.toString()) : undefined,
          durationMinutes: r.duration_minutes,
          isSelected: false,
        })),
      });
    }

    const finalReport = await this.prisma.diagnosticReport.findUnique({
      where: { id: reportId },
      include: {
        findings: true,
        recommendedRepairs: true,
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    this.logger.log(
      `Diagnostic report ${reportId} updated by manager ${managerId}`,
    );

    return this.mapToResponseDto(finalReport!);
  }

  async getReportSummary(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<ReportSummaryDto> {
    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId },
      include: {
        findings: true,
        recommendedRepairs: true,
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
      },
    });

    if (!report) {
      throw new NotFoundException(
        'No diagnostic report found for this booking',
      );
    }

    const isClient = report.booking.vehicle.client.userId === userId;
    const isManager = report.booking.business.managerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isClient && !isManager && !isAdmin) {
      throw new ForbiddenException('You do not have access to this report');
    }

    const criticalCount = report.findings.filter(
      (f) => f.priority === 'CRITICAL',
    ).length;
    const warningCount = report.findings.filter(
      (f) => f.priority === 'WARNING',
    ).length;
    const infoCount = report.findings.filter(
      (f) => f.priority === 'INFO',
    ).length;

    const totalCost = report.recommendedRepairs.reduce(
      (sum, r) => sum + (r.price ? Number(r.price) : 0),
      0,
    );

    return {
      report_id: report.id,
      booking_id: report.bookingId,
      booking_code: `BK-${report.bookingId.slice(0, 8).toUpperCase()}`,
      summary: report.summary,
      critical_count: criticalCount,
      warning_count: warningCount,
      info_count: infoCount,
      total_repairs: report.recommendedRepairs.length,
      total_cost: totalCost,
      client_action: report.clientAction || undefined,
      created_at: report.createdAt,
    };
  }

  async getClientReports(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: ReportSummaryDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const [reports, total] = await Promise.all([
      this.prisma.diagnosticReport.findMany({
        where: {
          booking: {
            vehicle: { clientId: client.id },
          },
        },
        include: {
          findings: true,
          recommendedRepairs: true,
          booking: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.diagnosticReport.count({
        where: {
          booking: {
            vehicle: { clientId: client.id },
          },
        },
      }),
    ]);

    const data = reports.map((report) => ({
      report_id: report.id,
      booking_id: report.bookingId,
      booking_code: `BK-${report.bookingId.slice(0, 8).toUpperCase()}`,
      summary: report.summary,
      critical_count: report.findings.filter((f) => f.priority === 'CRITICAL')
        .length,
      warning_count: report.findings.filter((f) => f.priority === 'WARNING')
        .length,
      info_count: report.findings.filter((f) => f.priority === 'INFO').length,
      total_repairs: report.recommendedRepairs.length,
      total_cost:
        report.recommendedRepairs.reduce(
          (sum, r) => sum + (r.price ? Number(r.price) : 0),
          0,
        ),
      client_action: report.clientAction || undefined,
      created_at: report.createdAt,
    }));

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

  // ==================== PRIVATE HELPERS ====================

  private mapToResponseDto(report: any): DiagnosticReportResponseDto {
    const totalCost = report.recommendedRepairs.reduce(
      (sum: number, r: any) => sum + (r.price ? Number(r.price) : 0),
      0,
    );

    return {
      id: report.id,
      booking_id: report.bookingId,
      booking_code: `BK-${report.bookingId.slice(0, 8).toUpperCase()}`,
      summary: report.summary,
      valid_until: report.validUntil || undefined,
      estimated_duration: report.estimatedDuration || undefined,
      client_action: report.clientAction || undefined,
      client_action_at: report.clientActionAt || undefined,
      findings: report.findings.map((f: any) => ({
        id: f.id,
        title: f.title,
        description: f.description || undefined,
        priority: f.priority,
      })),
      recommended_repairs: report.recommendedRepairs.map((r: any) => ({
        id: r.id,
        business_service_id: r.businessServiceId,
        title: r.title || 'Repair Service',
        description: r.description || undefined,
        price: r.price ? Number(r.price) : 0,
        duration_minutes: r.durationMinutes || 60,
        is_selected: r.isSelected || false,
      })),
      total_repair_cost: totalCost,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
    };
  }
}
