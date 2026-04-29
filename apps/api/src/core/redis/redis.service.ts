import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../../constants/redis.constants';
//import type { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    //@Inject(REDIS_CLIENT) private readonly redis: RedisClient,
    private readonly configService: ConfigService,
  ) {}

  // ─── Basic Operations ───

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  // ─── JSON Helpers ───

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  // ─── Distributed Lock ───

  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const result = await this.redis.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async releaseLock(key: string): Promise<void> {
    await this.redis.del(`lock:${key}`);
  }

  // ─── Token Blacklisting ───

  async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
    const prefix = this.configService.get<string>(
      'redis.keyPrefixes.tokenBlacklist',
    );
    await this.redis.setex(`${prefix}${jti}`, ttlSeconds, '1');
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    const prefix = this.configService.get<string>(
      'redis.keyPrefixes.tokenBlacklist',
    );
    return this.exists(`${prefix}${jti}`);
  }

  // ─── OTP Storage ───

  async storeOtp(
    identifier: string,
    code: string,
    ttlSeconds: number,
  ): Promise<void> {
    const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
    await this.redis.setex(`${prefix}${identifier}`, ttlSeconds, code);
  }

  async getOtp(identifier: string): Promise<string | null> {
    const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
    return this.redis.get(`${prefix}${identifier}`);
  }

  async deleteOtp(identifier: string): Promise<void> {
    const prefix = this.configService.get<string>('redis.keyPrefixes.otp');
    await this.redis.del(`${prefix}${identifier}`);
  }

  // ─── Rate Limiting Helpers ───

  async incrementCounter(key: string, ttlSeconds: number): Promise<number> {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.expire(key, ttlSeconds);
    const results = await multi.exec();
    return (results?.[0]?.[1] as number) || 0;
  }

  // ─── Health Check ───

  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
