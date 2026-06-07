import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { VehicleResponseDto, VehicleWithStatsResponseDto, VehicleBookingHistoryDto } from './dto/vehicle-response.dto';

const SORT_FIELD_MAP: Record<string, string> = {
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  scheduled_at: 'scheduledAt',
  license_plate: 'licensePlate',
};

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async getClientIdFromUserId(userId: string): Promise<string> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client.id;
  }

  async createVehicle(
    userId: string,
    dto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const clientId = await this.getClientIdFromUserId(userId);

    const existingVehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        clientId,
        licensePlate: dto.license_plate.toUpperCase(),
      },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this license plate already exists');
    }

    const vehicle = await this.prisma.clientVehicle.create({
      data: {
        clientId,
        licensePlate: dto.license_plate.toUpperCase(),
        model: dto.model,
        year: dto.year,
        color: dto.color,
      },
    });

    this.logger.log(`Vehicle created for client ${clientId}: ${dto.license_plate}`);

    this.eventEmitter.emit('vehicle.created', {
      userId,
      clientId,
      vehicleId: vehicle.id,
      licensePlate: dto.license_plate,
    });

    return this.mapToResponseDto(vehicle);
  }

  async getUserVehicles(userId: string): Promise<VehicleResponseDto[]> {
    const clientId = await this.getClientIdFromUserId(userId);

    const vehicles = await this.prisma.clientVehicle.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    return vehicles.map(v => this.mapToResponseDto(v));
  }

  async getVehicle(
    userId: string,
    vehicleId: string,
  ): Promise<VehicleWithStatsResponseDto> {
    const clientId = await this.getClientIdFromUserId(userId);

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        id: vehicleId,
        clientId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const stats = await this.getVehicleStats(vehicleId);

    return {
      ...this.mapToResponseDto(vehicle),
      ...stats,
    };
  }

  async updateVehicle(
    userId: string,
    vehicleId: string,
    dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const clientId = await this.getClientIdFromUserId(userId);

    const existingVehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        id: vehicleId,
        clientId,
      },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.license_plate && dto.license_plate !== existingVehicle.licensePlate) {
      const duplicate = await this.prisma.clientVehicle.findFirst({
        where: {
          clientId,
          licensePlate: dto.license_plate.toUpperCase(),
          id: { not: vehicleId },
        },
      });
      if (duplicate) {
        throw new ConflictException('Vehicle with this license plate already exists');
      }
    }

    const updatedVehicle = await this.prisma.clientVehicle.update({
      where: { id: vehicleId },
      data: {
        licensePlate: dto.license_plate?.toUpperCase(),
        model: dto.model,
        year: dto.year,
        color: dto.color,
      },
    });

    this.logger.log(`Vehicle updated: ${vehicleId} for client ${clientId}`);

    this.eventEmitter.emit('vehicle.updated', {
      userId,
      clientId,
      vehicleId,
      updates: Object.keys(dto),
    });

    return this.mapToResponseDto(updatedVehicle);
  }

  async deleteVehicle(
    userId: string,
    vehicleId: string,
  ): Promise<{ success: boolean; message: string }> {
    const clientId = await this.getClientIdFromUserId(userId);

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        id: vehicleId,
        clientId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const bookingsCount = await this.prisma.booking.count({
      where: { vehicleId },
    });

    if (bookingsCount > 0) {
      throw new BadRequestException(
        `Cannot delete vehicle with ${bookingsCount} existing booking(s). Archive it instead.`,
      );
    }

    await this.prisma.clientVehicle.delete({
      where: { id: vehicleId },
    });

    this.logger.log(`Vehicle deleted: ${vehicleId} for client ${clientId}`);

    this.eventEmitter.emit('vehicle.deleted', {
      userId,
      clientId,
      vehicleId,
      licensePlate: vehicle.licensePlate,
    });

    return {
      success: true,
      message: 'Vehicle deleted successfully',
    };
  }

  async getVehicleStats(vehicleId: string): Promise<{
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    total_spent: number;
    last_booking_at?: Date;
    next_booking_at?: Date;
  }> {
    const bookings = await this.prisma.booking.findMany({
      where: { vehicleId },
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
        orderBy: { scheduledAt: 'desc' },
      });

    let completedBookings = 0;
    let cancelledBookings = 0;
    let totalSpent = 0;
    let lastBookingAt: Date | undefined;
    let nextBookingAt: Date | undefined;
    const now = new Date();

    for (const booking of bookings) {
      const latestStatus = booking.statusHistory[0]?.status?.context || 'PENDING';

      if (latestStatus === 'COMPLETED') {
        completedBookings++;
        if (booking.payment?.status?.context === 'PAID') {
          totalSpent += Number(booking.totalPrice);
        }
      } else if (latestStatus === 'CANCELLED') {
        cancelledBookings++;
      }

      if (!lastBookingAt || booking.scheduledAt > lastBookingAt) {
        lastBookingAt = booking.scheduledAt;
      }

      if (booking.scheduledAt > now &&
          (!nextBookingAt || booking.scheduledAt < nextBookingAt) &&
          latestStatus !== 'CANCELLED') {
        nextBookingAt = booking.scheduledAt;
      }
    }

    return {
      total_bookings: bookings.length,
      completed_bookings: completedBookings,
      cancelled_bookings: cancelledBookings,
      total_spent: totalSpent,
      last_booking_at: lastBookingAt,
      next_booking_at: nextBookingAt,
    };
  }

  async getVehicleBookingHistory(
    userId: string,
    vehicleId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{ data: VehicleBookingHistoryDto[]; meta: any }> {
    const clientId = await this.getClientIdFromUserId(userId);

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        id: vehicleId,
        clientId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const where: any = { vehicleId };

    if (status) {
      where.statusHistory = {
        some: {
          status: { context: status },
        },
      };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          business: {
            select: {
              businessName: true,
            },
          },
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          payment: {
            include: { status: true },
          },
          review: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.booking.count({ where }),
    ]);

    const formattedBookings: VehicleBookingHistoryDto[] = bookings.map(booking => {
      const latestStatus = booking.statusHistory[0];
      const payment = booking.payment;
      const review = booking.review;

      return {
        id: booking.id,
        booking_code: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
        business_name: booking.business.businessName,
        scheduled_at: booking.scheduledAt,
        total_price: Number(booking.totalPrice),
        status: latestStatus?.status?.context || 'PENDING',
        payment_status: payment?.status?.context || 'PENDING',
        rating: review?.rating,
        created_at: booking.createdAt,
      };
    });

    return {
      data: formattedBookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        vehicle: {
          id: vehicle.id,
          license_plate: vehicle.licensePlate,
          model: vehicle.model,
        },
      },
    };
  }

  async getUpcomingBookings(
    userId: string,
    vehicleId: string,
    limit: number = 5,
  ): Promise<VehicleBookingHistoryDto[]> {
    const clientId = await this.getClientIdFromUserId(userId);

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: {
        id: vehicleId,
        clientId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const now = new Date();

    const bookings = await this.prisma.booking.findMany({
      where: {
        vehicleId,
        scheduledAt: { gt: now },
      },
      include: {
        business: {
          select: { businessName: true },
        },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payment: {
          include: { status: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });

    return bookings.map(booking => {
      const latestStatus = booking.statusHistory[0];
      const payment = booking.payment;

      return {
        id: booking.id,
        booking_code: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
        business_name: booking.business.businessName,
        scheduled_at: booking.scheduledAt,
        total_price: Number(booking.totalPrice),
        status: latestStatus?.status?.context || 'PENDING',
        payment_status: payment?.status?.context || 'PENDING',
        created_at: booking.createdAt,
      };
    });
  }

  // ==================== ADMIN ENDPOINTS ====================

  async getAllVehicles(
    query: QueryVehiclesDto,
  ): Promise<{ data: VehicleWithStatsResponseDto[]; meta: any }> {
    const {
      page = 1,
      limit = 20,
      search,
      year,
      color,
      sort_by = 'created_at',
      sort_order = 'desc',
      include_deleted = false,
    } = query;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const where: any = {};

    if (!include_deleted) {
      where.client = { user: { deletedAt: null, isActive: true } };
    }

    if (search) {
      where.OR = [
        { licensePlate: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { client: { user: { fullName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (year) {
      where.year = year;
    }

    if (color) {
      where.color = { contains: color, mode: 'insensitive' };
    }

    const orderField = SORT_FIELD_MAP[sort_by] || sort_by;

    const [vehicles, total] = await Promise.all([
      this.prisma.clientVehicle.findMany({
        where,
        include: {
          client: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { [orderField]: sort_order },
        skip,
        take,
      }),
      this.prisma.clientVehicle.count({ where }),
    ]);

    const vehiclesWithStats = await Promise.all(
      vehicles.map(async (vehicle) => {
        const stats = await this.getVehicleStats(vehicle.id);
        return {
          id: vehicle.id,
          client_id: vehicle.clientId,
          client_name: vehicle.client.user.fullName,
          client_email: vehicle.client.user.email,
          license_plate: vehicle.licensePlate,
          model: vehicle.model ?? undefined,
          year: vehicle.year ?? undefined,
          color: vehicle.color ?? undefined,
          created_at: vehicle.createdAt,
          updated_at: vehicle.updatedAt,
          ...stats,
        };
      }),
    );

    return {
      data: vehiclesWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicleByIdAdmin(vehicleId: string): Promise<any> {
    const vehicle = await this.prisma.clientVehicle.findUnique({
      where: { id: vehicleId },
      include: {
        client: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const stats = await this.getVehicleStats(vehicleId);

    return {
      ...vehicle,
      client_name: vehicle.client.user.fullName,
      client_email: vehicle.client.user.email,
      ...stats,
    };
  }

  async getVehiclesByClient(
    clientId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: VehicleResponseDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [vehicles, total] = await Promise.all([
      this.prisma.clientVehicle.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.clientVehicle.count({ where: { clientId } }),
    ]);

    return {
      data: vehicles.map(v => this.mapToResponseDto(v)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMostUsedVehicles(limit: number = 10): Promise<any[]> {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT
        v.id,
        v.license_plate,
        v.model,
        v.year,
        v.color,
        COUNT(b.id) as booking_count,
        SUM(b.total_price) as total_revenue,
        u.full_name as owner_name
      FROM client_vehicles v
      JOIN clients c ON v.client_id = c.id
      JOIN users u ON c.user_id = u.id
      LEFT JOIN bookings b ON v.id = b.vehicle_id
      WHERE u.is_active = true
        AND u.deleted_at IS NULL
      GROUP BY v.id, u.full_name
      ORDER BY booking_count DESC
      LIMIT ${limit}
    `;

    return results;
  }

  async archiveVehicle(vehicleId: string): Promise<{ success: boolean; message: string }> {
    const vehicle = await this.prisma.clientVehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const futureBookings = await this.prisma.booking.count({
      where: {
        vehicleId,
        scheduledAt: { gt: new Date() },
        statusHistory: {
          none: {
            status: { context: 'CANCELLED' },
          },
        },
      },
    });

    if (futureBookings > 0) {
      throw new BadRequestException(
        `Cannot archive vehicle with ${futureBookings} future booking(s)`,
      );
    }

    await this.prisma.clientVehicle.delete({
      where: { id: vehicleId },
    });

    this.logger.log(`Vehicle archived: ${vehicleId}`);

    return {
      success: true,
      message: 'Vehicle archived successfully',
    };
  }

  // ==================== PRIVATE HELPERS ====================

  private mapToResponseDto(vehicle: any): VehicleResponseDto {
    return {
      id: vehicle.id,
      client_id: vehicle.clientId,
      license_plate: vehicle.licensePlate,
      model: vehicle.model || undefined,
      year: vehicle.year || undefined,
      color: vehicle.color || undefined,
      created_at: vehicle.createdAt,
      updated_at: vehicle.updatedAt,
    };
  }
}
