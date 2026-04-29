import * as zod from 'zod';

export const validationSchema = zod.object({
  // Application
  NODE_ENV: zod.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: zod.number().default(3000),
  APP_URL: zod.string().uri().required(),
  FRONTEND_URL: zod.string().uri().required(),
  DASHBOARD_URL: zod.string().uri().required(),
  CORS_ORIGINS: zod.string().required(),

  // Database
  DATABASE_URL: zod.string().required(),

  // Redis
  REDIS_HOST: zod.string().default('localhost'),
  REDIS_PORT: zod.number().default(6379),
  REDIS_PASSWORD: zod.string().allow('').optional(),

  // JWT
  JWT_ACCESS_SECRET: zod.string().min(32).required(),
  JWT_REFRESH_SECRET: zod.string().min(32).required(),
  JWT_ACCESS_EXPIRY: zod.string().default('15m'),
  JWT_REFRESH_EXPIRY: zod.string().default('7d'),

  // Encryption
  ENCRYPTION_KEY: zod.string().length(32).required(),

  // S3
  S3_ENDPOINT: zod.string().optional(),
  S3_REGION: zod.string().default('us-east-1'),
  S3_ACCESS_KEY: zod.string().required(),
  S3_SECRET_KEY: zod.string().required(),
  S3_BUCKET_NAME: zod.string().default('glowfix-images'),
  S3_USE_PATH_STYLE: zod.string().valid('true', 'false').default('false'),

  // Stripe
  STRIPE_SECRET_KEY: zod.string().required(),
  STRIPE_WEBHOOK_SECRET: zod.string().required(),

  // Twilio
  TWILIO_ACCOUNT_SID: zod.string().required(),
  TWILIO_AUTH_TOKEN: zod.string().required(),
  TWILIO_PHONE_NUMBER: zod.string().required(),

  // Mail
  SMTP_HOST: zod.string().default('localhost'),
  SMTP_PORT: zod.number().default(1025),
  MAIL_FROM: zod.string().email().default('noreply@glowfix.local'),

  // Google
  GOOGLE_OAUTH_CLIENT_ID: zod.string().required(),
  GOOGLE_OAUTH_CLIENT_SECRET: zod.string().required(),
  GOOGLE_MAPS_API_KEY: zod.string().required(),

  // Monitoring
  LOG_LEVEL: zod.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('debug'),
  LOG_FORMAT: zod.string().valid('pretty', 'json').default('pretty'),
});
