import { registerAs } from '@nestjs/config';

export interface PrismaConfig {
  databaseUrl: string;
  logQueries: boolean;
  connectionPool: {
    min: number;
    max: number;
    idleTimeoutMs: number;
  };
}

export default registerAs(
  'prisma',
  (): PrismaConfig => ({
    databaseUrl: process.env.DATABASE_URL || 'postgresql://glowfix:glowfix_dev_password@localhost:5432/glowfix_dev',
    logQueries: process.env.DB_LOGGING === 'true',
    connectionPool: {
      min: parseInt(process.env.DB_POOL_MIN || '5', 10),
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMs: 30000,
    },
  }),
);
