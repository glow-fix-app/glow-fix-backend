import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { OtpService } from '../otp.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';
import { EmailService } from '../email.service';
import { OtpPurpose } from '../dto/request/verify-otp.dto';

jest.mock('@glow-fix/utils', () => ({
  generateOtp: jest.fn().mockReturnValue('123456'),
  OTP: {
    LENGTH: 6,
    VALIDITY_MINUTES: 10,
    MAX_ATTEMPTS: 5,
    RESEND_COOLDOWN_SECONDS: 30,
    MAX_RESEND_ATTEMPTS: 3,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    BCRYPT_COST_FACTOR: 12,
    HISTORY_COUNT: 5,
  },
  SESSION: {
    MAX_CONCURRENT_DEVICES: 5,
    REMEMBER_ME_DAYS: 30,
  },
}));

jest.mock('bcryptjs');

describe('OtpService', () => {
  let service: OtpService;
  let prisma: jest.Mocked<PrismaService>;
  let redis: jest.Mocked<RedisService>;
  let emailService: jest.Mocked<EmailService>;

  const mockPrisma = {
    userOtp: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    del: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
    exists: jest.fn(),
    checkRateLimit: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      const configs: Record<string, string | undefined> = {
        'app.nodeEnv': 'test',
        'twilio.accountSid': 'test-sid',
        'twilio.authToken': 'test-token',
        'twilio.phoneNumber': '+10000000000',
      };
      return configs[key];
    }),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: ConfigService, useValue: mockConfig },
        { provide: WinstonLoggerService, useValue: mockLogger },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
    prisma = module.get(PrismaService);
    redis = module.get(RedisService);
    emailService = module.get(EmailService);

    jest.clearAllMocks();
  });

  describe('sendOtpToEmail', () => {
    const userId = 'user-id';
    const email = 'test@example.com';
    const purpose = OtpPurpose.EMAIL_VERIFICATION;

    it('should generate OTP, store hash, and send email', async () => {
      mockRedis.get.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-code');
      mockPrisma.userOtp.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.userOtp.create.mockResolvedValue({ id: 'otp-id' });
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await service.sendOtpToEmail(userId, email, purpose);

      expect(mockRedis.get).toHaveBeenCalled();
      expect(mockRedis.incr).toHaveBeenCalled();
      expect(mockRedis.expire).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(mockPrisma.userOtp.updateMany).toHaveBeenCalled();
      expect(mockPrisma.userOtp.create).toHaveBeenCalled();
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('verification'),
        }),
      );
    });

    it('should throw when max resend attempts reached', async () => {
      mockRedis.get.mockResolvedValue('3');

      await expect(
        service.sendOtpToEmail(userId, email, purpose),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle resend cooldown increment', async () => {
      mockRedis.get.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-code');
      mockPrisma.userOtp.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.userOtp.create.mockResolvedValue({ id: 'otp-id' });
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await service.sendOtpToEmail(userId, email, purpose);

      expect(mockRedis.incr).toHaveBeenCalledWith(
        expect.stringContaining('otp:resend:'),
      );
    });
  });

  describe('sendOtpToPhone', () => {
    const userId = 'user-id';
    const phone = '+12025551234';
    const purpose = OtpPurpose.PHONE_VERIFICATION;

    it('should generate OTP, store hash, and log in dev mode', async () => {
      mockRedis.get.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-code');
      mockPrisma.userOtp.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.userOtp.create.mockResolvedValue({ id: 'otp-id' });

      await service.sendOtpToPhone(userId, phone, purpose);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEV] OTP for'),
        'OtpService',
      );
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockPrisma.userOtp.create).toHaveBeenCalled();
    });

    it('should throw when max resend attempts reached', async () => {
      mockRedis.get.mockResolvedValue('3');

      await expect(
        service.sendOtpToPhone(userId, phone, purpose),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyOtp', () => {
    const userId = 'user-id';
    const purpose = OtpPurpose.EMAIL_VERIFICATION;

    it('should verify valid OTP and mark as used', async () => {
      const mockRecord = {
        id: 'otp-id',
        codeHash: 'hashed-code',
        attempts: 0,
        expiresAt: new Date(Date.now() + 600000),
        createdAt: new Date(),
      };
      mockPrisma.userOtp.findFirst.mockResolvedValue(mockRecord);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrisma.userOtp.update.mockResolvedValue(mockRecord);

      const result = await service.verifyOtp(userId, '123456', purpose);

      expect(result).toBe(true);
      expect(mockPrisma.userOtp.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'otp-id' },
          data: { usedAt: expect.any(Date) },
        }),
      );
    });

    it('should throw when OTP has expired or not found', async () => {
      mockPrisma.userOtp.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyOtp(userId, '123456', purpose),
      ).rejects.toThrow('OTP has expired');
    });

    it('should throw when max attempts reached and delete record', async () => {
      const mockRecord = {
        id: 'otp-id',
        codeHash: 'hashed-code',
        attempts: 5,
        expiresAt: new Date(Date.now() + 600000),
      };
      mockPrisma.userOtp.findFirst.mockResolvedValue(mockRecord);
      mockPrisma.userOtp.delete.mockResolvedValue(mockRecord);

      await expect(
        service.verifyOtp(userId, '123456', purpose),
      ).rejects.toThrow('Too many verification attempts');

      expect(mockPrisma.userOtp.delete).toHaveBeenCalledWith({
        where: { id: 'otp-id' },
      });
    });

    it('should throw and increment attempts for invalid OTP', async () => {
      const mockRecord = {
        id: 'otp-id',
        codeHash: 'hashed-code',
        attempts: 0,
        expiresAt: new Date(Date.now() + 600000),
      };
      mockPrisma.userOtp.findFirst.mockResolvedValue(mockRecord);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.verifyOtp(userId, '999999', purpose),
      ).rejects.toThrow('Invalid OTP');

      expect(mockPrisma.userOtp.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'otp-id' },
          data: { attempts: { increment: 1 } },
        }),
      );
    });

    it('should show remaining attempts on invalid OTP', async () => {
      const mockRecord = {
        id: 'otp-id',
        codeHash: 'hashed-code',
        attempts: 2,
        expiresAt: new Date(Date.now() + 600000),
      };
      mockPrisma.userOtp.findFirst.mockResolvedValue(mockRecord);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.verifyOtp(userId, '999999', purpose),
      ).rejects.toThrow('2 attempt(s) remaining');
    });
  });
});
