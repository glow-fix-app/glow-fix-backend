import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly winstonLogger: WinstonLoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    console.log('[PRISMA] onModuleInit ENTERED');
    // Query logging - warn on slow queries (>200ms)
    console.log('[PRISMA] about to $on query...');
    this.$on('query' as never, (event: any) => {
      if (event.duration > 200) {
        this.winstonLogger.warn(
          `Slow query detected (${event.duration}ms): ${event.query}`,
          'PrismaService',
        );
      }
    });
    console.log('[PRISMA] $on query OK');

    // Error logging
    console.log('[PRISMA] about to $on error...');
    this.$on('error' as never, (event: any) => {
      this.winstonLogger.error(
        `Database error: ${event.message}`,
        event.target,
        'PrismaService',
      );
    });
    console.log('[PRISMA] $on error OK');

    // Warning logging
    console.log('[PRISMA] about to $on warn...');
    this.$on('warn' as never, (event: any) => {
      this.winstonLogger.warn(`Database warning: ${event.message}`, 'PrismaService');
    });
    console.log('[PRISMA] $on warn OK');

    console.log('[PRISMA] about to $connect() with 10s timeout...');
    try {
      const result = await Promise.race([
        this.$connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Prisma $connect() timed out after 10s')), 10000),
        ),
      ]);
      console.log('[PRISMA] $connect() resolved!');
      this.logger.log('✅ Database connected successfully');
    } catch (err: any) {
      console.log(`[PRISMA] CATCH: ${err.message}`);
      this.logger.error(`Database connection failed: ${err.message}`, err.stack, 'PrismaService');
      throw err;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Soft delete a user (set deleted_at and is_active = false)
   * Based on schema: users table has deleted_at and is_active fields
   */
  async softDeleteUser(userId: string): Promise<void> {
    await this.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Hard delete expired records
   */
  async cleanupExpiredRecords(): Promise<{
    sessions: number;
    otps: number;
  }> {
    const now = new Date();

    // Delete expired sessions
    const sessionsResult = await this.userSession.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    // Delete expired OTPs
    const otpsResult = await this.userOtp.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    return {
      sessions: sessionsResult.count,
      otps: otpsResult.count,
    };
  }

  /**
   * Get client by user ID with location parsed
   */
  async getClientWithLocation(userId: string): Promise<any> {
    const result = await this.$queryRaw<Array<any>>`
      SELECT 
        c.id,
        c.user_id,
        c.created_at,
        c.updated_at,
        ST_Y(c.location::geometry) as latitude,
        ST_X(c.location::geometry) as longitude,
        u.full_name,
        u.email,
        u.phone,
        u.avatar_url,
        u.email_verified,
        u.phone_verified
      FROM clients c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ${userId}
    `;

    return result[0] || null;
  }

  /**
   * Find clients within radius (PostGIS query)
   */
  async findNearbyClients(
    latitude: number,
    longitude: number,
    radiusKm: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<any[]> {
    const radiusMeters = radiusKm * 1000;

    return this.$queryRaw`
      SELECT 
        c.id,
        c.user_id,
        u.full_name,
        u.email,
        u.phone,
        u.avatar_url,
        ROUND((ST_Distance(c.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km
      FROM clients c
      JOIN users u ON c.user_id = u.id
      WHERE u.is_active = true
        AND u.deleted_at IS NULL
        AND u.role = 'CLIENT'
        AND ST_DWithin(
          c.location, 
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY distance_km
      LIMIT ${limit}
      OFFSET ${offset}
    `;
  }

  /**
   * Update client location
   */
  async updateClientLocation(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    await this.$executeRaw`
      UPDATE clients 
      SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          updated_at = NOW()
      WHERE user_id = ${userId}
    `;
  }

  /**
   * Get booking with status history
   */
  async getBookingWithStatus(bookingId: string): Promise<any> {
    const result = await this.$queryRaw`
      SELECT 
        b.*,
        s.name as status,
        bs.created_at as status_changed_at
      FROM bookings b
      LEFT JOIN booking_status bs ON b.id = bs.booking_id
      LEFT JOIN statuses s ON bs.status_id = s.id
      WHERE b.id = ${bookingId}
      ORDER BY bs.created_at DESC
      LIMIT 1
    `;

    return (result as any[])[0] || null;
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: string,
    statusContext: string,
  ): Promise<void> {
    // First get the status ID from statuses table
    const statusResult = await this.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM statuses WHERE context = 'BOOKING' AND name = ${statusContext} LIMIT 1
    `;

    if (statusResult.length === 0) {
      throw new Error(`Status '${statusContext}' not found`);
    }

    const statusId = statusResult[0].id;

    await this.bookingStatus.create({
      data: {
        bookingId: bookingId,
        statusId: statusId,
      },
    });
  }

  /**
   * Get business with current status
   */
  async getBusinessWithStatus(businessId: string): Promise<any> {
    const result = await this.$queryRaw`
      SELECT 
        b.*,
        s.name as status,
        bs.created_at as status_changed_at
      FROM businesses b
      LEFT JOIN business_status bs ON b.id = bs.business_id
      LEFT JOIN statuses s ON bs.status_id = s.id
      WHERE b.id = ${businessId}
      ORDER BY bs.created_at DESC
      LIMIT 1
    `;

    return (result as any[])[0] || null;
  }

  /**
   * Update business status
   */
  async updateBusinessStatus(
    businessId: string,
    statusContext: string,
  ): Promise<void> {
    const statusResult = await this.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM statuses WHERE context = 'BUSINESS' AND name = ${statusContext} LIMIT 1
    `;

    if (statusResult.length === 0) {
      throw new Error(`Status '${statusContext}' not found`);
    }

    const statusId = statusResult[0].id;

    await this.businessStatus.create({
      data: {
        businessId: businessId,
        statusId: statusId,
      },
    });
  }

  /**
   * Get payment with status
   */
  async getPaymentWithStatus(paymentId: string): Promise<any> {
    const result = await this.$queryRaw`
      SELECT 
        p.*,
        pm.name as payment_method,
        s.name as status
      FROM payments p
      JOIN payment_methods pm ON p.payment_method_id = pm.id
      JOIN statuses s ON p.status_id = s.id
      WHERE p.id = ${paymentId}
    `;

    return (result as any[])[0] || null;
  }

  /**
   * Create a rejection reason record
   */
  async createRejectionReason(
    entityType: string,
    entityId: string,
    reasonText: string,
  ): Promise<void> {
    await this.rejectionReason.create({
      data: {
        entityType: entityType,
        entityId: entityId,
        reasonText: reasonText,
      },
    });
  }

  /**
   * Get all active statuses
   */
  async getStatuses(): Promise<Array<{ id: string; context: string; name: string }>> {
    return this.status.findMany({
      select: { id: true, context: true, name: true },
    });
  }

  /**
   * Get or create status by context and name
   */
  async getOrCreateStatus(context: string, name: string): Promise<{ id: string; context: string; name: string }> {
    let status = await this.status.findFirst({
      where: { context, name },
    });

    if (!status) {
      status = await this.status.create({
        data: { context, name },
      });
    }

    return status;
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(enabledOnly: boolean = true): Promise<Array<{ id: string; name: string; isEnabled: boolean }>> {
    return this.paymentMethod.findMany({
      where: enabledOnly ? { isEnabled: true } : {},
      select: { id: true, name: true, isEnabled: true },
    });
  }

  /**
   * Execute a transaction with retry logic
   */
  async withTransaction<T>(
    fn: (prisma: PrismaService) => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.$transaction(async (tx) => {
          // Create a proxy service that uses the transaction client
          const transactionalService = new Proxy(this, {
            get(target, prop) {
              if (prop in tx) {
                return (tx as any)[prop];
              }
              return (target as any)[prop];
            },
          });
          return fn(transactionalService as PrismaService);
        });
      } catch (error: any) {
        lastError = error;
        if (error?.message?.includes('deadlock') && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  /**
   * Check if database connection is healthy
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; latency: number }> {
    const start = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return { status: 'ok', latency };
    } catch (error) {
      return { status: 'error', latency: Date.now() - start };
    }
  }
}


// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient, Prisma } from '@prisma/client';
// import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

// @Injectable()
// export class PrismaService
//   extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor(private readonly logger: WinstonLoggerService) {
//     super({
//       log: [
//         { emit: 'event', level: 'query' },
//         { emit: 'event', level: 'error' },
//         { emit: 'event', level: 'warn' },
//       ],
//     });
//   }

//   async onModuleInit(): Promise<void> {
//     this.$on('query', (event:any) => {
//       if (event.duration > 200) {
//         this.logger.warn(
//           `Slow query detected (${event.duration}ms): ${event.query}`,
//           'PrismaService',
//         );
//       }
//     });

//     this.$on('error', (event:any) => {
//       this.logger.error(
//         `Database error: ${event.message}`,
//         event.target,
//         'PrismaService',
//       );
//     });

//     this.$on('warn', (event:any) => {
//       this.logger.warn(`Database warning: ${event.message}`, 'PrismaService');
//     });

//     await this.$connect();
//     this.logger.log('✅ Database connected', 'PrismaService');
//   }

//   async onModuleDestroy(): Promise<void> {
//     await this.$disconnect();
//     this.logger.log('Database disconnected', 'PrismaService');
//   }

//   async softDelete(model: 'user', id: string): Promise<void> {
//     await (this[model] as any).update({
//       where: { id },
//       data: { deletedAt: new Date() },
//     });
//   }

//   async cleanupExpiredRecords(): Promise<{
//     sessions: number;
//     carts: number;
//   }> {
//     const now = new Date();

//     const [sessions] = await this.$transaction([
//       this.userSession.deleteMany({
//         where: { expiresAt: { lt: now } },
//       }),
//       // this.cart.deleteMany({
//       //   where: { expiresAt: { lt: now } },
//       // }),
//     ]);

//     return {
//       sessions: sessions.count,
//       carts: 0,
//     };
//   }
// }
