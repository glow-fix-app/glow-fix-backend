import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async checkReadiness(): Promise<Record<string, string>> {
    const checks: Record<string, string> = {};

    // Database
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    // Redis
    try {
      const isHealthy = await this.redis.ping();
      checks.redis = isHealthy ? 'ok' : 'error';
    } catch {
      checks.redis = 'error';
    }

    return checks;
  }

  async getDetailedHealth(): Promise<Record<string, unknown>> {
    const startTime = process.hrtime();

    // Database check with timing
    let dbStatus = 'ok';
    let dbResponseTime = 0;
    let dbConnections = { active: 0, max: 0 };
    try {
      const dbStart = process.hrtime();
      await this.prisma.$queryRaw`SELECT 1`;
      const dbEnd = process.hrtime(dbStart);
      dbResponseTime = Math.round(dbEnd[0] * 1000 + dbEnd[1] / 1e6);

      const poolInfo = await this.prisma.$queryRaw<
        { active: number; max: number }[]
      >`SELECT 
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active')::int as active,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max`;
      if (poolInfo[0]) {
        dbConnections = { active: poolInfo[0].active, max: poolInfo[0].max };
      }
    } catch {
      dbStatus = 'error';
    }

    // Redis check with timing
    let redisStatus = 'ok';
    let redisResponseTime = 0;
    let redisInfo = { usedMemory: 'unknown', connectedClients: 'unknown', uptimeInSeconds: 'unknown' };
    try {
      const redisStart = process.hrtime();
      await this.redis.ping();
      const redisEnd = process.hrtime(redisStart);
      redisResponseTime = Math.round(redisEnd[0] * 1000 + redisEnd[1] / 1e6);
      redisInfo = await this.redis.getInfo();
    } catch {
      redisStatus = 'error';
    }

    const totalTime = process.hrtime(startTime);
    const uptime = process.uptime();

    return {
      status: dbStatus === 'ok' && redisStatus === 'ok' ? 'healthy' : 'degraded',
      version: '2.0.0',
      uptime: Math.round(uptime),
      nodeVersion: process.version,
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
      checks: {
        database: {
          status: dbStatus,
          responseTime: dbResponseTime,
          connections: dbConnections,
        },
        redis: {
          status: redisStatus,
          responseTime: redisResponseTime,
          memory: redisInfo.usedMemory,
          clients: redisInfo.connectedClients,
          uptime: redisInfo.uptimeInSeconds,
        },
      },
      responseTime: Math.round(totalTime[0] * 1000 + totalTime[1] / 1e6),
      timestamp: new Date().toISOString(),
    };
  }
}