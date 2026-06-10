import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  QueryManagerBookingsDto,
  UpdateBookingStatusDto,
  UpdateExpectedDeliveryDto,
  CreateBookingNoteDto,
  CreateDiagnosticReportDto,
  CreateReportFindingDto,
  CreateRecommendedRepairDto,
} from './dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================================================================
  // Helpers
  // =====================================================================

  async getManagerBusinessOrThrow(managerId: string) {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });
    if (!business) {
      throw new NotFoundException('Manager business not found.');
    }
    return business;
  }

  async getManagerBookingOrThrow(managerId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true },
    });
    if (!booking || booking.business.managerId !== managerId) {
      throw new NotFoundException('Booking not found.');
    }
    return booking;
  }

  async getStatusOrThrow(context: string, name: string) {
    const status = await this.prisma.status.findFirst({
      where: { context, name },
    });
    if (!status) {
      throw new NotFoundException(`Status '${name}' for context '${context}' not found.`);
    }
    return status;
  }

  async getLatestBookingStatusName(bookingId: string): Promise<string> {
    const latestStatusEntry = await this.prisma.bookingStatus.findFirst({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
      include: { status: true },
    });
    return latestStatusEntry?.status?.name || 'PENDING';
  }

  assertAllowedStatusTransition(currentStatus: string, nextStatus: string): void {
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot change status from immutable final state: ${currentStatus}`,
      );
    }

    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['VEHICLE_RECEIVED', 'CANCELLED'],
      VEHICLE_RECEIVED: ['INSPECTION_IN_PROGRESS'],
      INSPECTION_IN_PROGRESS: ['WAITING_CLIENT_APPROVAL'],
      WAITING_CLIENT_APPROVAL: ['REPAIR_IN_PROGRESS'],
      REPAIR_IN_PROGRESS: ['READY_FOR_PICKUP'],
      READY_FOR_PICKUP: ['COMPLETED'],
    };

    const targets = allowedTransitions[currentStatus] || [];
    if (!targets.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus}' to '${nextStatus}'.`,
      );
    }
  }

  async assertBusinessServiceBelongsToBusiness(
    businessServiceId: string,
    businessId: string,
  ): Promise<void> {
    const bs = await this.prisma.businessService.findUnique({
      where: { id: businessServiceId },
    });
    if (!bs || bs.businessId !== businessId) {
      throw new BadRequestException(
        `Business service '${businessServiceId}' does not belong to the booking's business.`,
      );
    }
  }

  // =====================================================================
  // Service Methods
  // =====================================================================

  async listBookings(managerId: string, query: QueryManagerBookingsDto) {
    const business = await this.getManagerBusinessOrThrow(managerId);
    const { status, from, to, search, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Filter by latest status via raw SQL distinct subquery
    let bookingIdFilter: string[] | undefined = undefined;
    if (status) {
      const matchingBookings = await this.prisma.$queryRaw<Array<{ booking_id: string; name: string }>>`
        SELECT DISTINCT ON (booking_id) booking_id, s.name
        FROM booking_status bs
        JOIN statuses s ON bs.status_id = s.id
        ORDER BY booking_id, bs.created_at DESC
      `;
      bookingIdFilter = matchingBookings
        .filter((mb) => mb.name === status)
        .map((mb) => mb.booking_id);
    }

    const where: any = {
      businessId: business.id,
      ...(bookingIdFilter !== undefined && {
        id: { in: bookingIdFilter },
      }),
      ...(from &&
        to && {
          scheduledAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      ...(search && {
        OR: [
          {
            vehicle: {
              licensePlate: { contains: search, mode: 'insensitive' },
            },
          },
          {
            vehicle: {
              model: { contains: search, mode: 'insensitive' },
            },
          },
          {
            vehicle: {
              client: {
                user: {
                  fullName: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
          {
            vehicle: {
              client: {
                user: {
                  email: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
          {
            vehicle: {
              client: {
                user: {
                  phone: { contains: search, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      }),
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          business: true,
          statusHistory: {
            include: { status: true },
          },
          vehicle: {
            include: {
              client: {
                include: { user: true },
              },
            },
          },
          items: {
            include: {
              businessService: {
                include: {
                  service: {
                    include: { category: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { bookings, total };
  }

  async getBookingDetails(managerId: string, bookingId: string) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);

    return this.prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        business: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
        },
        vehicle: {
          include: {
            client: {
              include: { user: true },
            },
          },
        },
        items: {
          include: {
            businessService: {
              include: {
                service: {
                  include: { category: true },
                },
              },
            },
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        diagnosticReport: {
          include: {
            findings: {
              orderBy: { createdAt: 'asc' },
            },
            recommendedRepairs: {
              include: {
                businessService: {
                  include: {
                    service: {
                      include: { category: true },
                    },
                  },
                },
              },
            },
          },
        },
        payment: {
          include: {
            status: true,
            paymentMethod: true,
          },
        },
        review: true,
      },
    });
  }

  async updateBookingStatus(managerId: string, bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);
    this.assertAllowedStatusTransition(currentStatus, dto.status);

    const nextStatus = await this.getStatusOrThrow('BOOKING', dto.status);

    return this.prisma.$transaction(async (tx) => {
      // Create new status history entry
      await tx.bookingStatus.create({
        data: {
          bookingId: booking.id,
          statusId: nextStatus.id,
        },
      });

      // Handle cancellation record if target is CANCELLED
      if (dto.status === 'CANCELLED') {
        const existingCancellation = await tx.bookingCancellation.findUnique({
          where: { bookingId: booking.id },
        });
        if (!existingCancellation) {
          await tx.bookingCancellation.create({
            data: {
              bookingId: booking.id,
              cancelledBy: managerId,
              reason: dto.reason || null,
            },
          });
        }
      }

      // Fetch the updated booking to return
      return tx.booking.findUnique({
        where: { id: booking.id },
        include: {
          business: true,
          statusHistory: {
            include: { status: true },
          },
          vehicle: {
            include: {
              client: {
                include: { user: true },
              },
            },
          },
          items: {
            include: {
              businessService: {
                include: {
                  service: {
                    include: { category: true },
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  async updateExpectedDelivery(
    managerId: string,
    bookingId: string,
    dto: UpdateExpectedDeliveryDto,
  ) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);

    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot update expected delivery when booking is in final state: ${currentStatus}`,
      );
    }

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        expectedDeliveryAt: new Date(dto.expectedDeliveryAt),
      },
      include: {
        business: true,
        statusHistory: {
          include: { status: true },
        },
        vehicle: {
          include: {
            client: {
              include: { user: true },
            },
          },
        },
        items: {
          include: {
            businessService: {
              include: {
                service: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getBookingNotes(managerId: string, bookingId: string) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);

    return this.prisma.bookingNote.findMany({
      where: { bookingId: booking.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBookingNote(managerId: string, bookingId: string, dto: CreateBookingNoteDto) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);

    return this.prisma.bookingNote.create({
      data: {
        bookingId: booking.id,
        body: dto.body,
      },
    });
  }

  async createDiagnosticReport(
    managerId: string,
    bookingId: string,
    dto: CreateDiagnosticReportDto,
  ) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);

    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot create diagnostic report when booking is in final state: ${currentStatus}`,
      );
    }

    // Check duplicate report
    const existingReport = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: booking.id },
    });
    if (existingReport) {
      throw new ConflictException('A diagnostic report already exists for this booking.');
    }

    // Validate recommended repairs belong to business
    if (dto.recommendedRepairs) {
      for (const repair of dto.recommendedRepairs) {
        await this.assertBusinessServiceBelongsToBusiness(
          repair.businessServiceId,
          booking.businessId,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const report = await tx.diagnosticReport.create({
        data: {
          bookingId: booking.id,
          summary: dto.summary,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
          estimatedDuration: dto.estimatedDuration || null,
        },
      });

      if (dto.findings && dto.findings.length > 0) {
        await tx.reportFinding.createMany({
          data: dto.findings.map((f) => ({
            reportId: report.id,
            title: f.title,
            description: f.description || null,
            priority: f.priority,
          })),
        });
      }

      if (dto.recommendedRepairs && dto.recommendedRepairs.length > 0) {
        await tx.recommendedRepair.createMany({
          data: dto.recommendedRepairs.map((r) => ({
            reportId: report.id,
            businessServiceId: r.businessServiceId,
          })),
        });
      }

      return tx.diagnosticReport.findUnique({
        where: { id: report.id },
        include: {
          findings: {
            orderBy: { createdAt: 'asc' },
          },
          recommendedRepairs: {
            include: {
              businessService: {
                include: {
                  service: {
                    include: { category: true },
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  async getDiagnosticReport(managerId: string, bookingId: string) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);

    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: booking.id },
      include: {
        findings: {
          orderBy: { createdAt: 'asc' },
        },
        recommendedRepairs: {
          include: {
            businessService: {
              include: {
                service: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Diagnostic report not found for this booking.');
    }
    return report;
  }

  async addReportFinding(managerId: string, bookingId: string, dto: CreateReportFindingDto) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);

    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot add findings when booking is in final state: ${currentStatus}`,
      );
    }

    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: booking.id },
    });
    if (!report) {
      throw new NotFoundException('Diagnostic report not found for this booking.');
    }

    return this.prisma.reportFinding.create({
      data: {
        reportId: report.id,
        title: dto.title,
        description: dto.description || null,
        priority: dto.priority,
      },
    });
  }

  async addRecommendedRepair(
    managerId: string,
    bookingId: string,
    dto: CreateRecommendedRepairDto,
  ) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);

    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot add recommended repairs when booking is in final state: ${currentStatus}`,
      );
    }

    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: booking.id },
    });
    if (!report) {
      throw new NotFoundException('Diagnostic report not found for this booking.');
    }

    await this.assertBusinessServiceBelongsToBusiness(dto.businessServiceId, booking.businessId);

    const repair = await this.prisma.recommendedRepair.create({
      data: {
        reportId: report.id,
        businessServiceId: dto.businessServiceId,
      },
    });

    return this.prisma.recommendedRepair.findUnique({
      where: { id: repair.id },
      include: {
        businessService: {
          include: {
            service: {
              include: { category: true },
            },
          },
        },
      },
    });
  }

  async deleteRecommendedRepair(managerId: string, bookingId: string, repairId: string) {
    const booking = await this.getManagerBookingOrThrow(managerId, bookingId);
    const currentStatus = await this.getLatestBookingStatusName(booking.id);

    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot delete recommended repairs when booking is in final state: ${currentStatus}`,
      );
    }

    const report = await this.prisma.diagnosticReport.findUnique({
      where: { bookingId: booking.id },
    });
    if (!report) {
      throw new NotFoundException('Diagnostic report not found for this booking.');
    }

    const repair = await this.prisma.recommendedRepair.findUnique({
      where: { id: repairId },
    });
    if (!repair || repair.reportId !== report.id) {
      throw new NotFoundException('Recommended repair not found in this diagnostic report.');
    }

    await this.prisma.recommendedRepair.delete({
      where: { id: repairId },
    });

    return { success: true, message: 'Recommended repair successfully deleted.' };
  }
}
