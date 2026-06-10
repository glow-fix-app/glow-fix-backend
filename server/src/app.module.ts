import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';

// Core modules
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './core/health/health.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Guards
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Middleware
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import mailConfig from './config/mail.config';
import storageConfig from './config/storage.config';
import { ClientsModule } from './modules/clients/clients.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ServicesModule } from './modules/services/services.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BusinessesModule } from './modules/businesses/businesses.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, mailConfig, storageConfig],
      cache: true,
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('throttle.ttl') || 60000,
            limit: config.get<number>('throttle.limit') || 100,
          },
        ],
      }),
    }),

    // Event Emitter (global)
    EventEmitterModule.forRoot(),

    // Core
    LoggerModule,
    PrismaModule,
    RedisModule,
    HealthModule,

    // Features
    AuthModule,
    UsersModule,
    ClientsModule,
    VehiclesModule,
    CategoriesModule,
    ServicesModule,
    ReviewsModule,
    LoyaltyModule,
    NotificationsModule,
    BusinessesModule,
  ],
  providers: [
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
