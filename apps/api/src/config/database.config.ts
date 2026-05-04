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

// import { registerAs } from '@nestjs/config';
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export default registerAs(
//   'database',
//   (): TypeOrmModuleOptions => ({
//     type: 'postgres',
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT || '5432', 10),
//     database: process.env.DB_NAME || 'glowfix_dev',
//     username: process.env.DB_USER || 'glowfix',
//     password: process.env.DB_PASSWORD || 'glowfix_dev_password',
//     ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

//     // Entities & Migrations
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],

//     // Behavior
//     synchronize: false, // NEVER true in production
//     migrationsRun: false, // run manually
//     logging: process.env.DB_LOGGING === 'true' ? ['query', 'error'] : ['error'],
//     logger: 'advanced-console',

//     // Connection pool
//     extra: {
//       max: parseInt(process.env.DB_POOL_MAX || '20', 10),
//       min: parseInt(process.env.DB_POOL_MIN || '5', 10),
//       idleTimeoutMillis: 30000,
//       connectionTimeoutMillis: 2000,
//     },
//   }),
// );
