import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';
import { TokenService } from '../token.service';
import { OtpService } from '../otp.service';
import { PasswordService } from '../password.service';
import { SessionService } from '../session.service';
import { StorageService } from '../../../core/storage/storage.service';
import { UserRole, Permission } from '@glow-fix/types';
import { OtpPurpose } from '../dto/verify-otp.dto';

jest.mock('otplib', () => ({
  authenticator: {
    verify: jest.fn(),
  },
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let redis: jest.Mocked<RedisService>;
  let tokenService: jest.Mocked<TokenService>;
  let otpService: jest.Mocked<OtpService>;
  let passwordService: jest.Mocked<PasswordService>;
  let sessionService: jest.Mocked<SessionService>;
  let storage: jest.Mocked<StorageService>;

  const mockUser = {
    id: 'user-id',
    fullName: 'Ahmed Eid',
    email: 'ahmed@example.com',
    phone: '+12025551234',
    avatarUrl: null,
    passwordHash: 'hashed_password',
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    role: 'CLIENT',
    deletedAt: null,
    isActive: true,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    client: {
      create: jest.fn(),
    },
    userAuthProvider: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    userOtp: {
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    image: {
      create: jest.fn(),
    },
  };

  const mockRedis = {
    checkRateLimit: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    exists: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn(),
  };

  const mockTokenService = {
    generateTokenPair: jest.fn(),
    generateMfaToken: jest.fn(),
    verifyMfaToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    blacklistToken: jest.fn(),
    isTokenBlacklisted: jest.fn(),
    verifyResetToken: jest.fn(),
  };

  const mockOtpService = {
    sendOtpToEmail: jest.fn(),
    sendOtpToPhone: jest.fn(),
    verifyOtp: jest.fn(),
  };

  const mockPasswordService = {
    hash: jest.fn(),
    compare: jest.fn(),
    isPasswordReused: jest.fn(),
    addToHistory: jest.fn(),
  };

  const mockSessionService = {
    createSession: jest.fn(),
    invalidateSession: jest.fn(),
    invalidateAllSessions: jest.fn(),
    invalidateByTokenHash: jest.fn(),
    findByTokenHash: jest.fn(),
    enforceSessionLimit: jest.fn(),
    getActiveSessions: jest.fn(),
    updateActivity: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockStorage = {
    uploadFile: jest.fn(),
  };

  function setupSuccessLoginMocks() {
    mockRedis.checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });
    mockPasswordService.compare.mockResolvedValue(true);
    mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
    mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
    mockTokenService.generateTokenPair.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'token-service-refresh',
      expiresIn: 900,
    });
    mockPrisma.user.update.mockResolvedValue(mockUser);
    mockRedis.del.mockResolvedValue(1);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: WinstonLoggerService, useValue: mockLogger },
        { provide: TokenService, useValue: mockTokenService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: StorageService, useValue: mockStorage },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    redis = module.get(RedisService);
    tokenService = module.get(TokenService);
    otpService = module.get(OtpService);
    passwordService = module.get(PasswordService);
    sessionService = module.get(SessionService);
    storage = module.get(StorageService);

    jest.clearAllMocks();
  });

  describe('registerClient', () => {
    const registerDto = {
      fullName: 'Ahmed Eid',
      email: 'ahmed@example.com',
      phone: '+12025551234',
      password: 'Str0ng!Pass',
      confirmPassword: 'Str0ng!Pass',
    };

    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed_password');
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.client.create.mockResolvedValue({} as any);
      mockPrisma.userAuthProvider.create.mockResolvedValue({} as any);
      mockOtpService.sendOtpToEmail.mockResolvedValue(undefined);
      mockOtpService.sendOtpToPhone.mockResolvedValue(undefined);

      const result = await service.registerClient(registerDto, '127.0.0.1', 'test-agent');

      expect(result.requiresOtp).toBe(true);
      expect(result.message).toContain('Verification codes');
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.client.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { userId: mockUser.id } }),
      );
      expect(mockPrisma.userAuthProvider.create).toHaveBeenCalled();
      expect(mockOtpService.sendOtpToEmail).toHaveBeenCalledWith(
        mockUser.id, registerDto.email, OtpPurpose.EMAIL_VERIFICATION,
      );
      expect(mockOtpService.sendOtpToPhone).toHaveBeenCalledWith(
        mockUser.id, registerDto.phone, OtpPurpose.PHONE_VERIFICATION,
      );
    });

    it('should register without phone and send only email OTP', async () => {
      const dtoWithoutPhone = { ...registerDto, phone: undefined };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed_password');
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.client.create.mockResolvedValue({} as any);
      mockPrisma.userAuthProvider.create.mockResolvedValue({} as any);
      mockOtpService.sendOtpToEmail.mockResolvedValue(undefined);

      const result = await service.registerClient(dtoWithoutPhone, '127.0.0.1', 'test-agent');

      expect(result.message).toContain('A verification code');
      expect(mockOtpService.sendOtpToPhone).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(
        service.registerClient(registerDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if phone exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(
        service.registerClient(registerDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(ConflictException);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { phone: registerDto.phone } }),
      );
    });
  });

  describe('verifyOtp', () => {
    const verifyOtpDto = {
      email: 'ahmed@example.com',
      otp: '123456',
      purpose: OtpPurpose.EMAIL_VERIFICATION,
    };

    it('should verify OTP and return tokens with user', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockOtpService.verifyOtp.mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, emailVerified: true });
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'token-refresh',
        expiresIn: 900,
      });

      const result = await service.verifyOtp(verifyOtpDto, '127.0.0.1', 'test-agent');

      expect(result.accessToken).toBe('access-token');
      expect(result.user).toHaveProperty('id', 'user-id');
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-id' },
          data: { emailVerified: true },
        }),
      );
    });

    it('should throw BadRequestException if neither email nor phone provided', async () => {
      await expect(
        service.verifyOtp({ otp: '123456', purpose: OtpPurpose.EMAIL_VERIFICATION } as any, 'ip', 'ua'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyOtp(verifyOtpDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should mark phone as verified for PHONE_VERIFICATION purpose', async () => {
      const phoneDto = { phone: '+12025551234', otp: '123456', purpose: OtpPurpose.PHONE_VERIFICATION };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockOtpService.verifyOtp.mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, phoneVerified: true });
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'token-refresh',
        expiresIn: 900,
      });

      await service.verifyOtp(phoneDto, '127.0.0.1', 'test-agent');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-id' },
          data: { phoneVerified: true },
        }),
      );
    });
  });

  describe('resendOtp', () => {
    it('should resend OTP to email', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ ...mockUser, emailVerified: false });
      mockOtpService.sendOtpToEmail.mockResolvedValue(undefined);

      const result = await service.resendOtp({
        email: 'ahmed@example.com',
        purpose: OtpPurpose.EMAIL_VERIFICATION,
      });

      expect(result.message).toBe('If an account exists, a new verification code has been sent.');
      expect(mockOtpService.sendOtpToEmail).toHaveBeenCalled();
    });

    it('should throw if email already verified', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ ...mockUser, emailVerified: true });

      await expect(
        service.resendOtp({ email: 'ahmed@example.com', purpose: OtpPurpose.EMAIL_VERIFICATION }),
      ).rejects.toThrow('Email is already verified');
    });

    it('should return generic message if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await service.resendOtp({
        email: 'unknown@example.com',
        purpose: OtpPurpose.EMAIL_VERIFICATION,
      });

      expect(result.message).toContain('If an account exists');
      expect(mockOtpService.sendOtpToEmail).not.toHaveBeenCalled();
    });

    it('should throw if neither email nor phone provided', async () => {
      await expect(
        service.resendOtp({ purpose: OtpPurpose.EMAIL_VERIFICATION } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto = { identifier: 'john@example.com', password: 'Str0ng!Pass' };

    it('should login successfully with valid credentials', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      setupSuccessLoginMocks();

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(result.accessToken).toBe('access-token');
      expect(result.user).toHaveProperty('id', 'user-id');
      expect(result.requiresMfa).toBeUndefined();
      expect(mockRedis.del).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockRedis.checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });
      mockPasswordService.compare.mockResolvedValue(false);
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(true);
      mockPrisma.auditLog.create.mockResolvedValue({} as any);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'LOGIN',
            newData: { reason: 'Invalid password' },
          }),
        }),
      );
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockRedis.checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for user without passwordHash (OAuth only)', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ ...mockUser, passwordHash: null });
      mockRedis.checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return MFA challenge when 2FA is enabled', async () => {
      const mfaUser = { ...mockUser, twoFactorEnabled: true };
      mockPrisma.user.findFirst.mockResolvedValue(mfaUser);
      mockRedis.checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });
      mockPasswordService.compare.mockResolvedValue(true);
      mockTokenService.generateMfaToken.mockResolvedValue('mfa-token');

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(result.requiresMfa).toBe(true);
      expect(result.accessToken).toBe('mfa-token');
      expect(result.expiresIn).toBe(300);
      expect(mockSessionService.createSession).not.toHaveBeenCalled();
    });

    it('should block login after too many failed attempts', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockRedis.checkRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 900000 });

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should handle login with phone number', async () => {
      const phoneLoginDto = { identifier: '+12025551234', password: 'Str0ng!Pass' };
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      setupSuccessLoginMocks();

      await service.login(phoneLoginDto, '127.0.0.1', 'test-agent');

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([{ phone: '+12025551234' }]),
          }),
        }),
      );
    });
  });

  describe('verifyMfaLogin', () => {
    it('should complete MFA login with valid token and code', async () => {
      mockTokenService.verifyMfaToken.mockResolvedValue({
        sub: 'user-id', type: 'mfa_pending',
      } as any);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, twoFactorEnabled: true, twoFactorSecret: 'MOCK_SECRET',
      });
      const { authenticator } = require('otplib');
      authenticator.verify.mockReturnValue(true);
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token', refreshToken: 'refresh', expiresIn: 900,
      });

      const result = await service.verifyMfaLogin('mfa-token', '123456', '127.0.0.1', 'test-agent');

      expect(result.accessToken).toBe('access-token');
      expect(result.user).toHaveProperty('id', 'user-id');
    });

    it('should throw UnauthorizedException for invalid MFA token', async () => {
      mockTokenService.verifyMfaToken.mockRejectedValue(new Error('Invalid'));

      await expect(
        service.verifyMfaLogin('bad-token', '123456', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if MFA not enabled', async () => {
      mockTokenService.verifyMfaToken.mockResolvedValue({ sub: 'user-id' } as any);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, twoFactorEnabled: false, twoFactorSecret: null });

      await expect(
        service.verifyMfaLogin('mfa-token', '123456', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException for invalid TOTP code', async () => {
      mockTokenService.verifyMfaToken.mockResolvedValue({ sub: 'user-id' } as any);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser, twoFactorEnabled: true, twoFactorSecret: 'MOCK_SECRET',
      });
      const { authenticator } = require('otplib');
      authenticator.verify.mockReturnValue(false);

      await expect(
        service.verifyMfaLogin('mfa-token', 'wrong-code', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      mockSessionService.findByTokenHash.mockResolvedValue({ id: 'session-id', userId: 'user-id' });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockSessionService.invalidateByTokenHash.mockResolvedValue(undefined);
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'new-session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'new-access-token', refreshToken: 'new-refresh', expiresIn: 900,
      });

      const result = await service.refreshTokens('valid-refresh-token', '127.0.0.1', 'test-agent');

      expect(result.accessToken).toBe('new-access-token');
      expect(mockSessionService.invalidateByTokenHash).toHaveBeenCalledWith('valid-refresh-token');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      mockSessionService.findByTokenHash.mockResolvedValue(null);

      await expect(
        service.refreshTokens('invalid-token', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for deleted/inactive user', async () => {
      mockSessionService.findByTokenHash.mockResolvedValue({ id: 'session-id', userId: 'user-id' });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.refreshTokens('valid-token', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should invalidate session on logout', async () => {
      mockSessionService.invalidateSession.mockResolvedValue(undefined);

      await service.logout('user-id', 'session-id');

      expect(mockSessionService.invalidateSession).toHaveBeenCalledWith('session-id');
    });
  });

  describe('logoutAllSessions', () => {
    it('should invalidate all sessions and store logout timestamp', async () => {
      mockSessionService.invalidateAllSessions.mockResolvedValue(5);
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.logoutAllSessions('user-id');

      expect(result.sessionsRevoked).toBe(5);
      expect(mockSessionService.invalidateAllSessions).toHaveBeenCalledWith('user-id');
      expect(mockRedis.set).toHaveBeenCalledWith(
        expect.stringContaining('user:logout-timestamp:'),
        expect.any(String),
        604800,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset OTP for existing user', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ ...mockUser, email: 'john@example.com' });
      mockOtpService.sendOtpToEmail.mockResolvedValue(undefined);

      const result = await service.forgotPassword({ identifier: 'john@example.com' });

      expect(result.message).toContain('password reset code');
      expect(mockOtpService.sendOtpToEmail).toHaveBeenCalledWith(
        'user-id', 'john@example.com', OtpPurpose.PASSWORD_RESET,
      );
    });

    it('should return generic message for non-existent user', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await service.forgotPassword({ identifier: 'unknown@example.com' });

      expect(result.message).toContain('If an account exists');
      expect(mockOtpService.sendOtpToEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const resetDto = {
      resetToken: 'valid-reset-token',
      newPassword: 'NewStr0ng!Pass',
      confirmPassword: 'NewStr0ng!Pass',
    };

    it('should reset password and invalidate all sessions', async () => {
      mockTokenService.verifyResetToken.mockReturnValueOnce({
        sub: 'user-id',
        email: 'john@example.com',
      });
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockPrisma.userOtp.findFirst.mockResolvedValue({ id: 'otp-id' });
      mockPrisma.userOtp.update.mockResolvedValue({ id: 'otp-id' });
      mockOtpService.verifyOtp.mockResolvedValue(true);
      mockPasswordService.compare.mockResolvedValueOnce(false);
      mockPasswordService.isPasswordReused.mockResolvedValueOnce(false);
      mockPasswordService.hash.mockResolvedValue('new_hashed_password');
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockSessionService.invalidateAllSessions.mockResolvedValue(3);

      const result = await service.resetPassword(resetDto);

      expect(result.message).toContain('Password reset successfully');
      expect(mockSessionService.invalidateAllSessions).toHaveBeenCalledWith('user-id');
      expect(mockPasswordService.hash).toHaveBeenCalledWith('NewStr0ng!Pass');
    });

    it('should throw BadRequestException if user not found', async () => {
      mockTokenService.verifyResetToken.mockReturnValueOnce({
        sub: 'user-id',
        email: 'john@example.com',
      });
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.resetPassword(resetDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    const changeDto = {
      currentPassword: 'OldStr0ng!Pass',
      newPassword: 'NewStr0ng!Pass',
      confirmPassword: 'NewStr0ng!Pass',
    };

    it('should change password successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.compare
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      mockPasswordService.hash.mockResolvedValue('new_hashed_password');
      mockPrisma.user.update.mockResolvedValue(mockUser);
      mockSessionService.invalidateAllSessions.mockResolvedValue(3);

      const result = await service.changePassword('user-id', changeDto);

      expect(result.message).toContain('Password changed successfully');
      expect(mockSessionService.invalidateAllSessions).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('user-id', changeDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if current password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.compare.mockResolvedValueOnce(false);

      await expect(
        service.changePassword('user-id', changeDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if new password same as current', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.compare
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);

      await expect(
        service.changePassword('user-id', changeDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleGoogleOAuth', () => {
    const googleProfile = {
      providerId: 'google-123',
      email: 'john@gmail.com',
      name: 'John Doe',
      profilePhoto: 'https://photo.url',
    };

    it('should login existing OAuth user', async () => {
      mockPrisma.userAuthProvider.findUnique.mockResolvedValue({
        user: mockUser,
      } as any);
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token', refreshToken: 'refresh', expiresIn: 900,
      });

      const result = await service.handleGoogleOAuth(googleProfile, '127.0.0.1', 'test-agent');

      expect(result.isNewUser).toBe(false);
      expect(result.accessToken).toBe('access-token');
      expect(result.user).toHaveProperty('id', 'user-id');
    });

    it('should link Google to existing email account', async () => {
      mockPrisma.userAuthProvider.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.userAuthProvider.create.mockResolvedValue({} as any);
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token', refreshToken: 'refresh', expiresIn: 900,
      });

      const result = await service.handleGoogleOAuth(googleProfile, '127.0.0.1', 'test-agent');

      expect(result.isNewUser).toBe(false);
      expect(mockPrisma.userAuthProvider.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            provider: 'GOOGLE',
            providerUserId: 'google-123',
          }),
        }),
      );
    });

    it('should create new user for new Google account', async () => {
      mockPrisma.userAuthProvider.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.client.create.mockResolvedValue({} as any);
      mockPrisma.userAuthProvider.create.mockResolvedValue({} as any);
      mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
      mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access-token', refreshToken: 'refresh', expiresIn: 900,
      });

      const result = await service.handleGoogleOAuth(googleProfile, '127.0.0.1', 'test-agent');

      expect(result.isNewUser).toBe(true);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'john@gmail.com',
            emailVerified: true,
          }),
        }),
      );
      expect(mockPrisma.client.create).toHaveBeenCalled();
    });
  });
});
