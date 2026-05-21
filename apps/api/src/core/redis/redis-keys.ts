/**
 * Centralized Redis key naming convention
 * Pattern: {domain}:{entity}:{identifier}:{sub-key}
 */
export const RedisKeys = {
  // ─── Sessions ───
  session: (userId: string, sessionId: string) =>
    `session:${userId}:${sessionId}`,
  userSessions: (userId: string) =>
    `session:${userId}:*`,
  userLogoutTimestamp: (userId: string) =>
     `user:logout-timestamp:${userId}`,

  // ─── OTP ───
  otp: (identifier: string, purpose: string) =>
    `otp:${purpose}:${identifier}`,
  otpAttempts: (identifier: string, purpose: string) =>
    `otp:attempts:${purpose}:${identifier}`,
  otpResendCount: (identifier: string) =>
    `otp:resend:${identifier}`,

  // ─── Rate Limiting ───
  rateLimit: (type: string, identifier: string) =>
    `rate-limit:${type}:${identifier}`,
  loginAttempts: (identifier: string) =>
    `rate-limit:login:${identifier}`,

  // ─── Token Blacklist ───
  tokenBlacklist: (jti: string) =>
    `token:blacklist:${jti}`,

  // ─── Queue ───
  queuePosition: (carWashId: string) =>
    `queue:position:${carWashId}`,
  queueEstimate: (carWashId: string) =>
    `queue:estimate:${carWashId}`,

  // ─── Cache ───
  carWashDetails: (carWashId: string) =>
    `cache:car-wash:${carWashId}`,
  carWashServices: (carWashId: string) =>
    `cache:car-wash:services:${carWashId}`,
  nearbyCarWashes: (lat: number, lng: number, radius: number) =>
    `cache:nearby:${lat.toFixed(3)}:${lng.toFixed(3)}:${radius}`,
  timeSlots: (carWashId: string, date: string) =>
    `cache:slots:${carWashId}:${date}`,
  systemConfig: (key: string) =>
    `cache:config:${key}`,
  customerLoyalty: (customerId: string) =>
    `cache:loyalty:${customerId}`,
  dashboardMetrics: () =>
    `cache:dashboard:metrics`,

  // ─── Real-time ───
  activeBooking: (bookingId: string) =>
    `realtime:booking:${bookingId}`,
  typingIndicator: (conversationId: string, userId: string) =>
    `chat:typing:${conversationId}:${userId}`,
  onlineUsers: () =>
    `realtime:online-users`,

  // ─── Locks ───
  bookingLock: (carWashId: string, slotTime: string) =>
    `lock:booking:${carWashId}:${slotTime}`,
  paymentLock: (bookingId: string) =>
    `lock:payment:${bookingId}`,
  loyaltyLock: (customerId: string) =>
    `lock:loyalty:${customerId}`,

  // ─── Idempotency ───
  idempotency: (key: string) =>
    `idempotency:${key}`,
} as const;