export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:5174',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3001').split(',').filter(Boolean),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    tls: process.env.REDIS_TLS || 'false',
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
    endpoint: process.env.STORAGE_ENDPOINT || process.env.S3_ENDPOINT,
    region: process.env.STORAGE_REGION || process.env.S3_REGION || 'us-east-1',
    accessKey: process.env.STORAGE_KEY_ID || process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.STORAGE_KEY_SECRET || process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.STORAGE_BUCKET || process.env.S3_BUCKET_NAME,
    usePathStyle: process.env.STORAGE_USE_PATH_STYLE === 'true' || process.env.S3_USE_PATH_STYLE === 'true' || true,
    cdnBase: process.env.STORAGE_CDN_BASE,
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
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || 'noreply@glowfix.com',
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
  auth: {
    loginMaxAttempts: parseInt(process.env.AUTH_LOGIN_MAX_ATTEMPTS || '5', 10),
    loginLockoutSeconds: parseInt(process.env.AUTH_LOGIN_LOCKOUT_SECONDS || '900', 10),
    otpCooldownSeconds: parseInt(process.env.AUTH_OTP_COOLDOWN_SECONDS || '60', 10),
    mfaWindow: parseInt(process.env.AUTH_MFA_WINDOW || '1', 10),
    mfaTokenExpirySeconds: parseInt(process.env.AUTH_MFA_TOKEN_EXPIRY || '300', 10),
  },
});
