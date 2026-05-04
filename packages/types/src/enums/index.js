"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityEventType = exports.SecurityEventSeverity = exports.AuditAction = exports.ReferralStatus = exports.ChatMessageType = exports.NotificationType = exports.NotificationChannel = exports.WarrantyClaimStatus = exports.WarrantyStatus = exports.SubscriptionStatus = exports.SubscriptionPlan = exports.LoyaltyTransactionType = exports.PaymentStatus = exports.PaymentMethod = exports.ServiceStage = exports.BookingStatus = exports.ServiceType = exports.Permission = exports.AdminRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["STAFF"] = "STAFF";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["OPERATIONS_MANAGER"] = "OPERATIONS_MANAGER";
    AdminRole["CONTENT_MANAGER"] = "CONTENT_MANAGER";
    AdminRole["FINANCE_ADMIN"] = "FINANCE_ADMIN";
    AdminRole["SUPPORT_AGENT"] = "SUPPORT_AGENT";
    AdminRole["VIEWER"] = "VIEWER";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
var Permission;
(function (Permission) {
    Permission["MANAGE_OWN_VEHICLES"] = "manage:own:vehicles";
    Permission["CREATE_BOOKING"] = "create:booking";
    Permission["VIEW_OWN_BOOKINGS"] = "view:own:bookings";
    Permission["CANCEL_OWN_BOOKING"] = "cancel:own:booking";
    Permission["MANAGE_OWN_PROFILE"] = "manage:own:profile";
    Permission["VIEW_ASSIGNED_BOOKINGS"] = "view:assigned:bookings";
    Permission["UPDATE_BOOKING_STATUS"] = "update:booking:status";
    Permission["CREATE_DIVR"] = "create:divr";
    Permission["UPLOAD_PHOTOS"] = "upload:photos";
    Permission["MANAGE_OWN_AVAILABILITY"] = "manage:own:availability";
    Permission["MANAGE_USERS"] = "manage:users";
    Permission["MANAGE_STAFF"] = "manage:staff";
    Permission["VIEW_ALL_BOOKINGS"] = "view:all:bookings";
    Permission["MANAGE_ALL_BOOKINGS"] = "manage:all:bookings";
    Permission["PROCESS_REFUNDS"] = "process:refunds";
    Permission["MANAGE_CONTENT"] = "manage:content";
    Permission["VIEW_ANALYTICS"] = "view:analytics";
    Permission["MANAGE_SYSTEM_SETTINGS"] = "manage:system:settings";
    Permission["VIEW_AUDIT_LOGS"] = "view:audit:logs";
    Permission["MANAGE_CAR_WASHES"] = "manage:car:washes";
    Permission["MANAGE_PRODUCTS"] = "manage:products";
    Permission["MANAGE_PROMOTIONS"] = "manage:promotions";
    Permission["MANAGE_WARRANTIES"] = "manage:warranties";
    Permission["SEND_BROADCASTS"] = "send:broadcasts";
})(Permission || (exports.Permission = Permission = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["WASH"] = "WASH";
    ServiceType["POLISH"] = "POLISH";
    ServiceType["DETAILING"] = "DETAILING";
    ServiceType["COMBO"] = "COMBO";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["QUEUED"] = "QUEUED";
    BookingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BookingStatus["QUALITY_CHECK"] = "QUALITY_CHECK";
    BookingStatus["READY_FOR_PICKUP"] = "READY_FOR_PICKUP";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["NO_SHOW"] = "NO_SHOW";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var ServiceStage;
(function (ServiceStage) {
    ServiceStage["PRE_WASH"] = "PRE_WASH";
    ServiceStage["WASH_IN_PROGRESS"] = "WASH_IN_PROGRESS";
    ServiceStage["DRYING"] = "DRYING";
    ServiceStage["INTERIOR_CLEANING"] = "INTERIOR_CLEANING";
    ServiceStage["POLISHING"] = "POLISHING";
    ServiceStage["QUALITY_CHECK"] = "QUALITY_CHECK";
    ServiceStage["READY_FOR_PICKUP"] = "READY_FOR_PICKUP";
    ServiceStage["COMPLETED"] = "COMPLETED";
})(ServiceStage || (exports.ServiceStage = ServiceStage = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["STRIPE"] = "STRIPE";
    PaymentMethod["PAYPAL"] = "PAYPAL";
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["LOYALTY_POINTS"] = "LOYALTY_POINTS";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var LoyaltyTransactionType;
(function (LoyaltyTransactionType) {
    LoyaltyTransactionType["EARNED"] = "EARNED";
    LoyaltyTransactionType["REDEEMED"] = "REDEEMED";
    LoyaltyTransactionType["EXPIRED"] = "EXPIRED";
    LoyaltyTransactionType["BONUS"] = "BONUS";
    LoyaltyTransactionType["REFERRAL"] = "REFERRAL";
})(LoyaltyTransactionType || (exports.LoyaltyTransactionType = LoyaltyTransactionType = {}));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC_WASH"] = "BASIC_WASH";
    SubscriptionPlan["PREMIUM"] = "PREMIUM";
    SubscriptionPlan["ULTIMATE"] = "ULTIMATE";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["PAUSED"] = "PAUSED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var WarrantyStatus;
(function (WarrantyStatus) {
    WarrantyStatus["ACTIVE"] = "ACTIVE";
    WarrantyStatus["EXPIRED"] = "EXPIRED";
    WarrantyStatus["CLAIMED"] = "CLAIMED";
})(WarrantyStatus || (exports.WarrantyStatus = WarrantyStatus = {}));
var WarrantyClaimStatus;
(function (WarrantyClaimStatus) {
    WarrantyClaimStatus["PENDING"] = "PENDING";
    WarrantyClaimStatus["APPROVED"] = "APPROVED";
    WarrantyClaimStatus["REJECTED"] = "REJECTED";
    WarrantyClaimStatus["COMPLETED"] = "COMPLETED";
})(WarrantyClaimStatus || (exports.WarrantyClaimStatus = WarrantyClaimStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["IN_APP"] = "IN_APP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_CONFIRMATION"] = "BOOKING_CONFIRMATION";
    NotificationType["BOOKING_REMINDER"] = "BOOKING_REMINDER";
    NotificationType["STATUS_UPDATE"] = "STATUS_UPDATE";
    NotificationType["PAYMENT_RECEIPT"] = "PAYMENT_RECEIPT";
    NotificationType["PROMOTION"] = "PROMOTION";
    NotificationType["LOYALTY_UPDATE"] = "LOYALTY_UPDATE";
    NotificationType["SUBSCRIPTION_RENEWAL"] = "SUBSCRIPTION_RENEWAL";
    NotificationType["SUBSCRIPTION_FAILED"] = "SUBSCRIPTION_FAILED";
    NotificationType["REVIEW_REQUEST"] = "REVIEW_REQUEST";
    NotificationType["WELCOME"] = "WELCOME";
    NotificationType["PASSWORD_RESET"] = "PASSWORD_RESET";
    NotificationType["BROADCAST"] = "BROADCAST";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ChatMessageType;
(function (ChatMessageType) {
    ChatMessageType["TEXT"] = "TEXT";
    ChatMessageType["IMAGE"] = "IMAGE";
    ChatMessageType["VIDEO"] = "VIDEO";
    ChatMessageType["FILE"] = "FILE";
    ChatMessageType["SYSTEM"] = "SYSTEM";
})(ChatMessageType || (exports.ChatMessageType = ChatMessageType = {}));
var ReferralStatus;
(function (ReferralStatus) {
    ReferralStatus["PENDING"] = "PENDING";
    ReferralStatus["ACTIVATED"] = "ACTIVATED";
    ReferralStatus["EXPIRED"] = "EXPIRED";
})(ReferralStatus || (exports.ReferralStatus = ReferralStatus = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["REFUND"] = "REFUND";
    AuditAction["STATUS_CHANGE"] = "STATUS_CHANGE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var SecurityEventSeverity;
(function (SecurityEventSeverity) {
    SecurityEventSeverity["LOW"] = "LOW";
    SecurityEventSeverity["MEDIUM"] = "MEDIUM";
    SecurityEventSeverity["HIGH"] = "HIGH";
    SecurityEventSeverity["CRITICAL"] = "CRITICAL";
})(SecurityEventSeverity || (exports.SecurityEventSeverity = SecurityEventSeverity = {}));
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["FAILED_LOGIN"] = "FAILED_LOGIN";
    SecurityEventType["PASSWORD_RESET"] = "PASSWORD_RESET";
    SecurityEventType["MFA_SETUP"] = "MFA_SETUP";
    SecurityEventType["MFA_DISABLED"] = "MFA_DISABLED";
    SecurityEventType["PERMISSION_CHANGE"] = "PERMISSION_CHANGE";
    SecurityEventType["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    SecurityEventType["SUSPICIOUS_ACTIVITY"] = "SUSPICIOUS_ACTIVITY";
    SecurityEventType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
//# sourceMappingURL=index.js.map