"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGINATION = exports.REVIEW = exports.SEARCH = exports.FILE_UPLOAD = exports.RATE_LIMITS = exports.SESSION = exports.JWT = exports.PASSWORD = exports.OTP = exports.VEHICLE = exports.BOOKING = exports.SUBSCRIPTION_PLANS = exports.LOYALTY = void 0;
exports.LOYALTY = {
    POINTS_PER_DOLLAR: 10,
    POINTS_PER_REDEMPTION_DOLLAR: 20,
    REVIEW_BONUS_POINTS: 50,
    OFF_PEAK_MULTIPLIER: 2,
    OFF_PEAK_START_HOUR: 14,
    OFF_PEAK_END_HOUR: 17,
    EXPIRY_MONTHS: 6,
    REFERRAL_REFERRER_POINTS: 500,
    REFERRAL_REFEREE_POINTS: 300,
};
exports.SUBSCRIPTION_PLANS = {
    BASIC_WASH: {
        name: 'Basic Wash',
        priceInCents: 2999,
        washesPerMonth: 2,
        productDiscount: 10,
        priorityQueue: false,
        freePickupDropoff: false,
    },
    PREMIUM: {
        name: 'Premium',
        priceInCents: 4999,
        washesPerMonth: 4,
        productDiscount: 15,
        priorityQueue: true,
        freePickupDropoff: false,
    },
    ULTIMATE: {
        name: 'Ultimate',
        priceInCents: 7999,
        washesPerMonth: Infinity,
        productDiscount: 20,
        priorityQueue: true,
        freePickupDropoff: true,
    },
};
exports.BOOKING = {
    CANCELLATION_DEADLINE_HOURS: 2,
    NO_SHOW_GRACE_PERIOD_MINUTES: 30,
    MAX_ADDONS_PER_BOOKING: 10,
    MAX_QUEUE_POSITION: 50,
};
exports.VEHICLE = {
    MAX_PER_CUSTOMER: 5,
    MIN_YEAR: 1900,
};
exports.OTP = {
    LENGTH: 6,
    VALIDITY_MINUTES: 10,
    MAX_ATTEMPTS: 5,
    LOCKOUT_MINUTES: 30,
    RESEND_COOLDOWN_SECONDS: 30,
    MAX_RESEND_ATTEMPTS: 3,
};
exports.PASSWORD = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    BCRYPT_COST_FACTOR: 12,
    RESET_TOKEN_BYTES: 32,
    RESET_TOKEN_EXPIRY_HOURS: 1,
    MAX_RESET_REQUESTS_PER_HOUR: 3,
    HISTORY_COUNT: 5,
    ADMIN_EXPIRY_DAYS: 90,
};
exports.JWT = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    REFRESH_TOKEN_EXPIRY_SECONDS: 7 * 24 * 60 * 60,
};
exports.SESSION = {
    MAX_CONCURRENT_DEVICES: 5,
    INACTIVITY_TIMEOUT_MINUTES: 30,
    REMEMBER_ME_DAYS: 30,
};
exports.RATE_LIMITS = {
    AUTH: { max: 5, windowMinutes: 15 },
    PUBLIC_API: { max: 100, windowMinutes: 1 },
    AUTHENTICATED_API: { max: 1000, windowMinutes: 1 },
    ADMIN_API: { max: 5000, windowMinutes: 1 },
    PAYMENT: { max: 10, windowMinutes: 1 },
    FILE_UPLOAD: { max: 20, windowMinutes: 60 },
};
exports.FILE_UPLOAD = {
    MAX_IMAGE_SIZE_MB: 10,
    MAX_IMAGES_PER_INSPECTION: 10,
    MAX_IMAGES_PER_REVIEW: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    COMPRESSION_QUALITY: 80,
};
exports.SEARCH = {
    DEFAULT_RADIUS_KM: 10,
    MAX_RADIUS_KM: 50,
    MAX_RECENT_SEARCHES: 10,
    MIN_RATING_FILTER: 1,
    MAX_RATING_FILTER: 5,
};
exports.REVIEW = {
    MIN_COMMENT_LENGTH: 10,
    MAX_COMMENT_LENGTH: 1000,
    EDIT_WINDOW_HOURS: 24,
    MAX_PHOTOS: 5,
};
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
//# sourceMappingURL=constants.js.map