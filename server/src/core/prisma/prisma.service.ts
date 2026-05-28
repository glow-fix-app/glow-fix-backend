import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: WinstonLoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.$on('query', (event:any) => {
      if (event.duration > 200) {
        this.logger.warn(
          `Slow query detected (${event.duration}ms): ${event.query}`,
          'PrismaService',
        );
      }
    });

    this.$on('error', (event:any) => {
      this.logger.error(
        `Database error: ${event.message}`,
        event.target,
        'PrismaService',
      );
    });

    this.$on('warn', (event:any) => {
      this.logger.warn(`Database warning: ${event.message}`, 'PrismaService');
    });

    await this.$connect();
    this.logger.log('✅ Database connected', 'PrismaService');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected', 'PrismaService');
  }

  async softDelete(model: 'user', id: string): Promise<void> {
    await (this[model] as any).update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async cleanupExpiredRecords(): Promise<{
    sessions: number;
    carts: number;
  }> {
    const now = new Date();

    const [sessions] = await this.$transaction([
      this.userSession.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
      // this.cart.deleteMany({
      //   where: { expiresAt: { lt: now } },
      // }),
    ]);

    return {
      sessions: sessions.count,
      carts: 0,
    };
  }
}
