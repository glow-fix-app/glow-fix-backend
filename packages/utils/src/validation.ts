import { PASSWORD, OTP, VEHICLE } from './constants';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * Validate phone number (E.164 or common formats)
 */
export function isValidPhone(phone: string): boolean {
  const regex = /^\+?[1-9]\d{6,14}$/;
  return regex.test(phone.replace(/[\s()-]/g, ''));
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD.MIN_LENGTH} characters`);
  }
  if (password.length > PASSWORD.MAX_LENGTH) {
    errors.push(`Password must be less than ${PASSWORD.MAX_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate license plate format
 */
export function isValidLicensePlate(plate: string): boolean {
  const cleaned = plate.replace(/[\s-]/g, '').toUpperCase();
  return cleaned.length >= 2 && cleaned.length <= 10 && /^[A-Z0-9]+$/.test(cleaned);
}

/**
 * Validate vehicle year
 */
export function isValidVehicleYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= VEHICLE.MIN_YEAR && year <= currentYear + 1;
}

/**
 * Validate OTP format
 */
export function isValidOtp(otp: string): boolean {
  return new RegExp(`^\\d{${OTP.LENGTH}}$`).test(otp);
}

/**
 * Validate UUID v4
 */
export function isValidUuid(id: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(id);
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}