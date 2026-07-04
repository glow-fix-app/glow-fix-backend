// ─── OTP ───
export const OTP = {
  LENGTH: 6,
  VALIDITY_MINUTES: 10,
  MAX_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 30,
  RESEND_COOLDOWN_SECONDS: 30,
  MAX_RESEND_ATTEMPTS: 3,
} as const;

// ─── Password ───
export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  BCRYPT_COST_FACTOR: 12,
  RESET_TOKEN_BYTES: 32,
  RESET_TOKEN_EXPIRY_HOURS: 1,
  MAX_RESET_REQUESTS_PER_HOUR: 3,
  HISTORY_COUNT: 5,
  ADMIN_EXPIRY_DAYS: 90,
} as const;

// ─── Session ───
export const SESSION = {
  MAX_CONCURRENT_DEVICES: 5,
  INACTIVITY_TIMEOUT_MINUTES: 30,
  REMEMBER_ME_DAYS: 30,
} as const;

// ─── Pagination ───
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;