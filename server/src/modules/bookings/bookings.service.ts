import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Fetch client profile
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });
    if (!client) {
      throw new BadRequestException('User does not have a client profile');
    }

    // 2. Verify vehicle ownership
    const vehicle = await this.prisma.clientVehicle.findUnique({
      where: { id: dto.vehicleId },
    });
    if (!vehicle || vehicle.clientId !== client.id) {
      throw new BadRequestException('Vehicle not found or does not belong to this client');
    }

    // 3. Verify business and get operating hours
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
      include: { operatingHours: true },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // 4. Timezone check and Operating Hours validation
    const scheduledDate = new Date(dto.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new BadRequestException('Invalid scheduled date');
    }

    // Convert date to Egypt local timezone (Africa/Cairo)
    const localString = scheduledDate.toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
    const localDate = new Date(localString);
    const dayOfWeek = localDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const localHour = localDate.getHours();
    const localMin = localDate.getMinutes();

    const operatingHour = business.operatingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
    if (!operatingHour || !operatingHour.openTime || !operatingHour.closeTime) {
      throw new BadRequestException('The business is closed on the scheduled day');
    }

    const [openH, openM] = operatingHour.openTime.split(':').map(Number);
    const [closeH, closeM] = operatingHour.closeTime.split(':').map(Number);

    const scheduledTimeMinutes = localHour * 60 + localMin;
    const openTimeMinutes = openH * 60 + openM;
    const closeTimeMinutes = closeH * 60 + closeM;

    if (scheduledTimeMinutes < openTimeMinutes || scheduledTimeMinutes > closeTimeMinutes) {
      throw new BadRequestException('Scheduled time is outside operating hours');
    }

    // 5. Verify services and calculate subTotal
    const businessServices = await this.prisma.businessService.findMany({
      where: {
        id: { in: dto.businessServiceIds },
        businessId: dto.businessId,
        isActive: true,
      },
    });

    if (businessServices.length !== dto.businessServiceIds.length) {
      throw new BadRequestException('One or more selected services are invalid or inactive for this business');
    }

    let subTotal = 0n;
    for (const bs of businessServices) {
      subTotal += bs.price;
    }

    // 6. Fetch setting commission dynamically
    const setting = await this.prisma.setting.findFirst();
    const commissionFeePct = setting ? Number(setting.businessFeePct) : 10.0;
    
    // commission = subTotal * commissionFeePct / 100
    // To perform exact BigInt math: subTotal * Math.round(commissionFeePct * 100) / 10000n
    const commission = (subTotal * BigInt(Math.round(commissionFeePct * 100))) / 10000n;
    const totalPrice = subTotal; // subTotal (excluding discount)

    // 7. Find lookup status for BOOKING
    // Since statuses are defined purely by context in the schema (id, context), we fetch the BOOKING context status row.
    const statusRow = await this.prisma.status.findFirst({
      where: { context: 'BOOKING' },
    });
    if (!statusRow) {
      throw new InternalServerErrorException('Booking status row not found. Please seed the database.');
    }

    // 8. Transactional creation of Booking, BookingItems, and BookingStatus history
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          vehicleId: dto.vehicleId,
          businessId: dto.businessId,
          scheduledAt: scheduledDate,
          subTotal,
          discount: 0n,
          commission,
          totalPrice,
        },
      });

      // Create booking items snapshots
      await tx.bookingItem.createMany({
        data: businessServices.map((bs) => ({
          bookingId: booking.id,
          businessServiceId: bs.id,
          price: bs.price,
        })),
      });

      // Create initial status history entry
      await tx.bookingStatus.create({
        data: {
          bookingId: booking.id,
          statusId: statusRow.id,
        },
      });

      // Create customer notes if provided
      let notesCreated: any[] = [];
      if (dto.notes) {
        const note = await tx.bookingNote.create({
          data: {
            bookingId: booking.id,
            body: dto.notes,
          },
        });
        notesCreated.push(note);
      }

      // Create booking photos if provided (up to 5)
      let imagesCreated: any[] = [];
      if (dto.photos && dto.photos.length > 0) {
        const photoRecords = dto.photos.slice(0, 5).map((url) => ({
          url,
          entityType: 'BOOKING_PROBLEM',
          entityId: booking.id,
        }));
        await tx.image.createMany({
          data: photoRecords,
        });
        // Retrieve them back so we can return actual Database Image rows
        imagesCreated = await tx.image.findMany({
          where: {
            entityType: 'BOOKING_PROBLEM',
            entityId: booking.id,
          },
        });
      }

      return {
        ...booking,
        notes: notesCreated,
        images: imagesCreated,
      };
    });
  }

  async getBookings(userId: string, userRole: string, query: GetBookingsQueryDto) {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (userRole === 'CLIENT') {
      const client = await this.prisma.client.findUnique({ where: { userId } });
      if (!client) {
        throw new BadRequestException('Client profile not found');
      }
      whereClause.vehicle = { clientId: client.id };
    } else if (userRole === 'MANAGER') {
      whereClause.business = { managerId: userId };
    }

    if (status) {
      const normalizedStatus = status.toUpperCase();
      if (normalizedStatus === 'UPCOMING') {
        whereClause.scheduledAt = { gt: new Date() };
        whereClause.cancellation = null;
      } else if (normalizedStatus === 'PAST') {
        whereClause.scheduledAt = { lte: new Date() };
        whereClause.cancellation = null;
      } else if (normalizedStatus === 'CANCELLED') {
        whereClause.cancellation = { isNot: null };
      } else {
        throw new BadRequestException('Invalid status filter. Choose from UPCOMING, PAST, or CANCELLED.');
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: whereClause,
        include: {
          vehicle: true,
          business: true,
          items: {
            include: {
              businessService: {
                include: {
                  service: true,
                },
              },
            },
          },
          statusHistory: {
            include: {
              status: true,
            },
          },
          notes: true,
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where: whereClause }),
    ]);

    // Fetch images for these bookings to avoid N+1 queries
    const bookingIds = data.map((b) => b.id);
    const images = bookingIds.length > 0
      ? await this.prisma.image.findMany({
          where: {
            entityType: 'BOOKING_PROBLEM',
            entityId: { in: bookingIds },
          },
        })
      : [];

    // Map images to their bookings
    const dataWithImages = data.map((booking) => ({
      ...booking,
      images: images.filter((img) => img.entityId === booking.id),
    }));

    return {
      data: dataWithImages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingDetails(userId: string, userRole: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        business: true,
        items: {
          include: {
            businessService: {
              include: {
                service: true,
              },
            },
          },
        },
        statusHistory: {
          include: {
            status: true,
          },
        },
        cancellation: true,
        review: true,
        payoutBookings: true,
        notes: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Enforce role-based access checks
    if (userRole === 'CLIENT') {
      const client = await this.prisma.client.findUnique({ where: { userId } });
      if (!client || booking.vehicle.clientId !== client.id) {
        throw new ForbiddenException('You are not allowed to view this booking');
      }
    } else if (userRole === 'MANAGER') {
      if (booking.business.managerId !== userId) {
        throw new ForbiddenException('You do not manage the business for this booking');
      }
    } else if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Invalid role permissions');
    }

    // Fetch photos/images for this booking
    const images = await this.prisma.image.findMany({
      where: {
        entityType: 'BOOKING_PROBLEM',
        entityId: booking.id,
      },
    });

    return {
      ...booking,
      images,
    };
  }

  async cancelBooking(userId: string, userRole: string, bookingId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        business: true,
        cancellation: true,
        review: true,
        payoutBookings: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Role-based access and ownership check
    if (userRole === 'CLIENT') {
      const client = await this.prisma.client.findUnique({ where: { userId } });
      if (!client || booking.vehicle.clientId !== client.id) {
        throw new ForbiddenException('You cannot cancel this booking');
      }
    } else if (userRole === 'MANAGER') {
      if (booking.business.managerId !== userId) {
        throw new ForbiddenException('You do not manage the business for this booking');
      }
    } else if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Invalid role permissions');
    }

    // Current Status Guard
    if (booking.cancellation) {
      throw new BadRequestException('Booking is already cancelled');
    }
    if (booking.review) {
      throw new BadRequestException('Booking is already completed and reviewed');
    }
    if (booking.payoutBookings.length > 0) {
      throw new BadRequestException('Booking is already processed for payout');
    }

    // Check cancellation cutoff time
    const setting = await this.prisma.setting.findFirst();
    const maxCancelMinutes = setting ? setting.maxCancelMinutes : 120;
    const cutoffTime = new Date(booking.scheduledAt.getTime() - maxCancelMinutes * 60 * 1000);

    if (Date.now() > cutoffTime.getTime()) {
      throw new BadRequestException(`Cannot cancel booking within ${maxCancelMinutes} minutes of appointment`);
    }

    // Find lookup status for BOOKING
    const statusRow = await this.prisma.status.findFirst({
      where: { context: 'BOOKING' },
    });
    if (!statusRow) {
      throw new InternalServerErrorException('Booking status row not found. Please seed the database.');
    }

    // Transactional cancellation logic
    return this.prisma.$transaction(async (tx) => {
      // Create cancellation record
      const cancellation = await tx.bookingCancellation.create({
        data: {
          bookingId: booking.id,
          cancelledBy: userId,
          reason: reason || 'Cancelled by user',
        },
      });

      // Add CANCELLED entry to status history
      await tx.bookingStatus.create({
        data: {
          bookingId: booking.id,
          statusId: statusRow.id,
        },
      });

      return {
        message: 'Booking cancelled successfully',
        cancellation,
      };
    });
  }
}
