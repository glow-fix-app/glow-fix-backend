"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidPhone = isValidPhone;
exports.validatePasswordStrength = validatePasswordStrength;
exports.isValidLicensePlate = isValidLicensePlate;
exports.isValidVehicleYear = isValidVehicleYear;
exports.isValidOtp = isValidOtp;
exports.isValidUuid = isValidUuid;
exports.isValidCoordinates = isValidCoordinates;
exports.sanitizeString = sanitizeString;
const constants_1 = require("./constants");
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
function isValidPhone(phone) {
    const regex = /^\+?[1-9]\d{6,14}$/;
    return regex.test(phone.replace(/[\s()-]/g, ''));
}
function validatePasswordStrength(password) {
    const errors = [];
    if (password.length < constants_1.PASSWORD.MIN_LENGTH) {
        errors.push(`Password must be at least ${constants_1.PASSWORD.MIN_LENGTH} characters`);
    }
    if (password.length > constants_1.PASSWORD.MAX_LENGTH) {
        errors.push(`Password must be less than ${constants_1.PASSWORD.MAX_LENGTH} characters`);
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
function isValidLicensePlate(plate) {
    const cleaned = plate.replace(/[\s-]/g, '').toUpperCase();
    return cleaned.length >= 2 && cleaned.length <= 10 && /^[A-Z0-9]+$/.test(cleaned);
}
function isValidVehicleYear(year) {
    const currentYear = new Date().getFullYear();
    return year >= constants_1.VEHICLE.MIN_YEAR && year <= currentYear + 1;
}
function isValidOtp(otp) {
    return new RegExp(`^\\d{${constants_1.OTP.LENGTH}}$`).test(otp);
}
function isValidUuid(id) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
}
function isValidCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
function sanitizeString(input) {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}
//# sourceMappingURL=validation.js.map