"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatPhoneE164 = formatPhoneE164;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
exports.formatDuration = formatDuration;
exports.formatDistance = formatDistance;
exports.generateSlug = generateSlug;
function formatCurrency(amountInCents, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amountInCents / 100);
}
function formatPhoneE164(phone, countryCode = '1') {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith(countryCode)) {
        return `+${digits}`;
    }
    return `+${countryCode}${digits}`;
}
function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (!local || !domain)
        return email;
    const maskedLocal = local.length <= 2 ? '*'.repeat(local.length) : `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;
    return `${maskedLocal}@${domain}`;
}
function maskPhone(phone) {
    if (phone.length < 4)
        return phone;
    return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
}
function formatDuration(minutes) {
    if (minutes < 60)
        return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0)
        return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
}
function formatDistance(meters) {
    if (meters < 1000)
        return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
}
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
//# sourceMappingURL=formatting.js.map