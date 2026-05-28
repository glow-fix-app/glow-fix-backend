import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {
     // Initialize with default config (will be overridden in onModuleInit if needed)
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries', '', 'RedisService');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      enableReadyCheck: true,
      lazyConnect: false,
    });

    // Set up event listeners
    this.client.on('connect', () => {
      this.logger.log('✅ Redis connected', 'RedisService');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`, error.stack, 'RedisService');
    });
  }

  async onModuleInit(): Promise<void> {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries', '', 'RedisService');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      enableReadyCheck: true,
      lazyConnect: false,
    });

    this.client.on('connect', () => {
      this.logger.log('✅ Redis connected', 'RedisService');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`, error.stack, 'RedisService');
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis disconnected', 'RedisService');
  }

  getClient(): Redis {
    return this.client;
  }

  // ─── Basic Operations ───

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string | string[]): Promise<number> {
    return this.client.del(...(Array.isArray(key) ? key : [key]));
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ─── JSON Operations ───

  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.set(key, serialized, ttlSeconds);
  }

  // ─── Counter Operations ───

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async incrBy(key: string, amount: number): Promise<number> {
    return this.client.incrby(key, amount);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  // ─── Hash Operations ───

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  // ─── Set Operations ───

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  // ─── Sorted Set Operations (for queue positions) ───

  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.client.zadd(key, score, member);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    return this.client.zrank(key, member);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    return this.client.zrem(key, ...members);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zrange(key, start, stop);
  }

  async zcard(key: string): Promise<number> {
    return this.client.zcard(key);
  }

  // ─── Pub/Sub (for real-time updates) ───

  async publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  createSubscriber(): Redis {
    return this.client.duplicate();
  }

  // ─── Pattern-Based Operations ───

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async scan(pattern: string, count = 100): Promise<string[]> {
    const results: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        count,
      );
      cursor = nextCursor;
      results.push(...keys);
    } while (cursor !== '0');

    return results;
  }

  async deleteByPattern(pattern: string): Promise<number> {
    const keys = await this.scan(pattern);
    if (keys.length === 0) return 0;
    return this.client.del(...keys);
  }

  // ─── Rate Limiting ───

  async checkRateLimit(
    key: string,
    maxAttempts: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const current = await this.incr(key);

    if (current === 1) {
      await this.expire(key, windowSeconds);
    }

    const ttl = await this.ttl(key);
    const remaining = Math.max(0, maxAttempts - current);

    return {
      allowed: current <= maxAttempts,
      remaining,
      resetAt: Date.now() + ttl * 1000,
    };
  }

  // ─── Distributed Lock ───

  async acquireLock(
    lockKey: string,
    ttlSeconds: number,
    retryCount = 3,
    retryDelayMs = 200,
  ): Promise<string | null> {
    const lockValue = `lock:${Date.now()}:${Math.random().toString(36).slice(2)}`;

    for (let i = 0; i < retryCount; i++) {
      const result = await this.client.set(lockKey, lockValue, 'EX', ttlSeconds, 'NX');
      if (result === 'OK') {
        return lockValue;
      }
      if (i < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    return null;
  }

  async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
    // Atomic: only delete if value matches (prevents deleting someone else's lock)
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.client.eval(script, 1, lockKey, lockValue);
    return result === 1;
  }

  // ─── Cache Helpers ───

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.getJson<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.setJson(key, value, ttlSeconds);
    return value;
  }

  async invalidateCache(patterns: string[]): Promise<void> {
    for (const pattern of patterns) {
      await this.deleteByPattern(pattern);
    }
  }

  // ─── Health Check ───

  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  async getInfo(): Promise<{
    usedMemory: string;
    connectedClients: string;
    uptimeInSeconds: string;
  }> {
    const info = await this.client.info('memory');
    const serverInfo = await this.client.info('server');
    const clientInfo = await this.client.info('clients');

    const parseField = (text: string, field: string): string => {
      const match = text.match(new RegExp(`${field}:(.+)`));
      return match ? match[1].trim() : 'unknown';
    };

    return {
      usedMemory: parseField(info, 'used_memory_human'),
      connectedClients: parseField(clientInfo, 'connected_clients'),
      uptimeInSeconds: parseField(serverInfo, 'uptime_in_seconds'),
    };
  }
}
// import { ConfigService } from '@nestjs/config';
// import type Redis from 'ioredis';
// import { REDIS_CLIENT } from '../../constants/redis.constants';
// //import type { Redis as RedisClient } from 'ioredis';

