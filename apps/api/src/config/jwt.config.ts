import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret:
    process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-prod',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-prod',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  issuer: 'glow-fix-api',
  audience: 'glow-fix-client',
}));
