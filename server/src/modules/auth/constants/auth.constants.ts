import { UserRole, Permission } from '@glow-fix/types';
import { RolePermissionsMap } from '../interfaces/auth.interface';

// ─── Rate limiting ────────────────────────────────────────────────────────────

export const AUTH_CONSTANTS = {
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_ATTEMPTS_WINDOW: 15 * 60, // 15 minutes in seconds
  MFA_TOKEN_EXPIRY: 300, // 5 minutes in seconds
  DEVICE_FINGERPRINT_LENGTH: 16,
  COOKIE_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  COOKIE_PATH: '/api/v1/auth',
} as const;

// ─── Cookie config factory ────────────────────────────────────────────────────

export function getRefreshTokenCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: AUTH_CONSTANTS.COOKIE_PATH,
    maxAge: AUTH_CONSTANTS.COOKIE_MAX_AGE_MS,
  };
}

export function getClearCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    path: AUTH_CONSTANTS.COOKIE_PATH,
  };
}

// ─── Role permissions map ─────────────────────────────────────────────────────

export const ROLE_PERMISSIONS: RolePermissionsMap = {
  [UserRole.CLIENT]: [
    Permission.MANAGE_OWN_VEHICLES,
    Permission.CREATE_BOOKING,
    Permission.VIEW_OWN_BOOKINGS,
    Permission.CANCEL_OWN_BOOKING,
    Permission.MANAGE_OWN_PROFILE,
  ],
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_ALL_BOOKINGS,
    Permission.MANAGE_ALL_BOOKINGS,
    Permission.PROCESS_REFUNDS,
    Permission.MANAGE_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SYSTEM_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.SEND_BROADCASTS,
  ],
  [UserRole.MANAGER]: [
    Permission.MANAGE_BUSINESS,
    Permission.VIEW_BUSINESS_ANALYTICS,
    Permission.VIEW_ASSIGNED_BOOKINGS,
    Permission.UPDATE_BOOKING_STATUS,
  ],
};
