"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisKeys = void 0;
/**
 * Centralized Redis key naming convention
 * Pattern: {domain}:{entity}:{identifier}:{sub-key}
 */
exports.RedisKeys = {
    // ─── Sessions ───
    session: function (userId, sessionId) {
        return "session:".concat(userId, ":").concat(sessionId);
    },
    userSessions: function (userId) {
        return "session:".concat(userId, ":*");
    },
    userLogoutTimestamp: function (userId) {
        return "user:logout-timestamp:".concat(userId);
    },
    // ─── OTP ───
    otp: function (identifier, purpose) {
        return "otp:".concat(purpose, ":").concat(identifier);
    },
    otpAttempts: function (identifier, purpose) {
        return "otp:attempts:".concat(purpose, ":").concat(identifier);
    },
    otpResendCount: function (identifier) {
        return "otp:resend:".concat(identifier);
    },
    // ─── Rate Limiting ───
    rateLimit: function (type, identifier) {
        return "rate-limit:".concat(type, ":").concat(identifier);
    },
    loginAttempts: function (identifier) {
        return "rate-limit:login:".concat(identifier);
    },
    // ─── Token Blacklist ───
    tokenBlacklist: function (jti) {
        return "token:blacklist:".concat(jti);
    },
    // ─── Queue ───
    queuePosition: function (carWashId) {
        return "queue:position:".concat(carWashId);
    },
    queueEstimate: function (carWashId) {
        return "queue:estimate:".concat(carWashId);
    },
    // ─── Cache ───
    carWashDetails: function (carWashId) {
        return "cache:car-wash:".concat(carWashId);
    },
    carWashServices: function (carWashId) {
        return "cache:car-wash:services:".concat(carWashId);
    },
    nearbyCarWashes: function (lat, lng, radius) {
        return "cache:nearby:".concat(lat.toFixed(3), ":").concat(lng.toFixed(3), ":").concat(radius);
    },
    timeSlots: function (carWashId, date) {
        return "cache:slots:".concat(carWashId, ":").concat(date);
    },
    systemConfig: function (key) {
        return "cache:config:".concat(key);
    },
    customerLoyalty: function (customerId) {
        return "cache:loyalty:".concat(customerId);
    },
    dashboardMetrics: function () {
        return "cache:dashboard:metrics";
    },
    // ─── Real-time ───
    activeBooking: function (bookingId) {
        return "realtime:booking:".concat(bookingId);
    },
    typingIndicator: function (conversationId, userId) {
        return "chat:typing:".concat(conversationId, ":").concat(userId);
    },
    onlineUsers: function () {
        return "realtime:online-users";
    },
    // ─── Locks ───
    bookingLock: function (carWashId, slotTime) {
        return "lock:booking:".concat(carWashId, ":").concat(slotTime);
    },
    paymentLock: function (bookingId) {
        return "lock:payment:".concat(bookingId);
    },
    loyaltyLock: function (customerId) {
        return "lock:loyalty:".concat(customerId);
    },
    // ─── Idempotency ───
    idempotency: function (key) {
        return "idempotency:".concat(key);
    },
};
