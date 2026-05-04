export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:5174',
    corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'us-east-1',
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET_NAME || 'glowfix-images',
    usePathStyle: process.env.S3_USE_PATH_STYLE === 'true',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE || 'sandbox',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  },
  mail: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'noreply@glowfix.local',
  },
  google: {
    oauthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    oauthCallbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true',
    prometheusPort: parseInt(process.env.PROMETHEUS_PORT || '9090', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'pretty',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },
});
