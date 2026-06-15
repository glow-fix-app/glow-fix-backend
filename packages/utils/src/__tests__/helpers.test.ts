import {
  generateOtp,
  generateReferralCode,
  calculateLoyaltyPoints,
  loyaltyPointsToDollars,
  isOffPeakHour,
  calculateEstimatedWaitTime,
  chunkArray,
  pick,
  omit,
  isEmpty,
  normalizeLicensePlate,
} from '../helpers';

describe('Helper Utils', () => {
  describe('generateOtp', () => {
    it('should generate OTP of correct length', () => {
      expect(generateOtp(6)).toHaveLength(6);
      expect(generateOtp(4)).toHaveLength(4);
    });

    it('should generate digits only', () => {
      const otp = generateOtp(6);
      expect(/^\d+$/.test(otp)).toBe(true);
    });
  });

  describe('generateReferralCode', () => {
    it('should generate code with prefix', () => {
      const code = generateReferralCode('GF');
      expect(code).toMatch(/^GF-[A-Z0-9]{6}$/);
    });

    it('should generate unique codes', () => {
      const codes = new Set(Array.from({ length: 100 }, () => generateReferralCode()));
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe('calculateLoyaltyPoints', () => {
    it('should calculate base points correctly', () => {
      expect(calculateLoyaltyPoints(2500)).toBe(250); // \$25 * 10 points
    });

    it('should apply off-peak multiplier', () => {
      expect(calculateLoyaltyPoints(2500, true)).toBe(500); // 250 * 2
    });

    it('should floor partial points', () => {
      // $1.99 * 10 = 19.9 → 19
      expect(calculateLoyaltyPoints(199)).toBe(19);
    });
  });

  describe('loyaltyPointsToDollars', () => {
    it('should convert points to dollars', () => {
      expect(loyaltyPointsToDollars(100)).toBe(5); // 100 / 20 = 5
    });
  });

  describe('isOffPeakHour', () => {
    it('should identify off-peak hours (2PM-5PM)', () => {
      const offPeak = new Date();
      offPeak.setHours(15, 0, 0, 0); // 3 PM
      expect(isOffPeakHour(offPeak)).toBe(true);
    });

    it('should identify peak hours', () => {
      const peak = new Date();
      peak.setHours(10, 0, 0, 0); // 10 AM
      expect(isOffPeakHour(peak)).toBe(false);
    });
  });

  describe('calculateEstimatedWaitTime', () => {
    it('should calculate wait time correctly', () => {
      // 6th in queue, 30 min avg, 2 staff = ceil(6/2) * 30 * 1.0 = 90
      expect(calculateEstimatedWaitTime(6, 30, 2)).toBe(90);
    });

    it('should return -1 when no staff available', () => {
      expect(calculateEstimatedWaitTime(3, 30, 0)).toBe(-1);
    });

    it('should apply efficiency factor', () => {
      expect(calculateEstimatedWaitTime(2, 30, 1, 1.2)).toBe(72); // 2 * 30 * 1.2
    });
  });

  describe('chunkArray', () => {
    it('should chunk arrays correctly', () => {
      expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty arrays', () => {
      expect(chunkArray([], 5)).toEqual([]);
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });
  });

  describe('isEmpty', () => {
    it('should identify empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('  ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should identify non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('normalizeLicensePlate', () => {
    it('should normalize plates', () => {
      expect(normalizeLicensePlate('ab-12-cd')).toBe('AB12CD');
      expect(normalizeLicensePlate('XY 999 ZZ')).toBe('XY999ZZ');
    });
  });
});