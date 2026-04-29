import {
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  isValidLicensePlate,
  isValidVehicleYear,
  isValidOtp,
  isValidUuid,
  isValidCoordinates,
  sanitizeString,
} from '../validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should accept valid phone numbers', () => {
      expect(isValidPhone('+12025551234')).toBe(true);
      expect(isValidPhone('12025551234')).toBe(true);
      expect(isValidPhone('+442071234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept strong passwords', () => {
      const result = validatePasswordStrength('MyStr0ng!Pass');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require uppercase letter', () => {
      const result = validatePasswordStrength('nouppercas3!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require special character', () => {
      const result = validatePasswordStrength('NoSpecial1Char');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('isValidLicensePlate', () => {
    it('should accept valid plates', () => {
      expect(isValidLicensePlate('ABC1234')).toBe(true);
      expect(isValidLicensePlate('AB-12-CD')).toBe(true);
      expect(isValidLicensePlate('XY 999 ZZ')).toBe(true);
    });

    it('should reject invalid plates', () => {
      expect(isValidLicensePlate('')).toBe(false);
      expect(isValidLicensePlate('A')).toBe(false);
      expect(isValidLicensePlate('ABC!@#$%')).toBe(false);
    });
  });

  describe('isValidVehicleYear', () => {
    it('should accept valid years', () => {
      expect(isValidVehicleYear(2024)).toBe(true);
      expect(isValidVehicleYear(1990)).toBe(true);
      expect(isValidVehicleYear(new Date().getFullYear())).toBe(true);
    });

    it('should reject invalid years', () => {
      expect(isValidVehicleYear(1800)).toBe(false);
      expect(isValidVehicleYear(new Date().getFullYear() + 5)).toBe(false);
      expect(isValidVehicleYear(-1)).toBe(false);
    });
  });

  describe('isValidOtp', () => {
    it('should accept valid OTPs', () => {
      expect(isValidOtp('123456')).toBe(true);
      expect(isValidOtp('000000')).toBe(true);
    });

    it('should reject invalid OTPs', () => {
      expect(isValidOtp('')).toBe(false);
      expect(isValidOtp('12345')).toBe(false);
      expect(isValidOtp('1234567')).toBe(false);
      expect(isValidOtp('abcdef')).toBe(false);
    });
  });

  describe('isValidUuid', () => {
    it('should accept valid UUIDs', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUuid('')).toBe(false);
      expect(isValidUuid('not-a-uuid')).toBe(false);
      expect(isValidUuid('550e8400-e29b-51d4-a716-446655440000')).toBe(false);
    });
  });

  describe('isValidCoordinates', () => {
    it('should accept valid coordinates', () => {
      expect(isValidCoordinates(40.7128, -74.006)).toBe(true);
      expect(isValidCoordinates(0, 0)).toBe(true);
      expect(isValidCoordinates(-90, 180)).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(isValidCoordinates(91, 0)).toBe(false);
      expect(isValidCoordinates(0, 181)).toBe(false);
      expect(isValidCoordinates(-91, -181)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('should handle safe strings', () => {
      expect(sanitizeString('Hello World')).toBe('Hello World');
    });
  });
});
