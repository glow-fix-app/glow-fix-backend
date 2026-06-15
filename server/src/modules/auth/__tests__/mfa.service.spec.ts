import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { MfaService } from '../mfa.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

jest.mock('otplib', () => ({
  authenticator: {
    generateSecret: jest.fn(),
    keyuri: jest.fn(),
    verify: jest.fn(),
  },
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('MfaService', () => {
  let service: MfaService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MfaService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WinstonLoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<MfaService>(MfaService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('setupMfa', () => {
    it('should generate secret, QR code, backup codes, and store secret', async () => {
      const mockUser = { email: 'user@example.com' };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      (authenticator.generateSecret as jest.Mock).mockReturnValue('MOCK_SECRET');
      (authenticator.keyuri as jest.Mock).mockReturnValue('otpauth://totp/GlowFix:user@example.com?secret=MOCK_SECRET');
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,mockQRCode');
      mockPrisma.user.update.mockResolvedValue(mockUser as any);

      const result = await service.setupMfa('user-id');

      expect(result.secret).toBe('MOCK_SECRET');
      expect(result.qrCodeUrl).toBe('data:image/png;base64,mockQRCode');
      expect(result.backupCodes).toHaveLength(10);
      expect(result.backupCodes[0]).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-id' },
          data: { twoFactorSecret: 'MOCK_SECRET' },
        }),
      );
    });

    it('should throw when user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.setupMfa('user-id')).rejects.toThrow(BadRequestException);
    });

    it('should generate backup codes in correct format', async () => {
      const mockUser = { email: 'user@example.com' };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      (authenticator.generateSecret as jest.Mock).mockReturnValue('MOCK_SECRET');
      (authenticator.keyuri as jest.Mock).mockReturnValue('otpauth://...');
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('data:image/png;base64,code');

      const result = await service.setupMfa('user-id');

      expect(result.backupCodes.length).toBe(10);
      for (const code of result.backupCodes) {
        expect(code).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
      }
    });
  });

  describe('verifyAndEnableMfa', () => {
    it('should enable MFA with valid code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
      });
      (authenticator.verify as jest.Mock).mockReturnValue(true);
      mockPrisma.user.update.mockResolvedValue({} as any);

      const result = await service.verifyAndEnableMfa('user-id', '123456');

      expect(result.enabled).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-id' },
          data: { twoFactorEnabled: true },
        }),
      );
    });

    it('should reject invalid verification code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
      });
      (authenticator.verify as jest.Mock).mockReturnValue(false);

      await expect(
        service.verifyAndEnableMfa('user-id', 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if MFA setup was not initiated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: null,
      });

      await expect(
        service.verifyAndEnableMfa('user-id', '123456'),
      ).rejects.toThrow('MFA setup not initiated');
    });
  });

  describe('verifyMfaCode', () => {
    it('should return true for valid code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
        twoFactorEnabled: true,
      });
      (authenticator.verify as jest.Mock).mockReturnValue(true);

      const result = await service.verifyMfaCode('user-id', '123456');

      expect(result).toBe(true);
    });

    it('should return false for invalid code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
        twoFactorEnabled: true,
      });
      (authenticator.verify as jest.Mock).mockReturnValue(false);

      const result = await service.verifyMfaCode('user-id', 'invalid');

      expect(result).toBe(false);
    });

    it('should throw if twoFactorSecret is missing', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: null,
        twoFactorEnabled: false,
      });

      await expect(
        service.verifyMfaCode('user-id', '123456'),
      ).rejects.toThrow('MFA is not enabled');
    });
  });

  describe('disableMfa', () => {
    it('should disable MFA with valid code', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
      });
      (authenticator.verify as jest.Mock).mockReturnValue(true);
      mockPrisma.user.update.mockResolvedValue({} as any);

      await service.disableMfa('user-id', '123456');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-id' },
          data: { twoFactorEnabled: false, twoFactorSecret: null },
        }),
      );
    });

    it('should throw if code is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET',
      });
      (authenticator.verify as jest.Mock).mockReturnValue(false);

      await expect(
        service.disableMfa('user-id', 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if MFA is not set up', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: null,
      });

      await expect(
        service.disableMfa('user-id', '123456'),
      ).rejects.toThrow('MFA is not set up');
    });
  });
});
