import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

// Configs
import { appConfig, databaseConfig, redisConfig, jwtConfig } from './config';

// Modules
import { RedisModule } from './modules/redis/redis.module';
import { HealthModule } from './modules/health/health.module';

// Future modules (add as you build them)
// import { AuthModule } from './modules/auth/auth.module';
// import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    // ─── Configuration (must be first) ───
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
      expandVariables: true,
    }),
    // ─── Database ───
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    // ─── Rate Limiting ───
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        {
          name: 'default',
          ttl: parseInt(configService.get('THROTTLE_TTL') || '60000', 10),
          limit: parseInt(configService.get('THROTTLE_LIMIT') || '100', 10),
        },
      ],
      inject: [ConfigService],
    }),
    // ─── Background Jobs ───
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
          db: 1, // use db 1 for queues, db 0 for cache
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }),
      inject: [ConfigService],
    }),
    // ─── Cron Jobs ───
    ScheduleModule.forRoot(),

    // ─── Application Modules ───
    RedisModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
