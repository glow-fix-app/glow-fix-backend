import { z } from 'zod';

export const validationSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),  // Use coerce for string to number conversion
  APP_URL: z.string().url().min(1, "APP_URL is required"),
  FRONTEND_URL: z.string().url().min(1, "FRONTEND_URL is required"),
  DASHBOARD_URL: z.string().url().min(1, "DASHBOARD_URL is required"),
  ALLOWED_ORIGINS: z.string().min(1, 'ALLOWED_ORIGINS is required'),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32, "ENCRYPTION_KEY must be exactly 32 characters"),

  // S3
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  S3_BUCKET_NAME: z.string().default('glowfix-images'),
  S3_USE_PATH_STYLE: z.enum(['true', 'false']).default('false'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET is required"),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().min(1, "TWILIO_ACCOUNT_SID is required"),
  TWILIO_AUTH_TOKEN: z.string().min(1, "TWILIO_AUTH_TOKEN is required"),
  TWILIO_PHONE_NUMBER: z.string().min(1, "TWILIO_PHONE_NUMBER is required"),

  // Mail
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  MAIL_FROM: z.string().email().default('noreply@glowfix.local'),

  // Google
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1, "GOOGLE_OAUTH_CLIENT_ID is required"),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1, "GOOGLE_OAUTH_CLIENT_SECRET is required"),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "GOOGLE_MAPS_API_KEY is required"),

  // Monitoring
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('debug'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),
});

// //import * as zod from 'zod';
// import { zod } from 'zod';
// export const validationSchema = zod.object({
//   // Application
//   NODE_ENV: zod.string()
//     .valid('development', 'staging', 'production', 'test')
//     .default('development'),
//   PORT: zod.number().default(3000),
//   APP_URL: zod.string().uri().required(),
//   FRONTEND_URL: zod.string().uri().required(),
//   DASHBOARD_URL: zod.string().uri().required(),
//   CORS_ORIGINS: zod.string().required(),

//   // Database
//   DATABASE_URL: zod.string().required(),

//   // Redis
//   REDIS_HOST: zod.string().default('localhost'),
//   REDIS_PORT: zod.number().default(6379),
//   REDIS_PASSWORD: zod.string().allow('').optional(),

//   // JWT
//   JWT_ACCESS_SECRET: zod.string().min(32).required(),
//   JWT_REFRESH_SECRET: zod.string().min(32).required(),
//   JWT_ACCESS_EXPIRY: zod.string().default('15m'),
//   JWT_REFRESH_EXPIRY: zod.string().default('7d'),

//   // Encryption
//   ENCRYPTION_KEY: zod.string().length(32).required(),

//   // S3
//   S3_ENDPOINT: zod.string().optional(),
//   S3_REGION: zod.string().default('us-east-1'),
//   S3_ACCESS_KEY: zod.string().required(),
//   S3_SECRET_KEY: zod.string().required(),
//   S3_BUCKET_NAME: zod.string().default('glowfix-images'),
//   S3_USE_PATH_STYLE: zod.string().valid('true', 'false').default('false'),

//   // Stripe
//   STRIPE_SECRET_KEY: zod.string().required(),
//   STRIPE_WEBHOOK_SECRET: zod.string().required(),

//   // Twilio
//   TWILIO_ACCOUNT_SID: zod.string().required(),
//   TWILIO_AUTH_TOKEN: zod.string().required(),
//   TWILIO_PHONE_NUMBER: zod.string().required(),

//   // Mail
//   SMTP_HOST: zod.string().default('localhost'),
//   SMTP_PORT: zod.number().default(1025),
//   MAIL_FROM: zod.string().email().default('noreply@glowfix.local'),

//   // Google
//   GOOGLE_OAUTH_CLIENT_ID: zod.string().required(),
//   GOOGLE_OAUTH_CLIENT_SECRET: zod.string().required(),
//   GOOGLE_MAPS_API_KEY: zod.string().required(),

//   // Monitoring
//   LOG_LEVEL: zod.string()
//     .valid('error', 'warn', 'info', 'debug', 'verbose')
//     .default('debug'),
//   LOG_FORMAT: zod.string().valid('pretty', 'json').default('pretty'),
// });
