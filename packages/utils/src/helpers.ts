import { LOYALTY } from './constants';

/**
 * Generate a random OTP
 */
export function generateOtp(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Generate a referral code
 */
export function generateReferralCode(prefix = 'GF'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0,O,1,I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${code}`;
}

/**
 * Calculate loyalty points earned for a given amount
 */
export function calculateLoyaltyPoints(amountInCents: number, isOffPeak = false): number {
  const dollars = amountInCents / 100;
  const basePoints = Math.floor(dollars * LOYALTY.POINTS_PER_DOLLAR);
  return isOffPeak ? basePoints * LOYALTY.OFF_PEAK_MULTIPLIER : basePoints;
}

/**
 * Calculate dollar value of loyalty points
 */
export function loyaltyPointsToDollars(points: number): number {
  return points / LOYALTY.POINTS_PER_REDEMPTION_DOLLAR;
}

/**
 * Check if current time is in off-peak hours
 */
export function isOffPeakHour(date: Date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= LOYALTY.OFF_PEAK_START_HOUR && hour < LOYALTY.OFF_PEAK_END_HOUR;
}

/**
 * Calculate estimated wait time in minutes
 */
export function calculateEstimatedWaitTime(
  queuePosition: number,
  avgServiceTimeMinutes: number,
  availableStaff: number,
  efficiencyFactor = 1.0,
): number {
  if (availableStaff <= 0) return -1;
  const servicesAhead = Math.ceil(queuePosition / availableStaff);
  return Math.round(servicesAhead * avgServiceTimeMinutes * efficiencyFactor);
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    factor?: number;
  } = {},
): Promise<T> {
  const { maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 30000, factor = 2 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelayMs * Math.pow(factor, attempt), maxDelayMs);
        const jitter = delay * 0.1 * Math.random();
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError;
}

/**
 * Sleep for given milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a URL-safe random token
 */
export function generateSecureToken(bytes = 32): string {
  // In Node.js environment, use crypto
  // This is a shared util — actual crypto usage happens in the API
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let token = '';
  for (let i = 0; i < bytes; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

/**
 * Chunk an array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
      }
  return chunks;
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Create a map from an array using a key selector
 */
export function keyBy<T>(array: T[], keySelector: (item: T) => string): Record<string, T> {
  return array.reduce(
    (map, item) => {
      map[keySelector(item)] = item;
      return map;
    },
    {} as Record<string, T>,
  );
}

/**
 * Normalize a license plate (uppercase, remove spaces/dashes)
 */
export function normalizeLicensePlate(plate: string): string {
  return plate.replace(/[\s-]/g, '').toUpperCase();
}