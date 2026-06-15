import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ReviewBookingDto, ReviewStatus } from './dto/review-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ==================== CLIENT WORKFLOWS ====================

  async createBooking(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    // 1. Resolve client from userId
    const client = await this.prisma.client.findUnique({
      where: { userId },
      include: { user: true }
    });
    if (!client) {
      throw new ForbiddenException('User is not registered as a client');
    }

    // 2. Verify vehicle belongs to client
    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: { id: dto.vehicleId, clientId: client.id }
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found or does not belong to you');
    }

    // 3. Verify business/provider exists
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
      include: { manager: true, operatingHours: true }
    });
    if (!business) {
      throw new NotFoundException('Business/Provider not found');
    }

    // 4. Resolve selected business services and check matching businessId
    const businessServices = await this.prisma.businessService.findMany({
      where: {
        id: { in: dto.items.map(item => item.businessServiceId) },
        businessId: dto.businessId,
        isActive: true
      },
      include: { service: true }
    });

    if (businessServices.length !== dto.items.length) {
      throw new BadRequestException('Some selected services are invalid, inactive, or not offered by this provider');
    }

    // 5. Validate scheduledAt: must be in the future and within 7 days
    const scheduledAt = new Date(dto.scheduledAt);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);
    maxDate.setHours(23, 59, 59, 999);

    if (isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid scheduled date/time');
    }
    if (scheduledAt.getTime() <= now.getTime()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }
    if (scheduledAt.getTime() > maxDate.getTime()) {
      throw new BadRequestException('Scheduled time cannot be more than 7 days in advance');
    }

    if (business.operatingHours && business.operatingHours.length > 0) {
      // Get the local day and time in Egypt
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Cairo',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(scheduledAt);

      const dayName = parts.find(p => p.type === 'weekday')?.value;
      const hour = parts.find(p => p.type === 'hour')?.value;
      const minute = parts.find(p => p.type === 'minute')?.value;
      
      const dayMap: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
      const dayOfWeek = dayName ? dayMap[dayName] : scheduledAt.getDay();
      const timeString = hour && minute ? `${hour}:${minute}` : `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`;

      const hoursForDay = business.operatingHours.find(h => h.dayOfWeek === dayOfWeek);
      
      if (!hoursForDay || (!hoursForDay.openTime && !hoursForDay.closeTime)) {
        throw new BadRequestException('The provider is closed on the selected day');
      }

      if (hoursForDay.openTime && hoursForDay.closeTime) {
        if (timeString < hoursForDay.openTime || timeString > hoursForDay.closeTime) {
          throw new BadRequestException(`The selected time is outside the provider's operating hours (${hoursForDay.openTime} - ${hoursForDay.closeTime})`);
        }
      }
    }

    // 6. Calculate financials
    const subTotal = businessServices.reduce((sum, bs) => sum + Number(bs.price), 0);
    const setting = await this.prisma.setting.findFirst();
    const feePct = setting?.businessFeePct ? Number(setting.businessFeePct) : 10.0;
    const commission = (subTotal * feePct) / 100;
    const platformFee = setting?.clientPlatformFee ? Number(setting.clientPlatformFee) : 0;
    const totalPrice = subTotal + platformFee; // subtotal + platform fee minus discounts (initially 0)

    // 6. DB transaction to create booking, booking items, status history
    const booking = await this.prisma.$transaction(async (tx) => {
      const pendingStatus = await tx.status.findFirst({
        where: { context: 'PENDING' }
      });
      if (!pendingStatus) {
        throw new Error('PENDING status not found in database');
      }

      // Create Booking
      const newBooking = await tx.booking.create({
        data: {
          id: `BKG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          vehicleId: dto.vehicleId,
          businessId: dto.businessId,
          scheduledAt: new Date(dto.scheduledAt),
          expectedDeliveryAt: dto.expectedDeliveryAt ? new Date(dto.expectedDeliveryAt) : null,
          subTotal: new Prisma.Decimal(subTotal.toString()),
          discount: new Prisma.Decimal('0.00'),
          platformFee: new Prisma.Decimal(platformFee.toString()),
          commission: new Prisma.Decimal(commission.toString()),
          totalPrice: new Prisma.Decimal(totalPrice.toString()),
          notes: dto.note ? { create: { body: dto.note } } : undefined,
        },
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          }
        }
      });

      // Create booking status history record
      await tx.bookingStatus.create({
        data: {
          bookingId: newBooking.id,
          statusId: pendingStatus.id
        }
      });

      // Create booking items
      await tx.bookingItem.createMany({
        data: businessServices.map(bs => ({
          bookingId: newBooking.id,
          businessServiceId: bs.id,
          price: bs.price
        }))
      });

      // Associate problem images if any
      if (dto.images && dto.images.length > 0) {
        await tx.image.createMany({
          data: dto.images.map(img => ({
            url: img.url,
            storageKey: img.storageKey,
            entityType: 'BOOKING_PROBLEM',
            entityId: newBooking.id
          }))
        });
      }

      // Return the booking with fresh relations
      return tx.booking.findUnique({
        where: { id: newBooking.id },
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
        payment: {
          include: {
            status: true,
            paymentMethod: true
          }
        },
        diagnosticReport: {
          include: {
            findings: true,
            recommendedRepairs: true
          }
        }
      }
    });
    });

    if (!booking) {
      throw new Error('Failed to retrieve newly created booking');
    }

    // 7. Trigger notification to Manager
    try {
      await this.notificationsService.createNotification({
        recipientUserId: business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'New Booking Request',
        body: `Client ${client.user.fullName} requested a booking for ${vehicle.licensePlate} scheduled at ${new Date(dto.scheduledAt).toLocaleString()}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    return this.formatBooking(booking, dto.images?.map(img => img.url) || []);
  }

  async getClientBookings(userId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) {
      throw new ForbiddenException('User is not registered as a client');
    }

    const where: Prisma.BookingWhereInput = {
      vehicle: { clientId: client.id }
    };

    // Apply strict latest status filter if requested
    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }

    // Apply scheduledAt date range filters
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) {
      scheduledAtFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const endStr = query.endDate.includes('T') ? query.endDate : `${query.endDate}T23:59:59.999Z`;
      scheduledAtFilter.lte = new Date(endStr);
    }
    if (query.startDate || query.endDate) {
      where.scheduledAt = scheduledAtFilter;
    }

    // Search filter
    if (query.search) {
      where.OR = [
        {
          notes: {
            some: {
              body: { contains: query.search, mode: 'insensitive' }
            }
          }
        },
        {
          business: {
            businessName: { contains: query.search, mode: 'insensitive' }
          }
        },
        {
          vehicle: {
            licensePlate: { contains: query.search, mode: 'insensitive' }
          }
        }
      ];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: {
              status: true,
              paymentMethod: true
            }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.getBookingImages(b.id);
        return this.formatBooking(b, images);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getClientBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) {
      throw new ForbiddenException('User is not registered as a client');
    }

    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: {
        vehicle: true,
        business: true,
        cancellation: true,
        notes: true,
        diagnosticReport: {
          include: {
            findings: true,
            recommendedRepairs: true
          }
        },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: {
          include: {
            businessService: {
              include: { service: true }
            }
          }
        },
        payment: {
          include: {
            status: true,
            paymentMethod: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const businessLoc: any[] = await this.prisma.$queryRaw`
      SELECT ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude
      FROM businesses
      WHERE id = ${booking.businessId}::uuid
    `;
    if (businessLoc.length > 0) {
      (booking.business as any).latitude = businessLoc[0].latitude;
      (booking.business as any).longitude = businessLoc[0].longitude;
    }

    const images = await this.getBookingImages(booking.id);
    return this.formatBooking(booking, images);
  }

  async cancelBookingByClient(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) {
      throw new ForbiddenException('User is not registered as a client');
    }

    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: {
        business: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);

    // Allow cancellation only before work has started.
    // Cancellable states: PENDING, CONFIRMED, VEHICLE_RECEIVED.
    // Once the booking reaches IN_PROGRESS (or later), it can no longer be cancelled by the client.
    const cancellableStates = ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'];
    if (!cancellableStates.includes(currentStatus)) {
      throw new BadRequestException(
        `Booking cannot be cancelled once work has started. Current status: ${currentStatus}`
      );
    }

    const updatedBooking = await this.transitionBookingStatus(bookingId, 'CANCELLED', async (tx, cancelledStatusRow) => {
      // Record cancellation reason
      await tx.bookingCancellation.create({
        data: {
          bookingId,
          cancelledBy: userId,
          reason: dto.reason ?? 'Cancelled by client'
        }
      });
    });

    // Notify Manager
    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Client',
        body: `Booking ${booking.id.slice(0,8)} has been cancelled. Reason: ${dto.reason ?? 'Client request'}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    const images = await this.getBookingImages(booking.id);
    return this.formatBooking(updatedBooking, images);
  }

  async rescheduleBookingByClient(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) {
      throw new ForbiddenException('User is not registered as a client');
    }

    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: {
        business: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
      throw new BadRequestException(`Cannot reschedule booking in status: ${currentStatus}`);
    }

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) {
      throw new BadRequestException('New scheduled date must be in the future');
    }

    // Clients reschedule moves booking back to PENDING for manager's confirmation
    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const pendingStatus = await tx.status.findFirst({ where: { context: 'PENDING' } });
      if (!pendingStatus) throw new Error('PENDING status row missing');

      // Update date
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          scheduledAt: newDate,
          expectedDeliveryAt: null // clear delivery estimate, provider must re-estimate
        }
      });

      // If status isn't already PENDING, add history record
      if (currentStatus !== 'PENDING') {
        await tx.bookingStatus.create({
          data: {
            bookingId,
            statusId: pendingStatus.id
          }
        });
      }

      return updated;
    });

    // Fetch full details
    const fullBooking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: true,
        business: true,
        notes: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: {
          include: {
            businessService: {
              include: { service: true }
            }
          }
        },
        payment: {
          include: { status: true, paymentMethod: true }
        }
      }
    });

    // Notify Manager
    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'Booking Rescheduled by Client',
        body: `Client requested to reschedule Booking ${booking.id.slice(0,8)} to ${newDate.toLocaleString()}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    const images = await this.getBookingImages(bookingId);
    return this.formatBooking(fullBooking, images);
  }


  // ==================== MANAGER WORKFLOWS ====================

  async getManagerBookings(userId: string, query: BookingQueryDto) {
    const where: Prisma.BookingWhereInput = {
      business: { managerId: userId }
    };

    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }

    // Apply scheduledAt date range filters
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) {
      scheduledAtFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const endStr = query.endDate.includes('T') ? query.endDate : `${query.endDate}T23:59:59.999Z`;
      scheduledAtFilter.lte = new Date(endStr);
    }
    if (query.startDate || query.endDate) {
      where.scheduledAt = scheduledAtFilter;
    }

    if (query.search) {
      where.OR = [
        {
          notes: {
            some: {
              body: { contains: query.search, mode: 'insensitive' }
            }
          }
        },
        {
          vehicle: {
            licensePlate: { contains: query.search, mode: 'insensitive' }
          }
        },
        {
          vehicle: {
            client: {
              user: {
                fullName: { contains: query.search, mode: 'insensitive' }
              }
            }
          }
        }
      ];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    let orderByQuery: any = { scheduledAt: 'desc' };
    if (query.sortBy === 'deliveryDate') {
      orderByQuery = { expectedDeliveryAt: query.sortOrder === 'desc' ? 'desc' : 'asc' };
    } else if (query.status === 'PENDING') {
      orderByQuery = { createdAt: 'desc' };
    } else if (query.startDate && query.startDate === query.endDate) {
      orderByQuery = { scheduledAt: 'asc' };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: {
            include: {
              client: {
                include: { user: true }
              }
            }
          },
          business: true,
          cancellation: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: {
              status: true,
              paymentMethod: true
            }
          }
        },
        orderBy: orderByQuery,
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    // Batch resolve client avatars
    const userIds = bookings
      .map((b) => b.vehicle?.client?.user?.id)
      .filter(Boolean) as string[];

    const avatars = userIds.length > 0
      ? await this.prisma.image.findMany({
          where: {
            entityType: 'USER_AVATAR',
            entityId: { in: userIds }
          },
          select: { entityId: true, url: true }
        })
      : [];
    const avatarMap = new Map<string, string>(avatars.map((a) => [a.entityId, a.url]));

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.getBookingImages(b.id);
        const uId = b.vehicle?.client?.user?.id;
        const avatarUrl = uId ? (avatarMap.get(uId) || null) : null;
        return this.formatBooking(b, images, avatarUrl);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getManagerBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: {
        vehicle: {
          include: { client: { include: { user: true } } }
        },
        business: true,
        cancellation: true,
        notes: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: {
          include: {
            businessService: {
              include: { service: true }
            }
          }
        },
        payment: {
          include: {
            status: true,
            paymentMethod: true
          }
        },
        diagnosticReport: {
          include: {
            findings: true,
            recommendedRepairs: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const images = await this.getBookingImages(booking.id);
    const avatarUrl = await this.getUserAvatarByVehicleId(booking.vehicleId);
    return this.formatBooking(booking, images, avatarUrl);
  }

  async reviewBookingByManager(userId: string, bookingId: string, dto: ReviewBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: {
        vehicle: { include: { client: { include: { user: true } } } },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: true
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING') {
      throw new BadRequestException(`Booking is already reviewed or processed. Current status: ${currentStatus}`);
    }

    let updatedBooking;

    if (dto.status === ReviewStatus.REJECTED) {
      // 1. REJECT transitions status to REJECTED
      updatedBooking = await this.transitionBookingStatus(bookingId, 'REJECTED', async (tx, statusRow) => {
        // Record details in cancellation table
        await tx.bookingCancellation.create({
          data: {
            bookingId,
            cancelledBy: userId,
            reason: dto.rejectionReason ?? 'Rejected by manager'
          }
        });
      });

      // Notify Client
      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CANCELLED',
          title: 'Booking Request Rejected',
          body: `Your booking request ${booking.id.slice(0,8)} has been rejected by the provider. Reason: ${dto.rejectionReason ?? 'Provider choice'}`,
          actionUrl: `/client/bookings/${booking.id}`
        });
      } catch (err) {
        this.logger.error(`Notification failed: ${(err as any).message}`);
      }
    } else {
      // 2. ACCEPT transitions status to ACCEPTED
      updatedBooking = await this.prisma.$transaction(async (tx) => {
        const acceptedStatus = await tx.status.findFirst({ where: { context: 'ACCEPTED' } });
        if (!acceptedStatus) throw new Error('ACCEPTED status missing');

        // Update items/prices if provided
        if (dto.items && dto.items.length > 0) {
          // Verify items belong to this booking
          const activeItemBsIds = booking.items.map(i => i.businessServiceId);
          for (const item of dto.items) {
            if (!activeItemBsIds.includes(item.businessServiceId)) {
              throw new BadRequestException(`Item ${item.businessServiceId} is not in the original booking request`);
            }
            if (item.price !== undefined) {
              await tx.bookingItem.updateMany({
                where: { bookingId, businessServiceId: item.businessServiceId },
                data: { price: new Prisma.Decimal(item.price.toString()) }
              });
            }
          }
        }

        // Recalculate financial fields based on updated items
        const finalItems = await tx.bookingItem.findMany({
          where: { bookingId }
        });
        const subTotal = finalItems.reduce((sum, item) => sum + Number(item.price), 0);
        const setting = await tx.setting.findFirst();
        const feePct = setting?.businessFeePct ? Number(setting.businessFeePct) : 10.0;
        const commission = (subTotal * feePct) / 100;
        const platformFee = Number((booking as any).platformFee || 0);
        const totalPrice = subTotal + platformFee; // subtotal + platform fee minus discount (initially 0)

        // Update booking finances and expected delivery
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            subTotal: new Prisma.Decimal(subTotal.toString()),
            commission: new Prisma.Decimal(commission.toString()),
            totalPrice: new Prisma.Decimal(totalPrice.toString()),
            ...(dto.expectedDeliveryAt && { expectedDeliveryAt: new Date(dto.expectedDeliveryAt) }),
          }
        });

        // Add status history record
        await tx.bookingStatus.create({
          data: {
            bookingId,
            statusId: acceptedStatus.id
          }
        });

        // Initialize pending payment
        const pendingPaymentStatus = await tx.status.findFirst({ where: { context: 'PAYMENT_PENDING' } });
        let defaultPaymentMethod = await tx.paymentMethod.findFirst({ where: { name: 'CASH' } });
        if (!defaultPaymentMethod) {
          defaultPaymentMethod = await tx.paymentMethod.create({ data: { name: 'CASH', isEnabled: true } });
        }
        if (pendingPaymentStatus && defaultPaymentMethod) {
          await tx.payment.upsert({
            where: { bookingId },
            create: {
              bookingId,
              amount: new Prisma.Decimal(totalPrice.toString()),
              currency: 'EGP',
              statusId: pendingPaymentStatus.id,
              paymentMethodId: defaultPaymentMethod.id,
              provider: 'system'
            },
            update: {
              amount: new Prisma.Decimal(totalPrice.toString()),
            }
          });
        }

        return tx.booking.findUnique({
          where: { id: bookingId },
          include: {
            vehicle: true,
            business: true,
            notes: true,
            statusHistory: {
              include: { status: true },
              orderBy: { createdAt: 'asc' }
            },
            items: {
              include: {
                businessService: {
                  include: { service: true }
                }
              }
            },
            payment: {
              include: { status: true, paymentMethod: true }
            }
          }
        });
      });

      // Notify Client
      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CONFIRMED',
          title: 'Booking Request Approved',
          body: `Your booking request ${booking.id.slice(0,8)} has been accepted by the provider! Please proceed to payment.`,
          actionUrl: `/client/bookings/${booking.id}`
        });
      } catch (err) {
        this.logger.error(`Notification failed: ${(err as any).message}`);
      }
    }

    if (!updatedBooking) {
      throw new Error('Failed to retrieve updated booking');
    }

    const images = await this.getBookingImages(bookingId);
    const avatarUrl = await this.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.formatBooking(updatedBooking, images, avatarUrl);
  }

  async updateBookingStatusByManager(userId: string, bookingId: string, dto: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: {
        vehicle: { include: { client: { include: { user: true } } } },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        payment: {
          include: { status: true }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);
    const targetStatus = dto.status === 'READY' ? 'READY_FOR_PICKUP' : dto.status;

    if (targetStatus === 'CONFIRMED' || targetStatus === 'ACCEPTED') {
      throw new BadRequestException('Booking cannot be manually changed to ACCEPTED or CONFIRMED.');
    }

    if (targetStatus === 'COMPLETED') {
      const paymentStatus = booking.payment?.status?.context;
      if (paymentStatus !== 'PAID') {
        throw new BadRequestException('Booking cannot be marked as COMPLETED until payment is fully paid.');
      }
    }

    // State machine check
    this.validateStateTransition(currentStatus, targetStatus);

    const updatedBooking = await this.transitionBookingStatus(bookingId, targetStatus);

    // Notifications and side-effects
    try {
      const clientUserId = booking.vehicle.client.userId;
      const ref = booking.id.slice(0, 8);
      switch (targetStatus) {
        case 'VEHICLE_RECEIVED':
          await this.notificationsService.createNotification({
            recipientUserId: clientUserId,
            actorUserId: userId,
            typeCode: 'VEHICLE_RECEIVED',
            title: 'Vehicle Received',
            body: `Your vehicle is received by the workshop for Booking ${ref}`,
            actionUrl: `/client/bookings/${bookingId}`
          });
          break;
        case 'IN_PROGRESS':
          await this.notificationsService.createNotification({
            recipientUserId: clientUserId,
            actorUserId: userId,
            typeCode: 'SERVICE_IN_PROGRESS',
            title: 'Service In Progress',
            body: `The service has officially started on your vehicle for Booking ${ref}`,
            actionUrl: `/client/bookings/${bookingId}`
          });
          break;
        case 'READY_FOR_PICKUP':
          await this.notificationsService.createNotification({
            recipientUserId: clientUserId,
            actorUserId: userId,
            typeCode: 'READY_FOR_PICKUP',
            title: 'Ready for Pickup',
            body: `Your vehicle is ready! Please complete payment and pick up your vehicle. Booking ${ref}`,
            actionUrl: `/client/bookings/${bookingId}`
          });
          break;
        case 'COMPLETED':
          // Award Loyalty Points only when fully completed
          const config = await this.prisma.loyaltyConfig.findFirst();
          if (booking.payment && Number(booking.payment.amount) > 0 && config?.isActive) {
            const amount = Number(booking.payment.amount);
            const pointsEarned = Math.floor((amount / 100) * config.pointsPer100Egp);
            
            await this.prisma.loyaltyTransaction.create({
              data: {
                clientId: booking.vehicle.clientId,
                bookingId: booking.id,
                type: 'EARNED',
                points: pointsEarned,
                reason: `Earned ${pointsEarned} points from booking (${amount} EGP)`,
              },
            });

            // Notify user of earned points
            await this.notificationsService.createNotification({
              recipientUserId: clientUserId,
              actorUserId: userId,
              typeCode: 'POINTS_EARNED',
              title: 'Loyalty Points Earned!',
              body: `You just earned ${pointsEarned} points for completing Booking ${ref}!`,
              actionUrl: `/client/loyalty`
            });
          }

          await this.notificationsService.createNotification({
            recipientUserId: clientUserId,
            actorUserId: userId,
            typeCode: 'BOOKING_COMPLETED',
            title: 'Booking Completed',
            body: `Thank you for choosing us! Booking ${ref} is now completed.`,
            actionUrl: `/client/bookings/${bookingId}`
          });
          await this.notificationsService.createNotification({
            recipientUserId: clientUserId,
            actorUserId: userId,
            typeCode: 'NEW_REVIEW',
            title: 'Rate Your Service',
            body: `Please take a moment to rate and review your completed booking ${ref}.`,
            actionUrl: `/client/bookings/${bookingId}`
          });
          break;
      }
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    if (!updatedBooking) {
      throw new NotFoundException('Updated booking not found');
    }
    const images = await this.getBookingImages(bookingId);
    const avatarUrl = await this.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.formatBooking(updatedBooking, images, avatarUrl);
  }

  async rescheduleBookingByManager(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: {
        vehicle: { include: { client: { include: { user: true } } } },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);
    const restrictedRescheduleStates = ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'REJECTED'];
    if (restrictedRescheduleStates.includes(currentStatus)) {
      throw new BadRequestException(`Cannot reschedule booking in status: ${currentStatus}`);
    }

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) {
      throw new BadRequestException('New scheduled date must be in the future');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        scheduledAt: newDate
      },
      include: {
        vehicle: true,
        business: true,
        notes: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: {
          include: {
            businessService: {
              include: { service: true }
            }
          }
        },
        payment: {
          include: { status: true, paymentMethod: true }
        }
      }
    });

    // Notify Client
    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CONFIRMED',
        title: 'Booking Rescheduled by Provider',
        body: `The provider rescheduled Booking ${booking.id.slice(0,8)} to ${newDate.toLocaleString()}`,
        actionUrl: `/client/bookings/${bookingId}`
      });
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    const images = await this.getBookingImages(bookingId);
    const avatarUrl = await this.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.formatBooking(updatedBooking, images, avatarUrl);
  }

  async cancelBookingByManager(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: {
        vehicle: { include: { client: { include: { user: true } } } },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const currentStatus = this.getLatestStatusContext(booking.statusHistory);
    const uncancelableStates = ['COMPLETED', 'CANCELLED', 'REJECTED'];
    if (uncancelableStates.includes(currentStatus)) {
      throw new BadRequestException(`Cannot cancel booking from its current status: ${currentStatus}`);
    }

    const updatedBooking = await this.transitionBookingStatus(bookingId, 'CANCELLED', async (tx, cancelledStatusRow) => {
      // Record cancellation
      await tx.bookingCancellation.create({
        data: {
          bookingId,
          cancelledBy: userId,
          reason: dto.reason ?? 'Cancelled by manager'
        }
      });
    });

    // Notify Client
    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Provider',
        body: `Your booking ${booking.id.slice(0,8)} has been cancelled by the provider. Reason: ${dto.reason ?? 'Provider request'}`,
        actionUrl: `/client/bookings/${bookingId}`
      });
    } catch (err) {
      this.logger.error(`Notification failed: ${(err as any).message}`);
    }

    if (!updatedBooking) {
      throw new NotFoundException('Updated booking not found');
    }
    const images = await this.getBookingImages(bookingId);
    const avatarUrl = await this.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.formatBooking(updatedBooking, images, avatarUrl);
  }


  // ==================== ADMIN WORKFLOWS ====================

  async getAdminBookings(query: BookingQueryDto) {
    const where: Prisma.BookingWhereInput = {};

    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }

    // Apply scheduledAt date range filters
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) {
      scheduledAtFilter.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      scheduledAtFilter.lte = new Date(query.endDate);
    }
    if (query.startDate || query.endDate) {
      where.scheduledAt = scheduledAtFilter;
    }

    if (query.search) {
      where.OR = [
        {
          notes: {
            some: {
              body: { contains: query.search, mode: 'insensitive' }
            }
          }
        },
        {
          business: {
            businessName: { contains: query.search, mode: 'insensitive' }
          }
        },
        {
          vehicle: {
            licensePlate: { contains: query.search, mode: 'insensitive' }
          }
        },
        {
          vehicle: {
            client: {
              user: {
                fullName: { contains: query.search, mode: 'insensitive' }
              }
            }
          }
        }
      ];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: {
              status: true,
              paymentMethod: true
            }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.getBookingImages(b.id);
        return this.formatBooking(b, images);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getAdminBooking(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: { client: { include: { user: true } } }
        },
        business: true,
        notes: true,
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'asc' }
        },
        items: {
          include: {
            businessService: {
              include: { service: true }
            }
          }
        },
        payment: {
          include: {
            status: true,
            paymentMethod: true
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const images = await this.getBookingImages(booking.id);
    return this.formatBooking(booking, images);
  }

  async getBookingsByManager(managerId: string, query: BookingQueryDto) {
    const where: Prisma.BookingWhereInput = {
      business: { managerId }
    };

    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: {
              status: true,
              paymentMethod: true
            }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.getBookingImages(b.id);
        return this.formatBooking(b, images);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getBookingsByUser(clientUserId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId: clientUserId } });
    if (!client) {
      throw new NotFoundException('Client user profile not found');
    }

    const where: Prisma.BookingWhereInput = {
      vehicle: { clientId: client.id }
    };

    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: {
              status: true,
              paymentMethod: true
            }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.getBookingImages(b.id);
        return this.formatBooking(b, images);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }


  // ==================== INTERNAL STATE MACHINE & HELPERS ====================

  private validateStateTransition(current: string, target: string): void {
    const transitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['VEHICLE_RECEIVED', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
      VEHICLE_RECEIVED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
      DIAGNOSIS_SENT: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
      DIAGNOSIS_ACCEPTED: ['IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
      DIAGNOSIS_REJECTED: ['CANCELLED', 'IN_PROGRESS'],
      IN_PROGRESS: ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'],
      READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      REJECTED: []
    };

    const allowed = transitions[current] || [];
    if (!allowed.includes(target)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${target}`);
    }
  }

  private async transitionBookingStatus(
    bookingId: string,
    targetContext: string,
    additionalOperations?: (tx: Prisma.TransactionClient, statusRow: any) => Promise<void>
  ) {
    return this.prisma.$transaction(async (tx) => {
      const targetStatus = await tx.status.findFirst({
        where: { context: targetContext }
      });
      if (!targetStatus) {
        throw new Error(`Target status ${targetContext} not found in database`);
      }

      // Add status history record
      await tx.bookingStatus.create({
        data: {
          bookingId,
          statusId: targetStatus.id
        }
      });

      // Automatically handle payment cancellations and refunds
      if (targetContext === 'CANCELLED') {
        const payment = await tx.payment.findUnique({
          where: { bookingId },
          include: { status: true }
        });
        
        if (payment && !['REFUNDED', 'CANCELLED'].includes(payment.status.context)) {
          const newStatusContext = payment.status.context === 'PAID' ? 'REFUNDED' : 'CANCELLED';
          const newPaymentStatus = await tx.status.findFirst({ where: { context: newStatusContext } });
          
          if (newPaymentStatus) {
            await tx.payment.update({
              where: { id: payment.id },
              data: { statusId: newPaymentStatus.id }
            });
            
            // Refund loyalty points if they redeemed points
            const pointsRedemption = await tx.loyaltyTransaction.findFirst({
              where: { bookingId, type: 'REDEEMED' }
            });
            
            if (pointsRedemption) {
               await tx.loyaltyTransaction.create({
                 data: {
                   clientId: pointsRedemption.clientId,
                   bookingId: bookingId,
                   type: 'EARNED',
                   points: Math.abs(Number(pointsRedemption.points)),
                   reason: `Refunded points for cancelled booking ${bookingId.substring(0, 8)}`
                 }
               });
            }
          }
        }
      }

      // Execute callbacks/side effects
      if (additionalOperations) {
        await additionalOperations(tx, targetStatus);
      }

      // Return fully updated Booking
      return tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          vehicle: true,
          business: true,
          notes: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'asc' }
          },
          items: {
            include: {
              businessService: {
                include: { service: true }
              }
            }
          },
          payment: {
            include: { status: true, paymentMethod: true }
          }
        }
      });
    });
  }

  private getLatestStatusContext(statusHistory: any[]): string {
    if (!statusHistory || statusHistory.length === 0) return 'PENDING';
    return statusHistory[statusHistory.length - 1].status.context;
  }

  private async getBookingIdsByLatestStatus(statusContext: string): Promise<string[]> {
    const rawIds = await this.prisma.$queryRaw<Array<{ booking_id: string }>>`
      SELECT booking_id FROM (
        SELECT DISTINCT ON (booking_id) booking_id, s.context
        FROM booking_status bs
        JOIN statuses s ON bs.status_id = s.id
        ORDER BY booking_id, bs.created_at DESC
      ) t WHERE t.context = ${statusContext}
    `;
    return rawIds.map(r => r.booking_id);
  }

  private async getBookingImages(bookingId: string): Promise<string[]> {
    const images = await this.prisma.image.findMany({
      where: {
        entityId: bookingId,
        entityType: 'BOOKING_PROBLEM'
      },
      select: { url: true }
    });
    return images.map(img => img.url);
  }

  private async getUserAvatarByVehicleId(vehicleId: string | undefined): Promise<string | null> {
    if (!vehicleId) return null;
    const vehicle = await this.prisma.clientVehicle.findUnique({
      where: { id: vehicleId },
      select: {
        client: {
          select: {
            userId: true
          }
        }
      }
    });
    const userId = vehicle?.client?.userId;
    if (!userId) return null;

    const avatarImg = await this.prisma.image.findFirst({
      where: { entityType: 'USER_AVATAR', entityId: userId },
      select: { url: true }
    });
    return avatarImg?.url || null;
  }

  private formatBooking(booking: any, images: string[] = [], clientAvatar: string | null = null): BookingResponseDto {
    const latestStatus = this.getLatestStatusContext(booking.statusHistory);

    const clientName =
      booking.vehicle?.client?.user?.fullName ||
      null;

    const resolvedAvatar = 
      clientAvatar ||
      booking.vehicle?.client?.user?.profileImageUrl ||
      null;

    return {
      id: booking.id,
      client_name: clientName,
      client_avatar: resolvedAvatar,
      vehicle_id: booking.vehicleId,
      business_id: booking.businessId,
      scheduled_at: booking.scheduledAt,
      expected_delivery_at: booking.expectedDeliveryAt ?? undefined,
      sub_total: Number(booking.subTotal),
      platform_fee: Number(booking.platformFee) || 0,
      discount: Number(booking.discount),
      commission: Number(booking.commission),
      total_price: Number(booking.totalPrice),
      cancellation_reason: latestStatus === 'CANCELLED' ? (booking.cancellation?.reason || undefined) : undefined,
      rejection_reason: latestStatus === 'REJECTED' ? (booking.cancellation?.reason || undefined) : undefined,
      note: booking.notes && booking.notes.length > 0 ? booking.notes[0].body : undefined,
      status: latestStatus,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
      items: (booking.items || []).map((item: any) => ({
        id: item.id,
        businessServiceId: item.businessServiceId,
        serviceTitle: item.businessService?.service?.title || 'Service',
        serviceDescription: item.businessService?.service?.description || undefined,
        price: Number(item.price),
      })),
      status_history: (booking.statusHistory || []).map((sh: any) => ({
        id: sh.id,
        status: sh.status.context,
        createdAt: sh.createdAt,
      })),
      payment: booking.payment ? {
        id: booking.payment.id,
        amount: Number(booking.payment.amount),
        status: booking.payment.status.context,
        method: booking.payment.paymentMethod.name,
      } : undefined,
      vehicle: {
        id: booking.vehicle.id,
        make: booking.vehicle.make ?? undefined,
        model: booking.vehicle.model ?? undefined,
        licensePlate: booking.vehicle.licensePlate,
        vin: booking.vehicle.vin ?? undefined,
        year: booking.vehicle.year ?? undefined,
        color: booking.vehicle.color ?? undefined,
        client: booking.vehicle.client ? {
          id: booking.vehicle.client.id,
          user: booking.vehicle.client.user ? {
            id: booking.vehicle.client.user.id,
            fullName: booking.vehicle.client.user.fullName,
            phone: booking.vehicle.client.user.phone ?? undefined,
            email: booking.vehicle.client.user.email,
          } : undefined
        } : undefined
      },
      business: {
        id: booking.business.id,
        businessName: booking.business.businessName,
        address: booking.business.address,
        managerId: booking.business.managerId,
        latitude: booking.business.latitude ?? undefined,
        longitude: booking.business.longitude ?? undefined,
      },
      images,
      diagnostic_report: booking.diagnosticReport || undefined,
    };
  }
}
