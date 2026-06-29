const fs = require('fs');
const path = require('path');

const bDir = path.join(__dirname, 'server', 'src', 'modules', 'bookings');

// 1. Create BookingsRepository
const repoContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { IBookingRepository } from '../interfaces/booking-repository.interface';
import { BOOKING_FULL_INCLUDE, BOOKING_WITH_CLIENT_INCLUDE, BOOKING_MANAGER_ADMIN_INCLUDE } from '../entities/booking.entity';

@Injectable()
export class BookingsRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findClientBookings(clientId: string, query: BookingQueryDto): Promise<[any[], number]> {
    const where: Prisma.BookingWhereInput = { vehicle: { clientId } };
    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) scheduledAtFilter.gte = new Date(query.startDate);
    if (query.endDate) {
      const endStr = query.endDate.includes('T') ? query.endDate : \`\${query.endDate}T23:59:59.999Z\`;
      scheduledAtFilter.lte = new Date(endStr);
    }
    if (query.startDate || query.endDate) where.scheduledAt = scheduledAtFilter;

    if (query.search) {
      where.OR = [
        { notes: { some: { body: { contains: query.search, mode: 'insensitive' } } } },
        { business: { businessName: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { licensePlate: { contains: query.search, mode: 'insensitive' } } }
      ];
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    return Promise.all([
      this.prisma.booking.findMany({
        where,
        include: BOOKING_FULL_INCLUDE,
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);
  }

  async findClientBooking(clientId: string, bookingId: string): Promise<any> {
    return this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId } },
      include: {
        ...BOOKING_FULL_INCLUDE,
        cancellation: true,
        diagnosticReport: {
          include: { findings: true, recommendedRepairs: true }
        }
      }
    });
  }

  async findManagerBookings(managerId: string, query: BookingQueryDto): Promise<[any[], number]> {
    const where: Prisma.BookingWhereInput = { business: { managerId } };
    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) scheduledAtFilter.gte = new Date(query.startDate);
    if (query.endDate) {
      const endStr = query.endDate.includes('T') ? query.endDate : \`\${query.endDate}T23:59:59.999Z\`;
      scheduledAtFilter.lte = new Date(endStr);
    }
    if (query.startDate || query.endDate) where.scheduledAt = scheduledAtFilter;

    if (query.search) {
      where.OR = [
        { notes: { some: { body: { contains: query.search, mode: 'insensitive' } } } },
        { vehicle: { licensePlate: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { client: { user: { fullName: { contains: query.search, mode: 'insensitive' } } } } }
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

    return Promise.all([
      this.prisma.booking.findMany({
        where,
        include: BOOKING_MANAGER_ADMIN_INCLUDE,
        orderBy: orderByQuery,
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);
  }

  async findManagerBooking(managerId: string, bookingId: string): Promise<any> {
    return this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId } },
      include: BOOKING_MANAGER_ADMIN_INCLUDE
    });
  }

  async findAdminBookings(query: BookingQueryDto): Promise<[any[], number]> {
    const where: Prisma.BookingWhereInput = {};
    if (query.status) {
      const ids = await this.getBookingIdsByLatestStatus(query.status);
      where.id = { in: ids };
    }
    const scheduledAtFilter: Prisma.DateTimeFilter = {};
    if (query.startDate) scheduledAtFilter.gte = new Date(query.startDate);
    if (query.endDate) scheduledAtFilter.lte = new Date(query.endDate);
    if (query.startDate || query.endDate) where.scheduledAt = scheduledAtFilter;

    if (query.search) {
      where.OR = [
        { notes: { some: { body: { contains: query.search, mode: 'insensitive' } } } },
        { business: { businessName: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { licensePlate: { contains: query.search, mode: 'insensitive' } } },
        { vehicle: { client: { user: { fullName: { contains: query.search, mode: 'insensitive' } } } } }
      ];
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    return Promise.all([
      this.prisma.booking.findMany({
        where,
        include: BOOKING_MANAGER_ADMIN_INCLUDE,
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.booking.count({ where })
    ]);
  }

  async findAdminBooking(bookingId: string): Promise<any> {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: BOOKING_MANAGER_ADMIN_INCLUDE
    });
  }

  async createBooking(data: any): Promise<any> {
    const crypto = require('crypto');
    return this.prisma.$transaction(async (tx) => {
      const pendingStatus = await tx.status.findFirst({ where: { context: 'PENDING' } });
      if (!pendingStatus) throw new Error('PENDING status not found in database');

      const newBooking = await tx.booking.create({
        data: {
          id: \`BKG-\${crypto.randomBytes(3).toString('hex').toUpperCase()}\`,
          vehicleId: data.vehicleId,
          businessId: data.businessId,
          scheduledAt: data.scheduledAt,
          expectedDeliveryAt: data.expectedDeliveryAt,
          subTotal: new Prisma.Decimal(data.subTotal.toString()),
          discount: new Prisma.Decimal('0.00'),
          platformFee: new Prisma.Decimal(data.platformFee.toString()),
          commission: new Prisma.Decimal(data.commission.toString()),
          totalPrice: new Prisma.Decimal(data.totalPrice.toString()),
          notes: data.note ? { create: { body: data.note } } : undefined,
        },
        include: BOOKING_FULL_INCLUDE
      });

      await tx.bookingStatus.create({
        data: { bookingId: newBooking.id, statusId: pendingStatus.id }
      });

      await tx.bookingItem.createMany({
        data: data.businessServices.map((bs: any) => ({
          bookingId: newBooking.id,
          businessServiceId: bs.id,
          price: bs.price
        }))
      });

      if (data.images && data.images.length > 0) {
        await tx.image.createMany({
          data: data.images.map((img: any) => ({
            url: img.url,
            storageKey: img.storageKey,
            entityType: 'BOOKING_PROBLEM',
            entityId: newBooking.id
          }))
        });
      }

      return tx.booking.findUnique({
        where: { id: newBooking.id },
        include: {
          ...BOOKING_FULL_INCLUDE,
          diagnosticReport: { include: { findings: true, recommendedRepairs: true } }
        }
      });
    }, { maxWait: 5000, timeout: 20000 });
  }

  async transitionStatus(bookingId: string, targetContext: string, additionalOperations?: (tx: Prisma.TransactionClient, statusRow: any) => Promise<void>): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const targetStatus = await tx.status.findFirst({ where: { context: targetContext } });
      if (!targetStatus) throw new Error(\`Target status \${targetContext} not found in database\`);

      await tx.bookingStatus.create({
        data: { bookingId, statusId: targetStatus.id }
      });

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
                   reason: \`Refunded points for cancelled booking \${bookingId.substring(0, 8)}\`
                 }
               });
            }
          }
        }
      }

      if (additionalOperations) await additionalOperations(tx, targetStatus);

      return tx.booking.findUnique({
        where: { id: bookingId },
        include: BOOKING_MANAGER_ADMIN_INCLUDE
      });
    });
  }

  async updateBookingData(bookingId: string, data: Prisma.BookingUpdateInput): Promise<any> {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data,
      include: BOOKING_MANAGER_ADMIN_INCLUDE
    });
  }

  async getBookingIdsByLatestStatus(statusContext: string): Promise<string[]> {
    const rawIds = await this.prisma.$queryRaw<Array<{ booking_id: string }>>\`
      SELECT booking_id FROM (
        SELECT DISTINCT ON (booking_id) booking_id, s.context
        FROM booking_status bs
        JOIN statuses s ON bs.status_id = s.id
        ORDER BY booking_id, bs.created_at DESC
      ) t WHERE t.context = \${statusContext}
    \`;
    return rawIds.map(r => r.booking_id);
  }

  async getBookingImages(bookingId: string): Promise<string[]> {
    const images = await this.prisma.image.findMany({
      where: { entityId: bookingId, entityType: 'BOOKING_PROBLEM' },
      select: { url: true }
    });
    return images.map(img => img.url);
  }

  async getUserAvatarByVehicleId(vehicleId: string | undefined): Promise<string | null> {
    if (!vehicleId) return null;
    const vehicle = await this.prisma.clientVehicle.findUnique({
      where: { id: vehicleId },
      select: { client: { select: { userId: true } } }
    });
    const userId = vehicle?.client?.userId;
    if (!userId) return null;

    const avatarImg = await this.prisma.image.findFirst({
      where: { entityType: 'USER_AVATAR', entityId: userId },
      select: { url: true }
    });
    return avatarImg?.url || null;
  }

  async resolveBusinessLocation(businessId: string): Promise<{ latitude: number; longitude: number } | null> {
    const businessLoc: any[] = await this.prisma.$queryRaw\`
      SELECT ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude
      FROM businesses
      WHERE id = \${businessId}::uuid
    \`;
    if (businessLoc.length > 0) return { latitude: businessLoc[0].latitude, longitude: businessLoc[0].longitude };
    return null;
  }
}
`;
fs.writeFileSync(path.join(bDir, 'repositories', 'bookings.repository.ts'), repoContent);

// 2. Create BookingClientService
const clientServiceContent = `import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingStateMachineService } from './booking-state-machine.service';
import { BookingFinancialsService } from './booking-financials.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';

@Injectable()
export class BookingClientService {
  private readonly logger = new Logger(BookingClientService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
    private readonly stateMachine: BookingStateMachineService,
    private readonly financials: BookingFinancialsService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      include: { user: true }
    });
    if (!client) throw new ForbiddenException('User is not registered as a client');

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: { id: dto.vehicleId, clientId: client.id }
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found or does not belong to you');

    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
      include: { manager: true, operatingHours: true }
    });
    if (!business) throw new NotFoundException('Business/Provider not found');

    const businessServices = await this.prisma.businessService.findMany({
      where: { id: { in: dto.items.map(item => item.businessServiceId) }, businessId: dto.businessId, isActive: true },
      include: { service: true }
    });
    if (businessServices.length !== dto.items.length) {
      throw new BadRequestException('Some selected services are invalid, inactive, or not offered by this provider');
    }

    const scheduledAt = new Date(dto.scheduledAt);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);
    maxDate.setHours(23, 59, 59, 999);

    if (isNaN(scheduledAt.getTime())) throw new BadRequestException('Invalid scheduled date/time');
    if (scheduledAt.getTime() <= now.getTime()) throw new BadRequestException('Scheduled time must be in the future');
    if (scheduledAt.getTime() > maxDate.getTime()) throw new BadRequestException('Scheduled time cannot be more than 7 days in advance');

    if (business.operatingHours && business.operatingHours.length > 0) {
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
      const timeString = hour && minute ? \`\${hour}:\${minute}\` : \`\${String(scheduledAt.getHours()).padStart(2, '0')}:\${String(scheduledAt.getMinutes()).padStart(2, '0')}\`;
      const hoursForDay = business.operatingHours.find(h => h.dayOfWeek === dayOfWeek);
      if (!hoursForDay || (!hoursForDay.openTime && !hoursForDay.closeTime)) throw new BadRequestException('The provider is closed on the selected day');
      if (hoursForDay.openTime && hoursForDay.closeTime) {
        if (timeString < hoursForDay.openTime || timeString > hoursForDay.closeTime) throw new BadRequestException(\`The selected time is outside the provider's operating hours (\${hoursForDay.openTime} - \${hoursForDay.closeTime})\`);
      }
    }

    const subTotal = businessServices.reduce((sum, bs) => sum + Number(bs.price), 0);
    const fin = await this.financials.calculateFinancials(subTotal);

    const booking = await this.bookingsRepository.createBooking({
      userId,
      clientId: client.id,
      vehicleId: dto.vehicleId,
      businessId: dto.businessId,
      scheduledAt: new Date(dto.scheduledAt),
      expectedDeliveryAt: dto.expectedDeliveryAt ? new Date(dto.expectedDeliveryAt) : undefined,
      note: dto.note,
      images: dto.images,
      businessServices,
      subTotal: fin.subTotal,
      platformFee: fin.platformFee,
      commission: fin.commission,
      totalPrice: fin.totalPrice
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'New Booking Request',
        body: \`Client \${client.user.fullName} requested a booking for \${vehicle.licensePlate} scheduled at \${new Date(dto.scheduledAt).toLocaleString()}\`,
        actionUrl: \`/manager/bookings/\${booking.id}\`
      });
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    return this.bookingMapper.toResponseDto(booking, dto.images?.map(img => img.url) || []);
  }

  async getClientBookings(userId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const [bookings, total] = await this.bookingsRepository.findClientBookings(client.id, query);
    return this.bookingMapper.toPaginatedResponse(bookings, total, query.page ?? 1, query.limit ?? 20, undefined, (id) => []); // Assuming getImagesForBooking is done later if needed
  }

  async getClientBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.bookingsRepository.findClientBooking(client.id, bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const loc = await this.bookingsRepository.resolveBusinessLocation(booking.businessId);
    if (loc) {
      booking.business.latitude = loc.latitude;
      booking.business.longitude = loc.longitude;
    }
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(booking, images);
  }

  async cancelBookingByClient(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: { business: true, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const cancellableStates = ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'];
    if (!cancellableStates.includes(currentStatus)) {
      throw new BadRequestException(\`Booking cannot be cancelled once work has started. Current status: \${currentStatus}\`);
    }

    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'CANCELLED', async (tx) => {
      await tx.bookingCancellation.create({
        data: { bookingId, cancelledBy: userId, reason: dto.reason ?? 'Cancelled by client' }
      });
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Client',
        body: \`Booking \${booking.id.slice(0,8)} has been cancelled. Reason: \${dto.reason ?? 'Client request'}\`,
        actionUrl: \`/manager/bookings/\${booking.id}\`
      });
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(updatedBooking, images);
  }

  async rescheduleBookingByClient(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: { business: true, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
      throw new BadRequestException(\`Cannot reschedule booking in status: \${currentStatus}\`);
    }

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) throw new BadRequestException('New scheduled date must be in the future');

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const pendingStatus = await tx.status.findFirst({ where: { context: 'PENDING' } });
      if (!pendingStatus) throw new Error('PENDING status row missing');

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { scheduledAt: newDate, expectedDeliveryAt: null }
      });

      if (currentStatus !== 'PENDING') {
        await tx.bookingStatus.create({
          data: { bookingId, statusId: pendingStatus.id }
        });
      }
      return updated;
    });

    const fullBooking = await this.bookingsRepository.findClientBooking(client.id, bookingId);

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'Booking Rescheduled by Client',
        body: \`Client requested to reschedule Booking \${booking.id.slice(0,8)} to \${newDate.toLocaleString()}\`,
        actionUrl: \`/manager/bookings/\${booking.id}\`
      });
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    const images = await this.bookingsRepository.getBookingImages(bookingId);
    return this.bookingMapper.toResponseDto(fullBooking, images);
  }
}
`;
fs.writeFileSync(path.join(bDir, 'services', 'booking-client.service.ts'), clientServiceContent);

// 3. Create BookingManagerService (placeholder structure)
const managerServiceContent = `import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { PaymentsService } from '../../payments/payments.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingStateMachineService } from './booking-state-machine.service';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto';
import { ReviewBookingDto, ReviewStatus } from '../dto/review-booking.dto';
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { Prisma } from '@prisma/client';
import { BOOKING_MANAGER_ADMIN_INCLUDE } from '../entities/booking.entity';

@Injectable()
export class BookingManagerService {
  private readonly logger = new Logger(BookingManagerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
    private readonly stateMachine: BookingStateMachineService,
  ) {}

  async getManagerBookings(userId: string, query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findManagerBookings(userId, query);
    
    const userIds = bookings.map((b) => b.vehicle?.client?.user?.id).filter(Boolean) as string[];
    const avatars = userIds.length > 0 ? await this.prisma.image.findMany({
      where: { entityType: 'USER_AVATAR', entityId: { in: userIds } },
      select: { entityId: true, url: true }
    }) : [];
    const avatarMap = new Map<string, string>(avatars.map((a) => [a.entityId, a.url]));

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        const uId = b.vehicle?.client?.user?.id;
        const avatarUrl = uId ? (avatarMap.get(uId) || null) : null;
        return this.bookingMapper.toResponseDto(b, images, avatarUrl);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        totalPages: Math.ceil(total / (query.limit ?? 20))
      }
    };
  }

  async getManagerBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.bookingsRepository.findManagerBooking(userId, bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(booking.vehicleId);
    return this.bookingMapper.toResponseDto(booking, images, avatarUrl);
  }

  async reviewBookingByManager(userId: string, bookingId: string, dto: ReviewBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } }, items: true }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING') throw new BadRequestException(\`Booking is already reviewed or processed. Current status: \${currentStatus}\`);

    let updatedBooking;

    if (dto.status === ReviewStatus.REJECTED) {
      updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'REJECTED', async (tx) => {
        await tx.bookingCancellation.create({
          data: { bookingId, cancelledBy: userId, reason: dto.rejectionReason ?? 'Rejected by manager' }
        });
      });
      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CANCELLED',
          title: 'Booking Request Rejected',
          body: \`Your booking request \${booking.id.slice(0,8)} has been rejected by the provider. Reason: \${dto.rejectionReason ?? 'Provider choice'}\`,
          actionUrl: \`/client/bookings/\${booking.id}\`
        });
      } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }
    } else {
      updatedBooking = await this.prisma.$transaction(async (tx) => {
        const acceptedStatus = await tx.status.findFirst({ where: { context: 'ACCEPTED' } });
        if (!acceptedStatus) throw new Error('ACCEPTED status missing');

        if (dto.items && dto.items.length > 0) {
          const activeItemBsIds = booking.items.map(i => i.businessServiceId);
          for (const item of dto.items) {
            if (!activeItemBsIds.includes(item.businessServiceId)) throw new BadRequestException(\`Item \${item.businessServiceId} is not in the original booking request\`);
            if (item.price !== undefined) {
              await tx.bookingItem.updateMany({
                where: { bookingId, businessServiceId: item.businessServiceId },
                data: { price: new Prisma.Decimal(item.price.toString()) }
              });
            }
          }
        }

        const finalItems = await tx.bookingItem.findMany({ where: { bookingId } });
        const subTotal = finalItems.reduce((sum, item) => sum + Number(item.price), 0);
        const setting = await tx.setting.findFirst();
        const feePct = setting?.businessFeePct ? Number(setting.businessFeePct) : 10.0;
        const commission = (subTotal * feePct) / 100;
        const platformFee = Number((booking as any).platformFee || 0);
        const totalPrice = subTotal + platformFee;

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            subTotal: new Prisma.Decimal(subTotal.toString()),
            commission: new Prisma.Decimal(commission.toString()),
            totalPrice: new Prisma.Decimal(totalPrice.toString()),
            ...(dto.expectedDeliveryAt && { expectedDeliveryAt: new Date(dto.expectedDeliveryAt) }),
          }
        });

        await tx.bookingStatus.create({
          data: { bookingId, statusId: acceptedStatus.id }
        });

        const pendingPaymentStatus = await tx.status.findFirst({ where: { context: 'PAYMENT_PENDING' } });
        let defaultPaymentMethod = await tx.paymentMethod.findFirst({ where: { name: 'CASH' } });
        if (!defaultPaymentMethod) {
          defaultPaymentMethod = await tx.paymentMethod.create({ data: { name: 'CASH', isEnabled: true } });
        }
        if (pendingPaymentStatus && defaultPaymentMethod) {
          await tx.payment.upsert({
            where: { bookingId },
            create: { bookingId, amount: new Prisma.Decimal(totalPrice.toString()), currency: 'EGP', statusId: pendingPaymentStatus.id, paymentMethodId: defaultPaymentMethod.id, provider: 'system' },
            update: { amount: new Prisma.Decimal(totalPrice.toString()) }
          });
        }
        return tx.booking.findUnique({ where: { id: bookingId }, include: BOOKING_MANAGER_ADMIN_INCLUDE });
      }, { maxWait: 5000, timeout: 20000 });

      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CONFIRMED',
          title: 'Booking Request Approved',
          body: \`Your booking request \${booking.id.slice(0,8)} has been accepted by the provider! Please proceed to payment.\`,
          actionUrl: \`/client/bookings/\${booking.id}\`
        });
      } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }
    }

    if (!updatedBooking) throw new Error('Failed to retrieve updated booking');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async updateBookingStatusByManager(userId: string, bookingId: string, dto: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } }, payment: { include: { status: true } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const targetStatus = dto.status === 'READY' ? 'READY_FOR_PICKUP' : dto.status;

    if (targetStatus === 'CONFIRMED' || targetStatus === 'ACCEPTED') throw new BadRequestException('Booking cannot be manually changed to ACCEPTED or CONFIRMED.');
    if (targetStatus === 'COMPLETED') {
      const paymentStatus = booking.payment?.status?.context;
      if (paymentStatus !== 'PAID') throw new BadRequestException('Booking cannot be marked as COMPLETED until payment is fully paid.');
    }

    this.stateMachine.validateTransition(currentStatus, targetStatus);
    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, targetStatus);

    try {
      const clientUserId = booking.vehicle.client.userId;
      const ref = booking.id.slice(0, 8);
      switch (targetStatus) {
        case 'VEHICLE_RECEIVED':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'VEHICLE_RECEIVED', title: 'Vehicle Received', body: \`Your vehicle is received by the workshop for Booking \${ref}\`, actionUrl: \`/client/bookings/\${bookingId}\` });
          break;
        case 'IN_PROGRESS':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'SERVICE_IN_PROGRESS', title: 'Service In Progress', body: \`The service has officially started on your vehicle for Booking \${ref}\`, actionUrl: \`/client/bookings/\${bookingId}\` });
          break;
        case 'READY_FOR_PICKUP':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'READY_FOR_PICKUP', title: 'Ready for Pickup', body: \`Your vehicle is ready! Please complete payment and pick up your vehicle. Booking \${ref}\`, actionUrl: \`/client/bookings/\${bookingId}\` });
          break;
        case 'COMPLETED':
          await this.paymentsService.createPayoutForCompletedBooking(bookingId);
          const config = await this.prisma.loyaltyConfig.findFirst();
          if (booking.payment && Number(booking.payment.amount) > 0 && config?.isActive) {
            const amount = Number(booking.payment.amount);
            const pointsEarned = Math.floor((amount / 100) * config.pointsPer100Egp);
            await this.prisma.loyaltyTransaction.create({
              data: { clientId: booking.vehicle.clientId, bookingId: booking.id, type: 'EARNED', points: pointsEarned, reason: \`Earned \${pointsEarned} points from booking (\${amount} EGP)\`, },
            });
            await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'POINTS_EARNED', title: 'Loyalty Points Earned!', body: \`You just earned \${pointsEarned} points for completing Booking \${ref}!\`, actionUrl: \`/client/loyalty\` });
          }
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'BOOKING_COMPLETED', title: 'Booking Completed', body: \`Thank you for choosing us! Booking \${ref} is now completed.\`, actionUrl: \`/client/bookings/\${bookingId}\` });
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'NEW_REVIEW', title: 'Rate Your Service', body: \`Please take a moment to rate and review your completed booking \${ref}.\`, actionUrl: \`/client/bookings/\${bookingId}\` });
          break;
      }
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    if (!updatedBooking) throw new NotFoundException('Updated booking not found');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async rescheduleBookingByManager(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const restrictedRescheduleStates = ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'REJECTED'];
    if (restrictedRescheduleStates.includes(currentStatus)) throw new BadRequestException(\`Cannot reschedule booking in status: \${currentStatus}\`);

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) throw new BadRequestException('New scheduled date must be in the future');

    const updatedBooking = await this.bookingsRepository.updateBookingData(bookingId, { scheduledAt: newDate });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CONFIRMED',
        title: 'Booking Rescheduled by Provider',
        body: \`The provider rescheduled Booking \${booking.id.slice(0,8)} to \${newDate.toLocaleString()}\`,
        actionUrl: \`/client/bookings/\${bookingId}\`
      });
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async cancelBookingByManager(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const uncancelableStates = ['COMPLETED', 'CANCELLED', 'REJECTED'];
    if (uncancelableStates.includes(currentStatus)) throw new BadRequestException(\`Cannot cancel booking from its current status: \${currentStatus}\`);

    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'CANCELLED', async (tx) => {
      await tx.bookingCancellation.create({
        data: { bookingId, cancelledBy: userId, reason: dto.reason ?? 'Cancelled by manager' }
      });
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Provider',
        body: \`Your booking \${booking.id.slice(0,8)} has been cancelled by the provider. Reason: \${dto.reason ?? 'Provider request'}\`,
        actionUrl: \`/client/bookings/\${bookingId}\`
      });
    } catch (err) { this.logger.error(\`Notification failed: \${(err as any).message}\`); }

    if (!updatedBooking) throw new NotFoundException('Updated booking not found');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }
}
`;
fs.writeFileSync(path.join(bDir, 'services', 'booking-manager.service.ts'), managerServiceContent);


// 4. Create BookingAdminService
const adminServiceContent = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';

@Injectable()
export class BookingAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
  ) {}

  async getAdminBookings(query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findAdminBookings(query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }

  async getAdminBooking(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.bookingsRepository.findAdminBooking(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(booking, images);
  }

  async getBookingsByManager(managerId: string, query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findManagerBookings(managerId, query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }

  async getBookingsByUser(clientUserId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId: clientUserId } });
    if (!client) throw new NotFoundException('Client user profile not found');

    const [bookings, total] = await this.bookingsRepository.findClientBookings(client.id, query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }
}
`;
fs.writeFileSync(path.join(bDir, 'services', 'booking-admin.service.ts'), adminServiceContent);

// 5. Update BookingsService (Facade)
const facadeServiceContent = `import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ReviewBookingDto } from './dto/review-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { BookingClientService } from './services/booking-client.service';
import { BookingManagerService } from './services/booking-manager.service';
import { BookingAdminService } from './services/booking-admin.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingClientService: BookingClientService,
    private readonly bookingManagerService: BookingManagerService,
    private readonly bookingAdminService: BookingAdminService,
  ) {}

  // ==================== CLIENT WORKFLOWS ====================
  async createBooking(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.createBooking(userId, dto);
  }
  async getClientBookings(userId: string, query: BookingQueryDto) {
    return this.bookingClientService.getClientBookings(userId, query);
  }
  async getClientBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    return this.bookingClientService.getClientBooking(userId, bookingId);
  }
  async cancelBookingByClient(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.cancelBookingByClient(userId, bookingId, dto);
  }
  async rescheduleBookingByClient(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.rescheduleBookingByClient(userId, bookingId, dto);
  }

  // ==================== MANAGER WORKFLOWS ====================
  async getManagerBookings(userId: string, query: BookingQueryDto) {
    return this.bookingManagerService.getManagerBookings(userId, query);
  }
  async getManagerBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    return this.bookingManagerService.getManagerBooking(userId, bookingId);
  }
  async reviewBookingByManager(userId: string, bookingId: string, dto: ReviewBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.reviewBookingByManager(userId, bookingId, dto);
  }
  async updateBookingStatusByManager(userId: string, bookingId: string, dto: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.updateBookingStatusByManager(userId, bookingId, dto);
  }
  async rescheduleBookingByManager(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.rescheduleBookingByManager(userId, bookingId, dto);
  }
  async cancelBookingByManager(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.cancelBookingByManager(userId, bookingId, dto);
  }

  // ==================== ADMIN WORKFLOWS ====================
  async getAdminBookings(query: BookingQueryDto) {
    return this.bookingAdminService.getAdminBookings(query);
  }
  async getAdminBooking(bookingId: string): Promise<BookingResponseDto> {
    return this.bookingAdminService.getAdminBooking(bookingId);
  }
  async getBookingsByManager(managerId: string, query: BookingQueryDto) {
    return this.bookingAdminService.getBookingsByManager(managerId, query);
  }
  async getBookingsByUser(clientUserId: string, query: BookingQueryDto) {
    return this.bookingAdminService.getBookingsByUser(clientUserId, query);
  }
}
`;
fs.writeFileSync(path.join(bDir, 'bookings.service.ts'), facadeServiceContent);

console.log('Bookings module refactoring code written successfully.');
