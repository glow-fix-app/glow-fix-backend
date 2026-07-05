// ─── Identity & Auth ───
export enum UserRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export enum OtpPurpose {
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  TWO_FACTOR = 'TWO_FACTOR',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  VIEWER = 'VIEWER',
}

export enum Permission {
  // Client
  MANAGE_OWN_VEHICLES = 'manage:own:vehicles',
  CREATE_BOOKING = 'create:booking',
  VIEW_OWN_BOOKINGS = 'view:own:bookings',
  CANCEL_OWN_BOOKING = 'cancel:own:booking',
  MANAGE_OWN_PROFILE = 'manage:own:profile',

  // Manager
  MANAGE_BUSINESS = 'manage:business',
  VIEW_BUSINESS_ANALYTICS = 'view:business:analytics',
  VIEW_ASSIGNED_BOOKINGS = 'view:assigned:bookings',
  UPDATE_BOOKING_STATUS = 'update:booking:status',

  // Admin
  MANAGE_USERS = 'manage:users',
  VIEW_ALL_BOOKINGS = 'view:all:bookings',
  MANAGE_ALL_BOOKINGS = 'manage:all:bookings',
  PROCESS_REFUNDS = 'process:refunds',
  MANAGE_CONTENT = 'manage:content',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SYSTEM_SETTINGS = 'manage:system:settings',
  VIEW_AUDIT_LOGS = 'view:audit:logs',
  SEND_BROADCASTS = 'send:broadcasts',
}

// ─── Booking & Diagnostics ───
export enum BookingItemType {
  CATALOG_SERVICE = 'CATALOG_SERVICE',
  REPAIR_ITEM = 'REPAIR_ITEM',
}

export enum FindingPriority {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

// ─── Communication & Chat ───
export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export enum ConversationType {
  BOOKING = 'BOOKING',
  SUPPORT = 'SUPPORT',
  GENERAL = 'GENERAL',
}

export enum ParticipantRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

// ─── Audit & Logs ───
export enum LogEntityType {
  USER = 'USER',
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  PAYOUT = 'PAYOUT',
  REVIEW = 'REVIEW',
  DIAGNOSTIC_REPORT = 'DIAGNOSTIC_REPORT',
  SERVICE = 'SERVICE',
  BUSINESS = 'BUSINESS',
  BUSINESS_DOCUMENT = 'BUSINESS_DOCUMENT',
}

export enum LogAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

// ─── Loyalty ───
export enum LoyaltyTransactionType {
  EARNED = 'EARNED',
  REDEEMED = 'REDEEMED',
}