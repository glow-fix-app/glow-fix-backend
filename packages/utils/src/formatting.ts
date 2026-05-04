/**
 * Format amount from cents to display string
 */
export function formatCurrency(amountInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

/**
 * Format phone number to E.164
 */
export function formatPhoneE164(phone: string, countryCode = '1'): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith(countryCode)) {
    return `+${digits}`;
  }
  return `+${countryCode}${digits}`;
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const maskedLocal =
    local.length <= 2 ? '*'.repeat(local.length) : `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number for display
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format distance in meters to display string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Generate a URL-safe slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}