// ─── User & Role Enums ───
export enum UserRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
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
  MANAGE_OWN_BUSINESS = 'manage:own:business',
  MANAGE_OWN_BOOKINGS = 'manage:own:bookings',
  MANAGE_DIAGNOSTICS = 'manage:diagnostics',
  CHAT_WITH_CLIENTS = 'chat:with:clients',
  SEND_BOOKING_NOTIFICATIONS = 'send:booking:notifications',

  // Admin
  MANAGE_USERS = 'manage:users',
  MANAGE_STAFF = 'manage:staff',
  VIEW_ALL_BOOKINGS = 'view:all:bookings',
  MANAGE_ALL_BOOKINGS = 'manage:all:bookings',
  PROCESS_REFUNDS = 'process:refunds',
  MANAGE_CONTENT = 'manage:content',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SYSTEM_SETTINGS = 'manage:system:settings',
  VIEW_AUDIT_LOGS = 'view:audit:logs',
  MANAGE_CAR_WASHES = 'manage:car:washes',
  MANAGE_PRODUCTS = 'manage:products',
  MANAGE_PROMOTIONS = 'manage:promotions',
  MANAGE_WARRANTIES = 'manage:warranties',
  SEND_BROADCASTS = 'send:broadcasts',
}

// ─── Booking Enums ───
export enum ServiceType {
  WASH = 'WASH',
  POLISH = 'POLISH',
  DETAILING = 'DETAILING',
  COMBO = 'COMBO',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  QUALITY_CHECK = 'QUALITY_CHECK',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum ServiceStage {
  PRE_WASH = 'PRE_WASH',
  WASH_IN_PROGRESS = 'WASH_IN_PROGRESS',
  DRYING = 'DRYING',
  INTERIOR_CLEANING = 'INTERIOR_CLEANING',
  POLISHING = 'POLISHING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
}

// ─── Payment Enums ───
export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

// ─── Loyalty Enums ───
export enum LoyaltyTransactionType {
  EARNED = 'EARNED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  BONUS = 'BONUS',
  REFERRAL = 'REFERRAL',
}

// ─── Subscription Enums ───
export enum SubscriptionPlan {
  BASIC_WASH = 'BASIC_WASH',
  PREMIUM = 'PREMIUM',
  ULTIMATE = 'ULTIMATE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
}

// ─── Warranty Enums ───
export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CLAIMED = 'CLAIMED',
}

export enum WarrantyClaimStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

// ─── Notification Enums ───
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  STATUS_UPDATE = 'STATUS_UPDATE',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  PROMOTION = 'PROMOTION',
  LOYALTY_UPDATE = 'LOYALTY_UPDATE',
  SUBSCRIPTION_RENEWAL = 'SUBSCRIPTION_RENEWAL',
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
  BROADCAST = 'BROADCAST',
}

// ─── Chat Enums ───
export enum ChatMessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

// ─── Referral Enums ───
export enum ReferralStatus {
  PENDING = 'PENDING',
  ACTIVATED = 'ACTIVATED',
  EXPIRED = 'EXPIRED',
}

// ─── Audit Enums ───
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  REFUND = 'REFUND',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

// ─── Security Enums ───
export enum SecurityEventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum SecurityEventType {
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_SETUP = 'MFA_SETUP',
  MFA_DISABLED = 'MFA_DISABLED',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
