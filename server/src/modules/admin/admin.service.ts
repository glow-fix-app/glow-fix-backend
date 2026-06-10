import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import {
  DashboardStatsDto,
  RevenueStatsDto,
  TopPerformersDto,
  PlatformHealthDto,
} from './dto/admin-stats.dto';
import {
  GetUsersAdminDto,
  CreateUserAdminDto,
  UpdateUserAdminDto,
  UserResponseAdminDto,
  UserRole,
} from './dto/admin-users.dto';
import {
  GetBusinessesAdminDto,
  ApproveBusinessDto,
  RejectBusinessDto,
  BusinessResponseAdminDto,
  BusinessStatus,
} from './dto/admin-businesses.dto';
import {
  UpdateSystemSettingsDto,
  SystemSettingsResponseDto,
} from './dto/admin-settings.dto';
import {
  GetPayoutsAdminDto,
  ProcessPayoutDto,
  PayoutStatus,
} from './dto/admin-payouts.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== DASHBOARD STATISTICS ====================

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User stats
    const [totalUsers, newUsersToday, newUsersThisWeek, userStats] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    const totalClients = userStats.find(u => u.role === 'CLIENT')?._count || 0;
    const totalManagers = userStats.find(u => u.role === 'MANAGER')?._count || 0;
    const totalAdmins = userStats.find(u => u.role === 'ADMIN')?._count || 0;

    // Business stats
    const [totalBusinesses, pendingBusinesses, approvedBusinesses, rejectedBusinesses] = await Promise.all([
      this.prisma.business.count(),
      this.prisma.business.count({
        where: {
          statusHistory: {
            some: { status: { context: 'PENDING_REVIEW' } },
          },
        },
      }),
      this.prisma.business.count({
        where: {
          statusHistory: {
            some: { status: { context: 'APPROVED' } },
          },
        },
      }),
      this.prisma.business.count({
        where: {
          statusHistory: {
            some: { status: { context: 'REJECTED' } },
          },
        },
      }),
    ]);

    // Booking stats
    const [totalBookings, completedBookings, pendingBookings, cancelledBookings] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: {
          statusHistory: {
            some: { status: { context: 'COMPLETED' } },
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          statusHistory: {
            some: { status: { context: 'PENDING' } },
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          statusHistory: {
            some: { status: { context: 'CANCELLED' } },
          },
        },
      }),
    ]);

    // Revenue stats
    const payments = await this.prisma.payment.findMany({
      where: {
        status: { context: 'PAID' },
      },
      select: {
        amount: true,
      },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const platformFees = totalRevenue * 0.1; // 10% platform fee
    const netRevenue = totalRevenue - platformFees;

    // Payout stats
    const [totalPayouts, pendingPayouts] = await Promise.all([
      this.prisma.payout.count(),
      this.prisma.payout.count({
        where: {
          status: { context: 'PAYOUT_PENDING' },
        },
      }),
    ]);

    // Reviews stats
    const reviews = await this.prisma.review.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    });

    return {
      total_users: totalUsers,
      total_clients: totalClients,
      total_managers: totalManagers,
      total_admins: totalAdmins,
      new_users_today: newUsersToday,
      new_users_this_week: newUsersThisWeek,
      total_businesses: totalBusinesses,
      pending_businesses: pendingBusinesses,
      approved_businesses: approvedBusinesses,
      rejected_businesses: rejectedBusinesses,
      total_bookings: totalBookings,
      completed_bookings: completedBookings,
      pending_bookings: pendingBookings,
      cancelled_bookings: cancelledBookings,
      total_revenue: totalRevenue / 100, // Convert from cents
      platform_fees: platformFees / 100,
      net_revenue: netRevenue / 100,
      total_payouts: totalPayouts,
      pending_payouts: pendingPayouts,
      average_rating: Math.round((reviews._avg.rating || 0) * 10) / 10,
      total_reviews: reviews._count.id,
    };
  }

  async getRevenueStats(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    months: number = 12,
  ): Promise<RevenueStatsDto> {
    const now = new Date();
    const result: RevenueStatsDto = {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: [],
    };

    // Get paid payments
    const payments = await this.prisma.payment.findMany({
      where: {
        status: { context: 'PAID' },
        createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) },
      },
      include: {
        booking: true,
      },
    });

    // Group by day
    const dailyMap = new Map<string, { revenue: number; fees: number; bookings: number }>();
    for (const payment of payments) {
      const date = payment.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { revenue: 0, fees: 0, bookings: 0 };
      const amount = Number(payment.amount) / 100;
      existing.revenue += amount;
      existing.fees += amount * 0.1;
      existing.bookings += 1;
      dailyMap.set(date, existing);
    }

    result.daily = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    // Group by week
    const weeklyMap = new Map<string, { revenue: number; fees: number; bookings: number }>();
    for (const payment of payments) {
      const week = this.getWeekNumber(payment.createdAt);
      const existing = weeklyMap.get(week) || { revenue: 0, fees: 0, bookings: 0 };
      const amount = Number(payment.amount) / 100;
      existing.revenue += amount;
      existing.fees += amount * 0.1;
      existing.bookings += 1;
      weeklyMap.set(week, existing);
    }

    result.weekly = Array.from(weeklyMap.entries())
      .map(([week, data]) => ({ week, ...data }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);

    // Group by month
    const monthlyMap = new Map<string, { revenue: number; fees: number; bookings: number }>();
    for (const payment of payments) {
      const month = payment.createdAt.toISOString().slice(0, 7);
      const existing = monthlyMap.get(month) || { revenue: 0, fees: 0, bookings: 0 };
      const amount = Number(payment.amount) / 100;
      existing.revenue += amount;
      existing.fees += amount * 0.1;
      existing.bookings += 1;
      monthlyMap.set(month, existing);
    }

    result.monthly = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-months);

    // Group by year
    const yearlyMap = new Map<number, { revenue: number; fees: number; bookings: number }>();
    for (const payment of payments) {
      const year = payment.createdAt.getFullYear();
      const existing = yearlyMap.get(year) || { revenue: 0, fees: 0, bookings: 0 };
      const amount = Number(payment.amount) / 100;
      existing.revenue += amount;
      existing.fees += amount * 0.1;
      existing.bookings += 1;
      yearlyMap.set(year, existing);
    }

    result.yearly = Array.from(yearlyMap.entries())
      .map(([year, data]) => ({ year, ...data }))
      .sort((a, b) => a.year - b.year);

    return result;
  }

  async getTopPerformers(limit: number = 10): Promise<TopPerformersDto> {
    // Top businesses
    const topBusinesses = await this.prisma.$queryRaw`
      SELECT 
        b.id,
        b.business_name,
        COUNT(DISTINCT bk.id) as total_bookings,
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM businesses b
      LEFT JOIN bookings bk ON b.id = bk.business_id
      LEFT JOIN payments p ON bk.id = p.booking_id AND p.status_id = (SELECT id FROM statuses WHERE context = 'PAID')
      LEFT JOIN reviews r ON bk.id = r.booking_id
      GROUP BY b.id
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;

    // Top clients
    const topClients = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        COUNT(DISTINCT bk.id) as total_bookings,
        COALESCE(SUM(p.amount), 0) as total_spent
      FROM users u
      JOIN clients c ON u.id = c.user_id
      JOIN client_vehicles v ON c.id = v.client_id
      LEFT JOIN bookings bk ON v.id = bk.vehicle_id
      LEFT JOIN payments p ON bk.id = p.booking_id AND p.status_id = (SELECT id FROM statuses WHERE context = 'PAID')
      WHERE u.role = 'CLIENT'
      GROUP BY u.id
      ORDER BY total_spent DESC
      LIMIT ${limit}
    `;

    return {
      top_businesses: (topBusinesses as any[]).map(b => ({
        id: b.id,
        business_name: b.business_name,
        total_bookings: Number(b.total_bookings),
        total_revenue: Number(b.total_revenue) / 100,
        average_rating: Math.round(Number(b.average_rating) * 10) / 10,
      })),
      top_clients: (topClients as any[]).map(c => ({
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        total_bookings: Number(c.total_bookings),
        total_spent: Number(c.total_spent) / 100,
      })),
    };
  }

  async getPlatformHealth(): Promise<PlatformHealthDto> {
    const startTime = Date.now();

    // Check database
    let dbStatus: 'ok' | 'error' = 'ok';
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch {
      dbStatus = 'error';
    }

    // Check Redis (if available)
    let redisStatus: 'ok' | 'error' = 'ok';
    let redisLatency = 0;
    try {
      const redisStart = Date.now();
      // This would need Redis service injection
      redisLatency = Date.now() - redisStart;
    } catch {
      redisStatus = 'error';
    }

    // Get process metrics
    const memoryUsage = process.memoryUsage();
    const memoryUsageMb = Math.round(memoryUsage.rss / 1024 / 1024);
    const cpuUsage = process.cpuUsage();
    const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000;

    return {
      database_status: dbStatus,
      database_latency_ms: dbLatency,
      redis_status: redisStatus,
      redis_latency_ms: redisLatency,
      storage_status: 'ok',
      uptime_seconds: Math.floor(process.uptime()),
      memory_usage_mb: memoryUsageMb,
      cpu_usage_percent: Math.min(Math.round(cpuPercent), 100),
    };
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(query: GetUsersAdminDto): Promise<{ data: UserResponseAdminDto[]; meta: any }> {
    const { role, search, email_verified, phone_verified, is_active, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    const where: any = {};

    if (role) where.role = role;
    if (email_verified !== undefined) where.email_verified = email_verified;
    if (phone_verified !== undefined) where.phone_verified = phone_verified;
    if (is_active !== undefined) where.is_active = is_active;

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          role: true,
          email_verified: true,
          phone_verified: true,
          is_active: true,
          avatar_url: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async getUserById(userId: string): Promise<UserResponseAdminDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        email_verified: true,
        phone_verified: true,
        is_active: true,
        avatar_url: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(dto: CreateUserAdminDto): Promise<UserResponseAdminDto> {
    // Check if email exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        password_hash: passwordHash,
        role: dto.role,
        email_verified: true,
        is_active: true,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        email_verified: true,
        phone_verified: true,
        is_active: true,
        avatar_url: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Create client record if role is CLIENT
    if (dto.role === UserRole.CLIENT) {
      await this.prisma.client.create({
        data: { user_id: user.id },
      });
    }

    this.logger.log(`Admin created user: ${user.email} (${dto.role})`);

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserAdminDto): Promise<UserResponseAdminDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { updated_at: new Date() };
    if (dto.full_name) updateData.full_name = dto.full_name;
    if (dto.email) updateData.email = dto.email.toLowerCase();
    if (dto.phone) updateData.phone = dto.phone;
    if (dto.role) updateData.role = dto.role;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;
    if (dto.password) updateData.password_hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        email_verified: true,
        phone_verified: true,
        is_active: true,
        avatar_url: true,
        created_at: true,
        updated_at: true,
      },
    });

    this.logger.log(`Admin updated user: ${updated.email}`);

    return updated;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        is_active: false,
        deleted_at: new Date(),
        updated_at: new Date(),
      },
    });

    this.logger.log(`Admin deleted (soft) user: ${user.email}`);

    return { message: 'User deleted successfully' };
  }

  // ==================== BUSINESS MANAGEMENT ====================

  async getAllBusinesses(query: GetBusinessesAdminDto): Promise<{ data: BusinessResponseAdminDto[]; meta: any }> {
    const { status, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    let where: any = {};

    if (status) {
      where.statusHistory = {
        some: { status: { context: status } },
      };
    }

    if (search) {
      where.business_name = { contains: search, mode: 'insensitive' };
    }

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          manager: {
            select: {
              full_name: true,
              email: true,
              phone: true,
            },
          },
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.business.count({ where }),
    ]);

    const businessesWithStats = await Promise.all(
      businesses.map(async (b) => {
        const stats = await this.getBusinessStats(b.id);
        return {
          id: b.id,
          business_name: b.business_name,
          manager_name: b.manager.full_name,
          manager_email: b.manager.email,
          manager_phone: b.manager.phone || undefined,
          address: b.address,
          latitude: await this.getBusinessLatitude(b.id),
          longitude: await this.getBusinessLongitude(b.id),
          current_status: b.statusHistory[0]?.status?.context || 'PENDING_REVIEW',
          total_bookings: stats.total_bookings,
          total_revenue: stats.total_revenue,
          average_rating: stats.average_rating,
          created_at: b.created_at,
        };
      }),
    );

    return {
      data: businessesWithStats,
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async getBusinessById(businessId: string): Promise<any> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        manager: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
          },
        },
        operating_hours: true,
        documents: {
          include: { status: true },
        },
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const stats = await this.getBusinessStats(businessId);

    return {
      ...business,
      latitude: await this.getBusinessLatitude(businessId),
      longitude: await this.getBusinessLongitude(businessId),
      total_bookings: stats.total_bookings,
      total_revenue: stats.total_revenue,
      average_rating: stats.average_rating,
    };
  }

  async approveBusiness(businessId: string, dto: ApproveBusinessDto): Promise<{ message: string }> {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      throw new BadRequestException('APPROVED status not found');
    }

    await this.prisma.businessStatus.create({
      data: {
        businessId,
        statusId: approvedStatus.id,
      },
    });

    this.logger.log(`Admin approved business: ${business.business_name} (${businessId})`);

    this.eventEmitter.emit('business.approved', {
      businessId,
      businessName: business.business_name,
      managerId: business.manager_id,
    });

    return { message: 'Business approved successfully' };
  }

  async rejectBusiness(businessId: string, dto: RejectBusinessDto): Promise<{ message: string }> {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const rejectedStatus = await this.prisma.status.findFirst({
      where: { context: 'REJECTED' },
    });

    if (!rejectedStatus) {
      throw new BadRequestException('REJECTED status not found');
    }

    await this.prisma.businessStatus.create({
      data: {
        businessId,
        statusId: rejectedStatus.id,
      },
    });

    await this.prisma.rejectionReason.create({
      data: {
        entityType: 'BUSINESS',
        entityId: businessId,
        reasonText: dto.reason,
      },
    });

    this.logger.log(`Admin rejected business: ${business.business_name} (${businessId})`);

    this.eventEmitter.emit('business.rejected', {
      businessId,
      businessName: business.business_name,
      managerId: business.manager_id,
      reason: dto.reason,
    });

    return { message: 'Business rejected successfully' };
  }

  // ==================== SETTINGS MANAGEMENT ====================

  async getSettings(): Promise<SystemSettingsResponseDto> {
    const settings = await this.prisma.setting.findFirst();
    return {
      business_fee_pct: settings?.businessFeePct ? Number(settings.businessFeePct) : 10,
      max_cancel_minutes: settings?.maxCancelMinutes || 120,
      max_booking_advance_days: 30,
      min_booking_cancel_hours: 2,
      maintenance_mode: false,
      updated_at: settings?.updatedAt || new Date(),
    };
  }

  async updateSettings(dto: UpdateSystemSettingsDto): Promise<SystemSettingsResponseDto> {
    const existing = await this.prisma.setting.findFirst();

    if (existing) {
      await this.prisma.setting.update({
        where: { id: existing.id },
        data: {
          businessFeePct: dto.business_fee_pct,
          maxCancelMinutes: dto.max_cancel_minutes,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.setting.create({
        data: {
          businessFeePct: dto.business_fee_pct || 10,
          maxCancelMinutes: dto.max_cancel_minutes || 120,
        },
      });
    }

    this.logger.log('Admin updated system settings');

    return this.getSettings();
  }

  // ==================== PAYOUT MANAGEMENT ====================

  async getAllPayouts(query: GetPayoutsAdminDto): Promise<{ data: any[]; meta: any }> {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    const where: any = {};
    if (status) {
      where.status = { context: status };
    }

    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        include: {
          business: {
            select: {
              business_name: true,
              manager: { select: { full_name: true, email: true } },
            },
          },
          status: true,
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.payout.count({ where }),
    ]);

    return {
      data: payouts.map(p => ({
        id: p.id,
        business_id: p.businessId,
        business_name: p.business.business_name,
        manager_name: p.business.manager.full_name,
        amount: Number(p.amount) / 100,
        status: p.status.context,
        processed_at: p.processedAt,
        created_at: p.createdAt,
      })),
      meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
    };
  }

  async processPayout(payoutId: string, dto: ProcessPayoutDto): Promise<{ message: string }> {
    const payout = await this.prisma.payout.findUnique({
      where: { id: payoutId },
      include: { status: true },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    const processedStatus = await this.prisma.status.findFirst({
      where: { context: 'PAYOUT_PROCESSED' },
    });

    if (!processedStatus) {
      throw new BadRequestException('PAYOUT_PROCESSED status not found');
    }

    await this.prisma.payout.update({
      where: { id: payoutId },
      data: {
        statusId: processedStatus.id,
        processedAt: new Date(),
        amount: dto.amount * 100,
      },
    });

    this.logger.log(`Admin processed payout: ${payoutId} for amount ${dto.amount}`);

    return { message: 'Payout processed successfully' };
  }

  // ==================== PRIVATE HELPERS ====================

  private getWeekNumber(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const week = Math.ceil((((d.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1) / 7);
    return `${year}-W${week}`;
  }

  private async getBusinessStats(businessId: string): Promise<{ total_bookings: number; total_revenue: number; average_rating: number }> {
    const bookings = await this.prisma.booking.findMany({
      where: { businessId },
      include: {
        payments: true,
        reviews: true,
      },
    });

    let totalRevenue = 0;
    let totalRating = 0;
    let reviewCount = 0;

    for (const booking of bookings) {
      if (booking.payments?.status?.context === 'PAID') {
        totalRevenue += Number(booking.totalPrice);
      }
      if (booking.reviews) {
        totalRating += booking.reviews.rating;
        reviewCount++;
      }
    }

    return {
      total_bookings: bookings.length,
      total_revenue: totalRevenue / 100,
      average_rating: reviewCount > 0 ? Math.round((totalRating / reviewCount) * 10) / 10 : 0,
    };
  }

  private async getBusinessLatitude(businessId: string): Promise<number> {
    const result = await this.prisma.$queryRaw<Array<{ latitude: number }>>`
      SELECT ST_Y(location::geometry) as latitude FROM businesses WHERE id = ${businessId}::uuid
    `;
    return result[0]?.latitude || 0;
  }

  private async getBusinessLongitude(businessId: string): Promise<number> {
    const result = await this.prisma.$queryRaw<Array<{ longitude: number }>>`
      SELECT ST_X(location::geometry) as longitude FROM businesses WHERE id = ${businessId}::uuid
    `;
    return result[0]?.longitude || 0;
  }
}