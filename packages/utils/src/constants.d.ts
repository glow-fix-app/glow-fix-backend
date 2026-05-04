export declare const LOYALTY: {
    readonly POINTS_PER_DOLLAR: 10;
    readonly POINTS_PER_REDEMPTION_DOLLAR: 20;
    readonly REVIEW_BONUS_POINTS: 50;
    readonly OFF_PEAK_MULTIPLIER: 2;
    readonly OFF_PEAK_START_HOUR: 14;
    readonly OFF_PEAK_END_HOUR: 17;
    readonly EXPIRY_MONTHS: 6;
    readonly REFERRAL_REFERRER_POINTS: 500;
    readonly REFERRAL_REFEREE_POINTS: 300;
};
export declare const SUBSCRIPTION_PLANS: {
    readonly BASIC_WASH: {
        readonly name: "Basic Wash";
        readonly priceInCents: 2999;
        readonly washesPerMonth: 2;
        readonly productDiscount: 10;
        readonly priorityQueue: false;
        readonly freePickupDropoff: false;
    };
    readonly PREMIUM: {
        readonly name: "Premium";
        readonly priceInCents: 4999;
        readonly washesPerMonth: 4;
        readonly productDiscount: 15;
        readonly priorityQueue: true;
        readonly freePickupDropoff: false;
    };
    readonly ULTIMATE: {
        readonly name: "Ultimate";
        readonly priceInCents: 7999;
        readonly washesPerMonth: number;
        readonly productDiscount: 20;
        readonly priorityQueue: true;
        readonly freePickupDropoff: true;
    };
};
export declare const BOOKING: {
    readonly CANCELLATION_DEADLINE_HOURS: 2;
    readonly NO_SHOW_GRACE_PERIOD_MINUTES: 30;
    readonly MAX_ADDONS_PER_BOOKING: 10;
    readonly MAX_QUEUE_POSITION: 50;
};
export declare const VEHICLE: {
    readonly MAX_PER_CUSTOMER: 5;
    readonly MIN_YEAR: 1900;
};
export declare const OTP: {
    readonly LENGTH: 6;
    readonly VALIDITY_MINUTES: 10;
    readonly MAX_ATTEMPTS: 5;
    readonly LOCKOUT_MINUTES: 30;
    readonly RESEND_COOLDOWN_SECONDS: 30;
    readonly MAX_RESEND_ATTEMPTS: 3;
};
export declare const PASSWORD: {
    readonly MIN_LENGTH: 8;
    readonly MAX_LENGTH: 128;
    readonly BCRYPT_COST_FACTOR: 12;
    readonly RESET_TOKEN_BYTES: 32;
    readonly RESET_TOKEN_EXPIRY_HOURS: 1;
    readonly MAX_RESET_REQUESTS_PER_HOUR: 3;
    readonly HISTORY_COUNT: 5;
    readonly ADMIN_EXPIRY_DAYS: 90;
};
export declare const JWT: {
    readonly ACCESS_TOKEN_EXPIRY: "15m";
    readonly REFRESH_TOKEN_EXPIRY: "7d";
    readonly REFRESH_TOKEN_EXPIRY_SECONDS: number;
};
export declare const SESSION: {
    readonly MAX_CONCURRENT_DEVICES: 5;
    readonly INACTIVITY_TIMEOUT_MINUTES: 30;
    readonly REMEMBER_ME_DAYS: 30;
};
export declare const RATE_LIMITS: {
    readonly AUTH: {
        readonly max: 5;
        readonly windowMinutes: 15;
    };
    readonly PUBLIC_API: {
        readonly max: 100;
        readonly windowMinutes: 1;
    };
    readonly AUTHENTICATED_API: {
        readonly max: 1000;
        readonly windowMinutes: 1;
    };
    readonly ADMIN_API: {
        readonly max: 5000;
        readonly windowMinutes: 1;
    };
    readonly PAYMENT: {
        readonly max: 10;
        readonly windowMinutes: 1;
    };
    readonly FILE_UPLOAD: {
        readonly max: 20;
        readonly windowMinutes: 60;
    };
};
export declare const FILE_UPLOAD: {
    readonly MAX_IMAGE_SIZE_MB: 10;
    readonly MAX_IMAGES_PER_INSPECTION: 10;
    readonly MAX_IMAGES_PER_REVIEW: 5;
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly COMPRESSION_QUALITY: 80;
};
export declare const SEARCH: {
    readonly DEFAULT_RADIUS_KM: 10;
    readonly MAX_RADIUS_KM: 50;
    readonly MAX_RECENT_SEARCHES: 10;
    readonly MIN_RATING_FILTER: 1;
    readonly MAX_RATING_FILTER: 5;
};
export declare const REVIEW: {
    readonly MIN_COMMENT_LENGTH: 10;
    readonly MAX_COMMENT_LENGTH: 1000;
    readonly EDIT_WINDOW_HOURS: 24;
    readonly MAX_PHOTOS: 5;
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
