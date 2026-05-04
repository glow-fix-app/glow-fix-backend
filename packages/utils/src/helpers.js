"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.generateReferralCode = generateReferralCode;
exports.calculateLoyaltyPoints = calculateLoyaltyPoints;
exports.loyaltyPointsToDollars = loyaltyPointsToDollars;
exports.isOffPeakHour = isOffPeakHour;
exports.calculateEstimatedWaitTime = calculateEstimatedWaitTime;
exports.retryWithBackoff = retryWithBackoff;
exports.sleep = sleep;
exports.generateSecureToken = generateSecureToken;
exports.chunkArray = chunkArray;
exports.pick = pick;
exports.omit = omit;
exports.deepClone = deepClone;
exports.isEmpty = isEmpty;
exports.keyBy = keyBy;
exports.normalizeLicensePlate = normalizeLicensePlate;
const constants_1 = require("./constants");
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}
function generateReferralCode(prefix = 'GF') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${prefix}-${code}`;
}
function calculateLoyaltyPoints(amountInCents, isOffPeak = false) {
    const dollars = amountInCents / 100;
    const basePoints = Math.floor(dollars * constants_1.LOYALTY.POINTS_PER_DOLLAR);
    return isOffPeak ? basePoints * constants_1.LOYALTY.OFF_PEAK_MULTIPLIER : basePoints;
}
function loyaltyPointsToDollars(points) {
    return points / constants_1.LOYALTY.POINTS_PER_REDEMPTION_DOLLAR;
}
function isOffPeakHour(date = new Date()) {
    const hour = date.getHours();
    return hour >= constants_1.LOYALTY.OFF_PEAK_START_HOUR && hour < constants_1.LOYALTY.OFF_PEAK_END_HOUR;
}
function calculateEstimatedWaitTime(queuePosition, avgServiceTimeMinutes, availableStaff, efficiencyFactor = 1.0) {
    if (availableStaff <= 0)
        return -1;
    const servicesAhead = Math.ceil(queuePosition / availableStaff);
    return Math.round(servicesAhead * avgServiceTimeMinutes * efficiencyFactor);
}
async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 3, initialDelayMs = 1000, maxDelayMs = 30000, factor = 2 } = options;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateSecureToken(bytes = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let token = '';
    for (let i = 0; i < bytes; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
function keyBy(array, keySelector) {
    return array.reduce((map, item) => {
        map[keySelector(item)] = item;
        return map;
    }, {});
}
function normalizeLicensePlate(plate) {
    return plate.replace(/[\s-]/g, '').toUpperCase();
}
//# sourceMappingURL=helpers.js.map