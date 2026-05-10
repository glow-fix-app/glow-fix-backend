import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';

// Core modules
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './core/health/health.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

// Middleware
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { UsersModule } from './modules/users/users.module';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, mailConfig],
      cache: true,
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: (config.get<number>('throttle.ttl') || 60) * 1000,
          limit: config.get<number>('throttle.limit') || 100,
        },
      ],
    }),

    // Core
    LoggerModule,
    PrismaModule,
    RedisModule,
    HealthModule,

    // Features
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
