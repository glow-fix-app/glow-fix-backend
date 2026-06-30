import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateClientLocationDto } from './dto/client-location.dto';
import { ClientStatsDto, LoyaltySummaryDto } from './dto/client-stats.dto';
import { NearbyBusinessDto } from './dto/client-response.dto';
import { validate as isUUID } from 'uuid';
import { reverseGeocodeCity } from '../../utils/geocode';
import { ClientsRepository } from './clients.repository';
import { ClientWithUser } from './interfaces/client-repository.interface';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private readonly repository: ClientsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get client by user ID
   */
  async getClientByUserId(userId: string) {
    const client = await this.repository.findClientByUserIdWithUser(userId);

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

    await this.repository.updateClientLocation(userId, dto.latitude, dto.longitude, city ?? null);

    this.logger.log(`Location updated for client ${userId}: ${dto.latitude}, ${dto.longitude}, city: ${city}`);

    this.eventEmitter.emit('client.location_updated', {
      userId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      city,
    });

    return {
      success: true,
      location: { latitude: dto.latitude, longitude: dto.longitude, city: city ?? null },
    };
  }

  /**
   * Get client location
   */
  async getLocation(userId: string): Promise<{ latitude: number; longitude: number } | null> {
    if (!isUUID(userId)) return null;

    const result = await this.repository.getClientLocation(userId);

    if (!result || result.latitude === null || result.longitude === null) {
      return null;
    }

    return {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  }

  /**
   * Get client statistics (bookings, spending, points)
   */
  async getClientStats(userId: string): Promise<ClientStatsDto> {
    const client = await this.getClientOrThrow(userId);

    const bookings = await this.repository.getClientBookingsWithPaymentAndStatus(client.id);

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

    const loyaltyPoints = await this.repository.getLoyaltyPointsBalance(client.id);
    const vehiclesCount = await this.repository.countClientVehicles(client.id);
    const user = await this.repository.findUserById(userId);

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
    const client = await this.getClientOrThrow(userId);

    const pointsBalance = await this.repository.getLoyaltyPointsBalance(client.id);
    const pointsValueEgp = pointsBalance * 0.1; // 10 points = 1 EGP

    const transactions = await this.repository.getRecentLoyaltyTransactions(client.id, 20);

    const recentTransactions = transactions.map((t: any) => ({
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
    const client = await this.getClientOrThrow(userId);

    const location = await this.getLocation(userId);
    if (!location) {
      throw new NotFoundException('Client location not set. Please update your location first.');
    }

    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 50);
    const radiusMeters = radiusKm * 1000;

    const approvedStatusId = await this.repository.getApprovedBusinessStatusId();

    if (!approvedStatusId) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const results = await this.repository.getNearbyBusinesses(
      location.latitude,
      location.longitude,
      radiusMeters,
      limitNum,
      skip,
      approvedStatusId,
    );

    const total = await this.repository.countNearbyBusinesses(
      location.latitude,
      location.longitude,
      radiusMeters,
      approvedStatusId,
    );

    const now = new Date();

    const businessesWithOpenStatus = await Promise.all(
      results.map(async (b: any) => ({
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

    const hours = await this.repository.getBusinessOperatingHours(businessId, dayOfWeek);

    if (!hours || !hours.openTime || !hours.closeTime) {
      return false;
    }

    return timeStr >= hours.openTime && timeStr <= hours.closeTime;
  }

  /**
   * Get client's vehicles (returns vehicle IDs for integration with Vehicles module)
   */
  async getClientVehicles(userId: string): Promise<Array<{ id: string; license_plate: string; model?: string; year?: number; color?: string }>> {
    const client = await this.getClientOrThrow(userId);

    const vehicles = await this.repository.getClientVehicles(client.id);

    return vehicles.map((v: any) => ({
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

    const client = await this.repository.findClientByUserId(userId);

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }
}
