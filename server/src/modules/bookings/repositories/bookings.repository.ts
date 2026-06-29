import { Injectable } from '@nestjs/common';
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
      const endStr = query.endDate.includes('T') ? query.endDate : `${query.endDate}T23:59:59.999Z`;
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
      const endStr = query.endDate.includes('T') ? query.endDate : `${query.endDate}T23:59:59.999Z`;
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
          id: `BKG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
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
      if (!targetStatus) throw new Error(`Target status ${targetContext} not found in database`);

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
                   reason: `Refunded points for cancelled booking ${bookingId.substring(0, 8)}`
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
    const businessLoc: any[] = await this.prisma.$queryRaw`
      SELECT ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude
      FROM businesses
      WHERE id = ${businessId}::uuid
    `;
    if (businessLoc.length > 0) return { latitude: businessLoc[0].latitude, longitude: businessLoc[0].longitude };
    return null;
  }
}
