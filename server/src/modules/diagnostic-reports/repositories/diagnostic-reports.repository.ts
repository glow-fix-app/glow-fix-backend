import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Prisma, DiagnosticReport } from '@prisma/client';

@Injectable()
export class DiagnosticReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBookingWithRelations(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
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
  }

  async findExistingReport(bookingId: string) {
    return this.prisma.diagnosticReport.findUnique({
      where: { bookingId },
    });
  }

  async deleteReportChildren(reportId: string) {
    await this.prisma.$transaction([
      this.prisma.reportFinding.deleteMany({ where: { reportId } }),
      this.prisma.recommendedRepair.deleteMany({ where: { reportId } }),
    ]);
  }

  async upsertReport(bookingId: string, data: any) {
    return this.prisma.diagnosticReport.upsert({
      where: { bookingId },
      create: {
        bookingId,
        summary: data.summary,
        validUntil: data.validUntil,
        estimatedDuration: data.estimatedDuration,
        findings: {
          create: data.findings,
        },
        recommendedRepairs: {
          create: data.recommendedRepairs,
        },
      },
      update: {
        summary: data.summary,
        validUntil: data.validUntil,
        estimatedDuration: data.estimatedDuration,
        findings: {
          create: data.findings,
        },
        recommendedRepairs: {
          create: data.recommendedRepairs,
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
  }

  async findReportByBookingId(bookingId: string) {
    return this.prisma.diagnosticReport.findUnique({
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
  }

  async findReportById(reportId: string) {
    return this.prisma.diagnosticReport.findUnique({
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
  }

  async findReportForUpdate(reportId: string) {
    return this.prisma.diagnosticReport.findUnique({
      where: { id: reportId },
      include: {
        booking: {
          include: {
            business: true,
          },
        },
      },
    });
  }

  async updateReport(reportId: string, data: any) {
    return this.prisma.diagnosticReport.update({
      where: { id: reportId },
      data,
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
  }

  async replaceFindings(reportId: string, findings: any[]) {
    await this.prisma.$transaction([
      this.prisma.reportFinding.deleteMany({ where: { reportId } }),
      this.prisma.reportFinding.createMany({
        data: findings.map((f) => ({ ...f, reportId })),
      }),
    ]);
  }

  async replaceRepairs(reportId: string, repairs: any[]) {
    await this.prisma.$transaction([
      this.prisma.recommendedRepair.deleteMany({ where: { reportId } }),
      this.prisma.recommendedRepair.createMany({
        data: repairs.map((r) => ({ ...r, reportId })),
      }),
    ]);
  }

  async findReportWithDetails(reportId: string) {
    return this.prisma.diagnosticReport.findUnique({
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
  }

  async findClientByUserId(userId: string) {
    return this.prisma.client.findUnique({
      where: { userId },
    });
  }

  async findClientReportsWithCount(clientId: string, skip: number, take: number) {
    return Promise.all([
      this.prisma.diagnosticReport.findMany({
        where: {
          booking: {
            vehicle: { clientId },
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
            vehicle: { clientId },
          },
        },
      }),
    ]);
  }

  async findOrCreateBookingStatus(bookingId: string, context: string) {
    const status = await this.prisma.status.findFirst({
      where: { context },
    });

    if (status) {
      await this.prisma.bookingStatus.create({
        data: {
          bookingId,
          statusId: status.id,
        },
      });
    }
  }
}
