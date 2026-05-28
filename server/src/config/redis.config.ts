import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'glowfix_redis_password',
  db: parseInt(process.env.REDIS_DB || '0', 10),
  url:
    process.env.REDIS_URL || 'redis://:glowfix_redis_password@localhost:6379/0',
  ttl: {
    session: 60 * 60 * 24 * 7, // 7 days (seconds)
    otp: 60 * 10, // 10 minutes
    cache: 60 * 5, // 5 minutes
    rateLimit: 60 * 15, // 15 minutes
    availabilitySlots: 60 * 2, // 2 minutes
  },
  keyPrefixes: {
    session: 'session:',
    otp: 'otp:',
    rateLimit: 'rate-limit:',
    tokenBlacklist: 'token-blacklist:',
    slotLock: 'slot-lock:',
    queue: 'queue:',
    cache: 'cache:',
  },
}));
