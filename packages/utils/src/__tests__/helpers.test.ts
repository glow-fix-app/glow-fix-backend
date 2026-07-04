import { generateOtp } from '../helpers';

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
});