import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateClientLocationDto } from './dto/client-location.dto';
import { ClientStatsDto, LoyaltySummaryDto } from './dto/client-stats.dto';
import { NearbyBusinessDto } from './dto/client-response.dto';
import { validate as isUUID } from 'uuid';
import { reverseGeocodeCity } from '../../utils/geocode';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get client by user ID
   */
  async getClientByUserId(userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    if (!client.user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    return {
      id: client.id,
      user_id: client.userId,
      full_name: client.user.fullName,
      email: client.user.email,
      phone: client.user.phone || undefined,
      location: this.parseLocation((client as any).location),
      created_at: client.createdAt,
      updated_at: client.updatedAt,
    };
  }

  /**
   * Update client location using PostGIS
   */
  async updateLocation(
    userId: string,
    dto: UpdateClientLocationDto,
  ): Promise<{ success: boolean; location: { latitude: number; longitude: number; city: string | null } }> {

    await this.getClientOrThrow(userId);

    const city = await reverseGeocodeCity(dto.latitude, dto.longitude);

    await this.prisma.$executeRaw`
      UPDATE clients 
      SET location = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)::geography,
          city = ${city},
          updated_at = NOW()
      WHERE user_id = ${userId}::uuid
    `;

    this.logger.log(`Location updated for client ${userId}: ${dto.latitude}, ${dto.longitude}, city: ${city}`);

    this.eventEmitter.emit('client.location_updated', {
      userId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      city,
    });

    return {
      success: true,
      location: { latitude: dto.latitude, longitude: dto.longitude, city },
    };
  }

  /**
   * Get client location
   */
  async getLocation(userId: string): Promise<{ latitude: number; longitude: number } | null> {

  if (!isUUID(userId)) return null;

  const result = await this.prisma.$queryRaw<
    Array<{ latitude: number | null; longitude: number | null }>
  >`
    SELECT 
      ST_Y(location::geometry) as latitude,
      ST_X(location::geometry) as longitude
    FROM clients 
    WHERE user_id = ${userId}::uuid
  `;

  if (!result || result.length === 0 || result[0].latitude === null || result[0].longitude === null) {
    return null;
  }

  return {
    latitude: result[0].latitude,
    longitude: result[0].longitude,
  };
}

  /**
   * Get client statistics (bookings, spending, points)
   */
  async getClientStats(userId: string): Promise<ClientStatsDto> {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    // Get all bookings for this client via vehicles
    const bookings = await this.prisma.booking.findMany({
      where: {
        vehicle: { clientId: client.id },
      },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payment: {
          include: { status: true },
        },
      },
    });

    let completedBookings = 0;
    let cancelledBookings = 0;
    let pendingBookings = 0;
    let inProgressBookings = 0;
    let totalSpent = 0;
    let totalRefunded = 0;
    let paidBookings = 0;

    for (const booking of bookings) {
      const isPaid = booking.payment?.status?.context === 'PAID';
      const isRefunded = booking.payment?.status?.context === 'REFUNDED';

      if (isPaid || isRefunded) {
        paidBookings++;
      }

      const latestStatus = booking.statusHistory[0]?.status?.context || 'PENDING';
      
      switch (latestStatus) {
        case 'COMPLETED':
          completedBookings++;
          if (isPaid) {
            totalSpent += Number(booking.totalPrice);
          }
          break;
        case 'CANCELLED':
          cancelledBookings++;
          if (isPaid || isRefunded) {
            totalRefunded += Number(booking.totalPrice);
          }
          break;
        case 'PENDING':
        case 'CONFIRMED':
          pendingBookings++;
          break;
        case 'VEHICLE_RECEIVED':
        case 'IN_PROGRESS':
        case 'READY_FOR_PICKUP':
          inProgressBookings++;
          break;
      }
    }

    // Get loyalty points
    const loyaltyResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId: client.id },
      _sum: { points: true },
    });
    const loyaltyPoints = loyaltyResult._sum.points || 0;

    // Get vehicles count
    const vehiclesCount = await this.prisma.clientVehicle.count({
      where: { clientId: client.id },
    });

    // Get user for member since
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, updatedAt: true },
    });

    return {
      total_bookings: paidBookings,
      completed_bookings: completedBookings,
      cancelled_bookings: cancelledBookings,
      pending_bookings: pendingBookings,
      in_progress_bookings: inProgressBookings,
      total_spent: totalSpent,
      total_refunded: totalRefunded,
      loyalty_points: loyaltyPoints,
      vehicles_count: vehiclesCount,
      member_since: user?.createdAt || new Date(),
      last_active: user?.updatedAt || new Date(),
    };
  }

  /**
   * Get loyalty summary with recent transactions
   */
  async getLoyaltySummary(userId: string): Promise<LoyaltySummaryDto> {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    // Get points balance
    const balanceResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId: client.id },
      _sum: { points: true },
    });
    const pointsBalance = balanceResult._sum.points || 0;
    const pointsValueEgp = pointsBalance * 0.1; // 10 points = 1 EGP

    // Get recent transactions
    const transactions = await this.prisma.loyaltyTransaction.findMany({
      where: { clientId: client.id },
      include: {
        booking: {
          select: {
            id: true,
            business: { select: { businessName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const recentTransactions = transactions.map(t => ({
      id: t.id,
      type: t.type,
      points: t.points,
      reason: t.reason,
      booking_code: t.booking?.id,
      business_name: t.booking?.business?.businessName,
      created_at: t.createdAt,
    }));

    return {
      points_balance: pointsBalance,
      points_value_egp: pointsValueEgp,
      recent_transactions: recentTransactions,
    };
  }

  /**
   * Find nearby businesses for client discovery
   */
  async getNearbyBusinesses(
    userId: string,
    radiusKm: number = 10,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: NearbyBusinessDto[]; meta: any }> {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    // Get client location
    const location = await this.getLocation(userId);
    if (!location) {
      throw new NotFoundException('Client location not set. Please update your location first.');
    }

    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 50);
    const radiusMeters = radiusKm * 1000;

    // Get APPROVED status ID
    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const results = await this.prisma.$queryRaw<Array<any>>`
      SELECT 
        b.id,
        b.business_name,
        b.address,
        b.contact_phone,
        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM businesses b
      LEFT JOIN bookings bk ON b.id = bk.business_id
      LEFT JOIN reviews r ON bk.id = r.booking_id
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatus.id}
      )
      AND ST_DWithin(
        b.location, 
        ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography,
        ${radiusMeters}
      )
      GROUP BY b.id
      ORDER BY distance_km
      LIMIT ${limitNum}
      OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int as count
      FROM businesses b
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatus.id}
      )
      AND ST_DWithin(
        b.location, 
        ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography,
        ${radiusMeters}
      )
    `;

    const total = totalResult[0]?.count || 0;
    const now = new Date();

    const businessesWithOpenStatus = await Promise.all(
      results.map(async (b) => ({
        id: b.id,
        business_name: b.business_name,
        address: b.address,
        distance_km: parseFloat(b.distance_km),
        contact_phone: b.contact_phone,
        average_rating: Math.round(parseFloat(b.average_rating) * 10) / 10,
        total_reviews: parseInt(b.total_reviews, 10),
        is_open: await this.isBusinessOpen(b.id, now),
      })),
    );

    return {
      data: businessesWithOpenStatus,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Check if a business is open at a given time
   */
  private async isBusinessOpen(businessId: string, dateTime: Date): Promise<boolean> {
    const dayOfWeek = dateTime.getDay();
    const timeStr = dateTime.toTimeString().slice(0, 5);

    const hours = await this.prisma.operatingHour.findFirst({
      where: {
        businessId: businessId,
        dayOfWeek: dayOfWeek,
      },
    });

    if (!hours || !hours.openTime || !hours.closeTime) {
      return false;
    }

    return timeStr >= hours.openTime && timeStr <= hours.closeTime;
  }

  /**
   * Get client's vehicles (returns vehicle IDs for integration with Vehicles module)
   */
  async getClientVehicles(userId: string): Promise<Array<{ id: string; license_plate: string; model?: string; year?: number; color?: string }>> {
    const client = await this.prisma.client.findUnique({
      where: { userId: userId },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    const vehicles = await this.prisma.clientVehicle.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' },
    });

    return vehicles.map((v: { id: string; licensePlate: string; model: string | null; year: number | null; color: string | null }) => ({
      id: v.id,
      license_plate: v.licensePlate,
      model: v.model || undefined,
      year: v.year || undefined,
      color: v.color || undefined,
    }));
  }

  /**
   * Parse PostGIS location to JSON
   */
  private parseLocation(location: any): { latitude: number; longitude: number } | undefined {
    if (!location) return undefined;
    
    try {
      const coords = (location as any).coordinates;
      if (coords && Array.isArray(coords) && coords.length === 2) {
        return {
          longitude: coords[0],
          latitude: coords[1],
        };
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  private async getClientOrThrow(userId: string) {
  if (!isUUID(userId)) {
    throw new NotFoundException('Invalid user ID');
  }

  const client = await this.prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    throw new NotFoundException('Client profile not found');
  }

  return client;
}
}


// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
//   Logger,
// } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { Prisma } from '@prisma/client';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { UpdateClientLocationDto } from './dto/client-location.dto';
// import { ClientResponseDto, NearbyClientDto } from './dto/client-response.dto';
// import { ClientStatsDto } from './dto/client-stats.dto';

// @Injectable()
// export class ClientsService {
//   private readonly logger = new Logger(ClientsService.name);

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly eventEmitter: EventEmitter2,
//   ) {}

//   /**
//    * Get client by user ID with full details
//    */
//   async getClientByUserId(userId: string): Promise<ClientResponseDto> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true,
//             phone: true,
//             // avatar may be stored elsewhere; include if present in DB
//             emailVerified: true,
//             phoneVerified: true,
//             role: true,
//             isActive: true,
//             createdAt: true,
//             updatedAt: true,
//           },
//         },
//       },
//     });

//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }

//     if (!client.user.isActive) {
//       throw new ForbiddenException('Account is deactivated');
//     }

//     // Get statistics
//     const stats = await this.getClientStats(client.id);

//     return this.mapToResponseDto(client, stats);
//   }

//   /**
//    * Get client by client ID (from clients table)
//    */
//   async getClientById(clientId: string): Promise<any> {
//     const client = await this.prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             fullName: true,
//             email: true,
//             phone: true,
//             emailVerified: true,
//             phoneVerified: true,
//           },
//         },
//       },
//     });

//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }

//     return client;
//   }

//   /**
//    * Update client location using PostGIS
//    */
//   async updateLocation(
//     userId: string,
//     dto: UpdateClientLocationDto,
//   ): Promise<{
//     success: boolean;
//     location: { latitude: number; longitude: number };
//   }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }

//     // Create PostGIS point: ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
//     await this.prisma.$executeRaw`
//     UPDATE clients 
//     SET location = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)::geography,
//     updated_at = NOW()
//     WHERE user_id = ${userId}::uuid
//   `;

//     this.logger.log(
//       `Location updated for client ${userId}: ${dto.latitude}, ${dto.longitude}`,
//     );

//     this.eventEmitter.emit('client.location_updated', {
//       userId,
//       latitude: dto.latitude,
//       longitude: dto.longitude,
//     });

//     return {
//       success: true,
//       location: { latitude: dto.latitude, longitude: dto.longitude },
//     };
//   }

//   /**
//    * Get client location
//    */
//   async getLocation(
//     userId: string,
//   ): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<
//     Array<{ latitude: number; longitude: number }>
//     >`
//       SELECT 
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM clients 
//       WHERE user_id = ${userId}::uuid
//     `;

//     if (!result || result.length === 0) {
//       return null;
//     }

//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }

//   /**
//    * Get nearby clients within radius (for admin/discovery)
//    */
//   async getNearbyClients(
//     latitude: number,
//     longitude: number,
//     radiusKm: number = 10,
//     limit: number = 50,
//     page: number = 1,
//   ): Promise<{
//     data: NearbyClientDto[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }> {
//     const skip = (page - 1) * limit;
//     const radiusMeters = radiusKm * 1000;

//     // First, get total count
//     const countResult = await this.prisma.$queryRaw<Array<{ count: number }>>`
//       SELECT COUNT(*)::int as count
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//         AND u.role = 'CLIENT'
//         AND ST_DWithin(
//           c.location, 
//           ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//           ${radiusMeters}
//         )
//     `;

//     const total = countResult[0]?.count || 0;

//     // Get paginated results
//     const results = await this.prisma.$queryRaw<Array<any>>`
//       SELECT 
//         c.id,
//         c.user_id,
//         u.full_name,
//         u.email,
//         u.phone,
//         u.avatar_url,
//         ROUND((ST_Distance(c.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km,
//         COALESCE(b.total_bookings, 0) as total_bookings,
//         COALESCE(r.avg_rating, 0) as average_rating
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       LEFT JOIN (
//         SELECT vehicle.client_id, COUNT(*) as total_bookings
//         FROM bookings b
//         JOIN client_vehicles v ON b.vehicle_id = v.id
//         JOIN clients vehicle ON v.client_id = vehicle.id
//         GROUP BY vehicle.client_id
//       ) b ON b.client_id = c.id
//       LEFT JOIN (
//         SELECT v.client_id, AVG(r.rating) as avg_rating
//         FROM reviews r
//         JOIN bookings b ON r.booking_id = b.id
//         JOIN client_vehicles v ON b.vehicle_id = v.id
//         GROUP BY v.client_id
//       ) r ON r.client_id = c.id
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//         AND u.role = 'CLIENT'
//         AND ST_DWithin(
//           c.location, 
//           ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//           ${radiusMeters}
//         )
//       ORDER BY distance_km
//       LIMIT ${limit}
//       OFFSET ${skip}
//     `;

//     return {
//       data: results.map((r) => ({
//         id: r.id,
//         user_id: r.user_id,
//         full_name: r.full_name,
//         email: r.email,
//         phone: r.phone,
//         avatar_url: r.avatar_url,
//         distance_km: parseFloat(r.distance_km),
//         total_bookings: parseInt(r.total_bookings, 10),
//         average_rating: parseFloat(r.average_rating),
//       })),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   /**
//    * Get client statistics
//    */
//   async getClientStats(clientId: string): Promise<ClientStatsDto> {
//     const client = await this.prisma.client.findUnique({
//       where: { id: clientId },
//       include: {
//         user: {
//           select: { createdAt: true, updatedAt: true },
//         },
//       },
//     });

//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }

//     // Get all bookings for this client via vehicles
//     const bookings = await this.prisma.booking.findMany({
//       where: {
//         vehicle: {
//           clientId: clientId,
//         },
//       },
//       include: {
//         statusHistory: {
//           include: { status: true },
//           orderBy: { createdAt: 'desc' },
//           take: 1,
//         },
//       },
//     });

//     let completedBookings = 0;
//     let cancelledBookings = 0;
//     let pendingBookings = 0;
//     let inProgressBookings = 0;
//     let totalSpent = 0;

//     for (const booking of bookings) {
//       const latestStatus =
//         booking.statusHistory?.[0]?.status?.context || 'PENDING';

//       switch (latestStatus) {
//         case 'COMPLETED':
//           completedBookings++;
//           totalSpent += Number(booking.totalPrice);
//           break;
//         case 'CANCELLED':
//           cancelledBookings++;
//           break;
//         case 'PENDING':
//         case 'CONFIRMED':
//           pendingBookings++;
//           break;
//         case 'IN_PROGRESS':
//         case 'VEHICLE_RECEIVED':
//         case 'READY_FOR_PICKUP':
//           inProgressBookings++;
//           break;
//       }
//     }

//     // Get loyalty points
//     const loyaltyResult = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: { points: true },
//     });

//     const loyaltyPoints = loyaltyResult._sum.points || 0;

//     // Get vehicles count
//     const vehiclesCount = await this.prisma.clientVehicle.count({
//       where: { clientId: clientId },
//     });

//     return {
//       total_bookings: bookings.length,
//       completed_bookings: completedBookings,
//       cancelled_bookings: cancelledBookings,
//       pending_bookings: pendingBookings,
//       in_progress_bookings: inProgressBookings,
//       total_spent: totalSpent,
//       average_booking_value:
//         bookings.length > 0 ? totalSpent / bookings.length : 0,
//       loyalty_points: loyaltyPoints,
//       vehicles_count: vehiclesCount,
//       member_since: client.user.createdAt,
//       last_active: client.user.updatedAt,
//     };
//   }

//   /**
//    * Get client booking history
//    */
//   async getBookingHistory(
//     userId: string,
//     page: number = 1,
//     limit: number = 20,
//     status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }

//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     const where: any = {
//       vehicle: { clientId: client.id },
//     };

//     if (status) {
//       where.statusHistory = {
//         some: {
//           status: { context: status },
//         },
//       };
//     }

//     const [bookings, total] = await Promise.all([
//       this.prisma.booking.findMany({
//         where,
//         include: {
//           business: {
//             select: {
//               businessName: true,
//               address: true,
//               contactPhone: true,
//             },
//           },
//           vehicle: {
//             select: {
//               licensePlate: true,
//               model: true,
//               color: true,
//             },
//           },
//           statusHistory: {
//             include: { status: true },
//             orderBy: { createdAt: 'desc' },
//             take: 1,
//           },
//           items: {
//             include: {
//               businessService: {
//                 include: {
//                   service: true,
//                 },
//               },
//             },
//           },
//           payment: { include: { status: true } },
//           review: true,
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.booking.count({ where }),
//     ]);

//     const formattedBookings = bookings.map((booking) => {
//       const latestStatus = booking.statusHistory?.[0];
//       const payment = booking.payment;
//       const review = booking.review;

//       return {
//         id: booking.id,
//         business_name: booking.business.businessName,
//         business_address: booking.business.address,
//         vehicle: {
//           license_plate: booking.vehicle.licensePlate,
//           model: booking.vehicle.model,
//           color: booking.vehicle.color,
//         },
//         scheduled_at: booking.scheduledAt,
//         expected_delivery_at: booking.expectedDeliveryAt,
//         services: booking.items.map((item) => ({
//           name: item.businessService?.service?.title,
//           price: Number(item.price),
//         })),
//         subtotal: Number(booking.subTotal),
//         discount: Number(booking.discount),
//         commission: Number(booking.commission),
//         total_price: Number(booking.totalPrice),
//         status: latestStatus?.status?.context || 'PENDING',
//         status_created_at: latestStatus?.createdAt,
//         payment_status: payment?.status?.context || 'PENDING',
//         is_reviewed: !!review,
//         rating: review?.rating,
//         created_at: booking.createdAt,
//       };
//     });

//     return {
//       data: formattedBookings,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   /**
//    * Get client's favorite services (most booked)
//    */
//   async getFavoriteServices(
//     userId: string,
//     limit: number = 10,
//   ): Promise<
//     Array<{
//       service_id: string;
//       service_name: string;
//       category: string;
//       booking_count: number;
//     }>
//   > {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }

//     const results = await this.prisma.$queryRaw`
//       SELECT 
//         s.id as service_id,
//         s.title as service_name,
//         c.name as category,
//         COUNT(*) as booking_count
//       FROM booking_items bi
//       JOIN bookings b ON bi.booking_id = b.id
//       JOIN client_vehicles v ON b.vehicle_id = v.id
//       JOIN business_service bs ON bi.business_service_id = bs.id
//       JOIN services s ON bs.service_id = s.id
//       JOIN categories c ON s.category_id = c.id
//       WHERE v.client_id = ${client.id}
//       GROUP BY s.id, s.title, c.name
//       ORDER BY booking_count DESC
//       LIMIT ${limit}
//     `;

//     return results as Array<any>;
//   }

//   /**
//    * Get client loyalty transaction history
//    */
//   async getLoyaltyHistory(
//     userId: string,
//     page: number = 1,
//     limit: number = 20,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       throw new NotFoundException('Client profile not found');
//     }

//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     const [transactions, total] = await Promise.all([
//       this.prisma.loyaltyTransaction.findMany({
//         where: { clientId: client.id },
//         include: {
//           booking: {
//             include: { business: { select: { businessName: true } } },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take,
//       }),
//       this.prisma.loyaltyTransaction.count({
//         where: { clientId: client.id },
//       }),
//     ]);

//     let runningBalance = await this.getClientPointsBalance(client.id);

//     const transactionsWithBalance = [...transactions]
//       .reverse()
//       .map((t, idx, arr) => {
//         if (idx === 0) {
//           return { ...t, balance_after: runningBalance };
//         }
//         const prevPoints = arr[idx - 1]?.points || 0;
//         runningBalance = runningBalance - prevPoints;
//         return { ...t, balance_after: runningBalance };
//       })
//       .reverse();

//     return {
//       data: transactionsWithBalance.map((t) => ({
//         id: t.id,
//         type: t.type,
//         points: t.points,
//         reason: t.reason,
//         booking_code: (t.booking as any)?.id,
//         business_name: t.booking?.business?.businessName,
//         balance_after: t.balance_after,
//         created_at: t.createdAt,
//       })),
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   /**
//    * Get client points balance
//    */
//   async getClientPointsBalance(clientId: string): Promise<number> {
//     const result = await this.prisma.loyaltyTransaction.aggregate({
//       where: { clientId: clientId },
//       _sum: { points: true },
//     });
//     return result._sum.points || 0;
//   }

//   /**
//    * Search clients by name, email, or phone (admin only)
//    */
//   async searchClients(
//     searchTerm: string,
//     page: number = 1,
//     limit: number = 20,
//   ): Promise<{ data: ClientResponseDto[]; meta: any }> {
//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     const where = {
//       user: {
//         isActive: true,
//         deletedAt: null,
//         role: 'CLIENT' as const,
//         OR: [
//           { fullName: { contains: searchTerm, mode: 'insensitive' as const } },
//           { email: { contains: searchTerm, mode: 'insensitive' as const } },
//           { phone: { contains: searchTerm } },
//         ],
//       },
//     };

//     const [clients, total] = await Promise.all([
//       this.prisma.client.findMany({
//         where,
//         include: {
//           user: {
//             select: {
//               id: true,
//               fullName: true,
//               email: true,
//               phone: true,
//               emailVerified: true,
//               phoneVerified: true,
//               createdAt: true,
//               updatedAt: true,
//             },
//           },
//         },
//         skip,
//         take,
//       }),
//       this.prisma.client.count({ where }),
//     ]);

//     const clientsWithStats = await Promise.all(
//       clients.map(async (client) => {
//         const stats = await this.getClientStats(client.id);
//         return this.mapToResponseDto(client, stats);
//       }),
//     );

//     return {
//       data: clientsWithStats,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   /**
//    * Get top clients by spending (admin only)
//    */
//   async getTopClientsBySpending(
//     limit: number = 10,
//     startDate?: Date,
//     endDate?: Date,
//   ): Promise<ClientResponseDto[]> {
//     const dateFilter =
//       startDate && endDate
//         ? { created_at: { gte: startDate, lte: endDate } }
//         : {};

//     const topClients = await this.prisma.$queryRaw<Array<any>>`
//       SELECT 
//         c.id,
//         c.user_id,
//         u.full_name,
//         u.email,
//         u.phone,
//         u.avatar_url,
//         COALESCE(SUM(b.total_price), 0) as total_spent,
//         COUNT(b.id) as total_bookings
//       FROM clients c
//       JOIN users u ON c.user_id = u.id
//       LEFT JOIN client_vehicles v ON v.client_id = c.id
//       LEFT JOIN bookings b ON b.vehicle_id = v.id
//       ${startDate && endDate ? `WHERE b.created_at BETWEEN ${startDate} AND ${endDate}` : ''}
//       WHERE u.is_active = true
//         AND u.deleted_at IS NULL
//       GROUP BY c.id, u.id
//       ORDER BY total_spent DESC
//       LIMIT ${limit}
//     `;

//     return topClients.map((client) => ({
//       id: client.id,
//       user_id: client.user_id,
//       full_name: client.full_name,
//       email: client.email,
//       phone: client.phone,
//       avatar_url: client.avatar_url,
//       email_verified: true,
//       phone_verified: true,
//       total_bookings: parseInt(client.total_bookings, 10),
//       total_spent: parseFloat(client.total_spent),
//       loyalty_points: 0,
//       vehicles_count: 0,
//       created_at: new Date(),
//       updated_at: new Date(),
//     }));
//   }

//   /**
//    * Delete client (soft delete user, which cascades)
//    */
//   async deleteClient(
//     userId: string,
//     requesterId: string,
//     requesterRole: string,
//   ): Promise<{ success: boolean; message: string }> {
//     if (requesterId !== userId && requesterRole !== 'ADMIN') {
//       throw new ForbiddenException('You are not allowed to delete this client');
//     }

//     const client = await this.prisma.client.findUnique({
//       where: { userId: userId },
//     });

//     if (!client) {
//       throw new NotFoundException('Client not found');
//     }

//     // Soft delete user
//     await this.prisma.user.update({
//       where: { id: userId },
//       data: {
//         isActive: false,
//         deletedAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     // Invalidate all sessions
//     await this.prisma.userSession.deleteMany({
//       where: { userId: userId },
//     });

//     this.logger.log(`Client deleted for user ${userId}`);

//     this.eventEmitter.emit('client.deleted', { userId, clientId: client.id });

//     return {
//       success: true,
//       message: 'Client deleted successfully',
//     };
//   }

//   // ==================== PRIVATE HELPERS ====================

//   private parseLocation(
//     location: any,
//   ): { latitude: number; longitude: number } | undefined {
//     if (!location) return undefined;

//     try {
//       const coords = (location as any).coordinates;
//       if (coords && Array.isArray(coords) && coords.length === 2) {
//         return {
//           longitude: coords[0],
//           latitude: coords[1],
//         };
//       }
//     } catch {
//       return undefined;
//     }
//     return undefined;
//   }

//   private mapToResponseDto(
//     client: any,
//     stats: ClientStatsDto,
//   ): ClientResponseDto {
//     return {
//       id: client.id,
//       user_id: client.userId || client.user_id,
//       full_name: client.user?.fullName || client.user?.full_name,
//       email: client.user?.email,
//       phone: client.user?.phone || undefined,
//       avatar_url: (client.user as any)?.avatar_url || undefined,
//       email_verified: client.user?.emailVerified ?? client.user?.email_verified,
//       phone_verified: client.user?.phoneVerified ?? client.user?.phone_verified,
//       location: this.parseLocation(client.location),
//       total_bookings: stats.total_bookings,
//       total_spent: stats.total_spent,
//       loyalty_points: stats.loyalty_points,
//       vehicles_count: stats.vehicles_count,
//       created_at: client.createdAt || client.created_at,
//       updated_at: client.updatedAt || client.updated_at,
//     };
//   }
// }