// @Injectable()
// export class RedisService {
//   constructor(
//     @Inject(REDIS_CLIENT) private readonly redis: Redis,
//     //@Inject(REDIS_CLIENT) private readonly redis: RedisClient,
//     private readonly configService: ConfigService,
//   ) {}

//   // ─── Basic Operations ───

//   async get(key: string): Promise<string | null> {
//     return this.redis.get(key);
//   }

//   async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
//     if (ttlSeconds) {
//       await this.redis.setex(key, ttlSeconds, value);
//     } else {
//       await this.redis.set(key, value);
//     }
//   }

//   async del(key: string): Promise<void> {
//     await this.redis.del(key);
//   }

//   async exists(key: string): Promise<boolean> {
//     const result = await this.redis.exists(key);
//     return result === 1;
//   }

//   async ttl(key: string): Promise<number> {
//     return this.redis.ttl(key);
//   }

//   async expire(key: string, seconds: number): Promise<void> {
//     await this.redis.expire(key, seconds);
//   }

//   // ─── JSON Helpers ───

//   async getJson<T>(key: string): Promise<T | null> {
//     const value = await this.redis.get(key);
//     if (!value) return null;
//     try {
//       return JSON.parse(value) as T;
//     } catch {
//       return null;
//     }
//   }

//   async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
//     await this.set(key, JSON.stringify(value), ttlSeconds);
//   }

//   // ─── Distributed Lock ───

//   async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
//     const lockKey = `lock:${key}`;
//     const result = await this.redis.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
//     return result === 'OK';
//   }

//   async releaseLock(key: string): Promise<void> {
//     await this.redis.del(`lock:${key}`);
//   }

//   // ─── Token Blacklisting ───

//   async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
//     const prefix = this.configService.get<string>(
//       'redis.keyPrefixes.tokenBlacklist',
//     );
//     await this.redis.setex(`${prefix}${jti}`, ttlSeconds, '1');
//   }

//   async isTokenBlacklisted(jti: string): Promise<boolean> {
//     const prefix = this.configService.get<string>(
//       'redis.keyPrefixes.tokenBlacklist',
//     );
//     return this.exists(`${prefix}${jti}`);
//   }

//   // ─── OTP Storage ───

//   async storeOtp(
//     identifier: string,
//     code: string,
//     ttlSeconds: number,
//   ): Promise<void> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     await this.redis.setex(`${prefix}${identifier}`, ttlSeconds, code);
//   }

//   async getOtp(identifier: string): Promise<string | null> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     return this.redis.get(`${prefix}${identifier}`);
//   }

//   async deleteOtp(identifier: string): Promise<void> {
//     const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
//     await this.redis.del(`${prefix}${identifier}`);
//   }

//   // ─── Rate Limiting Helpers ───

//   async incrementCounter(key: string, ttlSeconds: number): Promise<number> {
//     const multi = this.redis.multi();
//     multi.incr(key);
//     multi.expire(key, ttlSeconds);
//     const results = await multi.exec();
//     return (results?.[0]?.[1] as number) || 0;
//   }

//   // ─── Health Check ───

//   async ping(): Promise<boolean> {
//     try {
//       const result = await this.redis.ping();
//       return result === 'PONG';
//     } catch {
//       return false;
//     }
//   }
// }
