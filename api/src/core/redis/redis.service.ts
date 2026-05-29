import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

type MemoryRecord = { value: string; expiresAt?: number };
type SortedSetEntry = { score: number; member: string };

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private available = false;
  private initialized = false;

  private readonly values = new Map<string, MemoryRecord>();
  private readonly hashes = new Map<string, Map<string, string>>();
  private readonly sets = new Map<string, Set<string>>();
  private readonly zsets = new Map<string, SortedSetEntry[]>();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeClient();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
    }

    this.client = null;
    this.available = false;
    this.clearMemory();
  }

  getClient(): Redis | null {
    return this.client;
  }

  isAvailable(): boolean {
    return this.available;
  }

  async get(key: string): Promise<string | null> {
    const clientResult = await this.runClient((client) => client.get(key));
    if (clientResult !== undefined) return clientResult;
    return this.getValue(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const clientResult = await this.runClient((client) => ttlSeconds ? client.setex(key, ttlSeconds, value) : client.set(key, value));
    if (clientResult !== undefined) {
      return;
    }
    this.setValue(key, value, ttlSeconds);
  }

  async del(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];
    const clientResult = await this.runClient((client) => client.del(...keys));
    if (clientResult !== undefined) return clientResult;

    let deleted = 0;
    for (const item of keys) {
      if (this.values.delete(item)) deleted++;
      if (this.hashes.delete(item)) deleted++;
      if (this.sets.delete(item)) deleted++;
      if (this.zsets.delete(item)) deleted++;
    }
    return deleted;
  }

  async exists(key: string): Promise<boolean> {
    const clientResult = await this.runClient((client) => client.exists(key));
    if (clientResult !== undefined) return clientResult === 1;
    return this.getValue(key) !== null;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const clientResult = await this.runClient((client) => client.expire(key, ttlSeconds));
    if (clientResult !== undefined) return;
    const entry = this.values.get(key);
    if (entry) entry.expiresAt = Date.now() + ttlSeconds * 1000;
  }

  async ttl(key: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.ttl(key));
    if (clientResult !== undefined) return clientResult;
    const entry = this.values.get(key);
    if (!entry) return -2;
    if (!entry.expiresAt) return -1;
    const ttlMs = entry.expiresAt - Date.now();
    if (ttlMs <= 0) {
      this.values.delete(key);
      return -2;
    }
    return Math.ceil(ttlMs / 1000);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
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

  async incr(key: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.incr(key));
    if (clientResult !== undefined) return clientResult;
    return this.adjustNumber(key, 1);
  }

  async incrBy(key: string, amount: number): Promise<number> {
    const clientResult = await this.runClient((client) => client.incrby(key, amount));
    if (clientResult !== undefined) return clientResult;
    return this.adjustNumber(key, amount);
  }

  async decr(key: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.decr(key));
    if (clientResult !== undefined) return clientResult;
    return this.adjustNumber(key, -1);
  }

  async hget(key: string, field: string): Promise<string | null> {
    const clientResult = await this.runClient((client) => client.hget(key, field));
    if (clientResult !== undefined) return clientResult;
    return this.hashes.get(key)?.get(field) ?? null;
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    const clientResult = await this.runClient((client) => client.hset(key, field, value));
    if (clientResult !== undefined) return;
    const current = this.hashes.get(key) ?? new Map<string, string>();
    current.set(field, value);
    this.hashes.set(key, current);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const clientResult = await this.runClient((client) => client.hgetall(key));
    if (clientResult !== undefined) return clientResult;
    return Object.fromEntries(this.hashes.get(key) ?? new Map<string, string>());
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const clientResult = await this.runClient((client) => client.hdel(key, ...fields));
    if (clientResult !== undefined) return clientResult;
    const current = this.hashes.get(key);
    if (!current) return 0;
    let removed = 0;
    for (const field of fields) {
      if (current.delete(field)) removed++;
    }
    if (current.size === 0) this.hashes.delete(key);
    return removed;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    const clientResult = await this.runClient((client) => client.sadd(key, ...members));
    if (clientResult !== undefined) return clientResult;
    const current = this.sets.get(key) ?? new Set<string>();
    let added = 0;
    for (const member of members) {
      if (!current.has(member)) {
        current.add(member);
        added++;
      }
    }
    this.sets.set(key, current);
    return added;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const clientResult = await this.runClient((client) => client.srem(key, ...members));
    if (clientResult !== undefined) return clientResult;
    const current = this.sets.get(key);
    if (!current) return 0;
    let removed = 0;
    for (const member of members) {
      if (current.delete(member)) removed++;
    }
    return removed;
  }

  async smembers(key: string): Promise<string[]> {
    const clientResult = await this.runClient((client) => client.smembers(key));
    if (clientResult !== undefined) return clientResult;
    return Array.from(this.sets.get(key) ?? []);
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const clientResult = await this.runClient((client) => client.sismember(key, member));
    if (clientResult !== undefined) return clientResult === 1;
    return this.sets.get(key)?.has(member) ?? false;
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.zadd(key, score, member));
    if (clientResult !== undefined) return clientResult;
    const current = this.sortedSet(key).filter((entry) => entry.member !== member);
    current.push({ score, member });
    this.zsets.set(key, current);
    return 1;
  }

  async zrank(key: string, member: string): Promise<number | null> {
    const clientResult = await this.runClient((client) => client.zrank(key, member));
    if (clientResult !== undefined) return clientResult;
    const index = this.sortedSet(key).findIndex((entry) => entry.member === member);
    return index >= 0 ? index : null;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const clientResult = await this.runClient((client) => client.zrem(key, ...members));
    if (clientResult !== undefined) return clientResult;
    const current = this.sortedSet(key);
    const next = current.filter((entry) => !members.includes(entry.member));
    this.zsets.set(key, next);
    return current.length - next.length;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const clientResult = await this.runClient((client) => client.zrange(key, start, stop));
    if (clientResult !== undefined) return clientResult;
    const entries = this.sortedSet(key);
    const normalizedStop = stop < 0 ? entries.length + stop : stop;
    return entries.slice(start, normalizedStop + 1).map((entry) => entry.member);
  }

  async zcard(key: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.zcard(key));
    if (clientResult !== undefined) return clientResult;
    return this.sortedSet(key).length;
  }

  async publish(channel: string, message: string): Promise<number> {
    const clientResult = await this.runClient((client) => client.publish(channel, message));
    return clientResult ?? 0;
  }

  createSubscriber(): Redis | null {
    return this.client ? this.client.duplicate() : null;
  }

  async keys(pattern: string): Promise<string[]> {
    const clientResult = await this.runClient((client) => client.keys(pattern));
    if (clientResult !== undefined) return clientResult;
    return this.matchKeys(pattern);
  }

  async scan(pattern: string, count = 100): Promise<string[]> {
    const clientResult = await this.runClient(async (client) => {
      const results: string[] = [];
      let cursor = '0';
      do {
        const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', count);
        cursor = nextCursor;
        results.push(...keys);
      } while (cursor !== '0');
      return results;
    });
    if (clientResult !== undefined) return clientResult;
    return this.matchKeys(pattern).slice(0, count);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    const keys = await this.scan(pattern);
    return this.del(keys);
  }

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
    return {
      allowed: current <= maxAttempts,
      remaining: Math.max(0, maxAttempts - current),
      resetAt: Date.now() + ttl * 1000,
    };
  }

  async acquireLock(
    lockKey: string,
    ttlSeconds: number,
    retryCount = 3,
    retryDelayMs = 200,
  ): Promise<string | null> {
    const lockValue = `lock:${Date.now()}:${Math.random().toString(36).slice(2)}`;

    if (!this.client) {
      if (this.getValue(lockKey) !== null) return null;
      this.setValue(lockKey, lockValue, ttlSeconds);
      return lockValue;
    }

    for (let i = 0; i < retryCount; i++) {
      const result = await this.client.set(lockKey, lockValue, 'EX', ttlSeconds, 'NX');
      if (result === 'OK') return lockValue;
      if (i < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }

    return null;
  }

  async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
    if (!this.client) {
      const current = this.getValue(lockKey);
      if (current !== lockValue) return false;
      this.values.delete(lockKey);
      return true;
    }

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

  async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      return (await this.client.ping()) === 'PONG';
    } catch {
      return false;
    }
  }

  async getInfo(): Promise<{
    usedMemory: string;
    connectedClients: string;
    uptimeInSeconds: string;
  }> {
    if (!this.client) {
      return {
        usedMemory: 'unknown',
        connectedClients: 'unknown',
        uptimeInSeconds: 'unknown',
      };
    }

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

  private async initializeClient(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const enabled = this.configService.get<boolean>('redis.enabled') !== false;
    if (!enabled) {
      this.logger.warn('Redis disabled; using in-memory fallback', 'RedisService');
      this.available = false;
      return;
    }

    const client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
      db: this.configService.get<number>('redis.db'),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      retryStrategy: (times: number) => (times > 3 ? null : Math.min(times * 200, 2000)),
    });

    client.on('error', (error) => {
      this.logger.warn(`Redis error: ${error.message}`, 'RedisService');
    });

    try {
      await client.connect();
      this.client = client;
      this.available = true;
      this.logger.log('Redis connected', 'RedisService');
    } catch (error) {
      client.disconnect();
      this.client = null;
      this.available = false;

      if (this.configService.get<string>('app.nodeEnv') === 'production') {
        throw error;
      }

      this.logger.warn('Redis unavailable; using in-memory fallback', 'RedisService');
    }
  }

  private async runClient<T>(
    fn: (client: Redis) => Promise<T>,
  ): Promise<T | undefined> {
    if (!this.client) return undefined;
    try {
      return await fn(this.client);
    } catch (error) {
      this.logger.warn(`Redis operation failed: ${(error as Error).message}`, 'RedisService');
      this.client = null;
      this.available = false;
      if (this.configService.get<string>('app.nodeEnv') === 'production') {
        throw error;
      }
      return undefined;
    }
  }

  private getValue(key: string): string | null {
    const entry = this.values.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }
    return entry.value;
  }

  private setValue(key: string, value: string, ttlSeconds?: number): void {
    this.values.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  private adjustNumber(key: string, amount: number): number {
    const current = Number.parseInt(this.getValue(key) ?? '0', 10) || 0;
    const next = current + amount;
    const ttl = this.ttlValue(key);
    this.setValue(key, String(next), ttl > 0 ? ttl : undefined);
    return next;
  }

  private ttlValue(key: string): number {
    const entry = this.values.get(key);
    if (!entry) return -2;
    if (!entry.expiresAt) return -1;
    const ttlMs = entry.expiresAt - Date.now();
    return ttlMs > 0 ? Math.ceil(ttlMs / 1000) : -2;
  }

  private sortedSet(key: string): SortedSetEntry[] {
    return [...(this.zsets.get(key) ?? [])].sort((a, b) => a.score - b.score);
  }

  private matchKeys(pattern: string): string[] {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
    const regex = new RegExp(`^${escaped}$`);
    return [
      ...this.values.keys(),
      ...this.hashes.keys(),
      ...this.sets.keys(),
      ...this.zsets.keys(),
    ].filter((key, index, array) => array.indexOf(key) === index && regex.test(key));
  }

  private clearMemory(): void {
    this.values.clear();
    this.hashes.clear();
    this.sets.clear();
    this.zsets.clear();
  }
}
