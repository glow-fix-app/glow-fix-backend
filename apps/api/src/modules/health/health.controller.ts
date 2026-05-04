import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get('live')
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  async readiness() {
    const [dbOk, redisOk] = await Promise.all([
      this.checkDatabase(),
      this.redisService.ping(),
    ]);

    const status = dbOk && redisOk ? 'ready' : 'not_ready';

    return {
      status,
      checks: {
        database: dbOk ? 'ok' : 'error',
        redis: redisOk ? 'ok' : 'error',
      },
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      // Prisma raw query to check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

// import { Controller, Get } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { RedisService } from '../../core/redis/redis.service';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Health')
// @Controller('health')
// export class HealthController {
//   constructor(
//     @InjectDataSource() private readonly dataSource: DataSource,
//     private readonly redisService: RedisService,
//   ) {}

//   @Get('live')
//   liveness() {
//     return {
//       status: 'ok',
//       timestamp: new Date().toISOString(),
//     };
//   }

//   @Get('ready')
//   async readiness() {
//     const [dbOk, redisOk] = await Promise.all([
//       this.checkDatabase(),
//       this.redisService.ping(),
//     ]);

//     const status = dbOk && redisOk ? 'ready' : 'not_ready';
//     //const statusCode = dbOk && redisOk ? 200 : 503;

//     return {
//       status,
//       checks: {
//         database: dbOk ? 'ok' : 'error',
//         redis: redisOk ? 'ok' : 'error',
//       },
//       timestamp: new Date().toISOString(),
//     };
//   }

//   private async checkDatabase(): Promise<boolean> {
//     try {
//       await this.dataSource.query('SELECT 1');
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }
