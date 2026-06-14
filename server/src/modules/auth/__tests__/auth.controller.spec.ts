import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { MfaService } from '../mfa.service';
import { SessionService } from '../session.service';
import { OtpPurpose } from '../dto/verify-otp.dto';
import { UserRole } from '@glow-fix/types';
import { AuthUser } from '../types/auth.types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mfaService: jest.Mocked<MfaService>;
  let sessionService: jest.Mocked<SessionService>;

  const mockAuthService = {
    registerClient: jest.fn(),
    registerManager: jest.fn(),
    registerAdmin: jest.fn(),
    verifyOtp: jest.fn(),
    resendOtp: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    logoutAllSessions: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
    handleGoogleOAuth: jest.fn(),
    verifyMfaLogin: jest.fn(),
  };

  const mockMfaService = {
    setupMfa: jest.fn(),
    verifyAndEnableMfa: jest.fn(),
    verifyMfaCode: jest.fn(),
    disableMfa: jest.fn(),
  };

  const mockSessionService = {
    getActiveSessions: jest.fn(),
    invalidateSession: jest.fn(),
    createSession: jest.fn(),
    invalidateAllSessions: jest.fn(),
    invalidateByTokenHash: jest.fn(),
    findByTokenHash: jest.fn(),
    enforceSessionLimit: jest.fn(),
    updateActivity: jest.fn(),
  };

  function mockReq(overrides: Partial<Request> = {}): Request {
    return {
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent') as unknown as Request['get'],
      cookies: {},
      ...overrides,
    } as unknown as Request;
  }

  function mockRes(): Response {
    const res: Partial<Response> = {};
    res.cookie = jest.fn().mockReturnValue(res) as unknown as Response['cookie'];
    res.clearCookie = jest.fn().mockReturnValue(res) as unknown as Response['clearCookie'];
    res.redirect = jest.fn().mockReturnValue(res) as unknown as Response['redirect'];
    return res as Response;
  }

  const mockUser: AuthUser = {
    id: 'user-id',
    email: 'john@example.com',
    fullName: 'John Doe',
    role: 'CLIENT',
    sessionId: 'session-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MfaService, useValue: mockMfaService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    mfaService = module.get(MfaService);
    sessionService = module.get(SessionService);

    jest.clearAllMocks();
  });

  describe('POST /auth/register/client', () => {
    const validDto = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+12025551234',
      password: 'Str0ng!Pass',
      confirmPassword: 'Str0ng!Pass',
    };

    it('should register successfully', async () => {
      mockAuthService.registerClient.mockResolvedValue({
        message: 'Registration successful',
        requiresOtp: true,
      });

      const result = await controller.registerClient(validDto, mockReq());

      expect(result.requiresOtp).toBe(true);
      expect(mockAuthService.registerClient).toHaveBeenCalledWith(validDto, '127.0.0.1', 'test-agent');
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(
        controller.registerClient({ ...validDto, confirmPassword: 'DifferentPass1!' }, mockReq()),
      ).rejects.toThrow(BadRequestException);

      expect(mockAuthService.registerClient).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/verify-otp', () => {
    it('should verify OTP and set refresh token cookie', async () => {
      const dto = { email: 'john@example.com', otp: '123456', purpose: OtpPurpose.EMAIL_VERIFICATION };
      const res = mockRes();
      mockAuthService.verifyOtp.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
        user: { id: 'user-id' },
      });

      const result = await controller.verifyOtp(dto, mockReq(), res);

      expect(result.accessToken).toBe('access-token');
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
    });
  });

  describe('POST /auth/resend-otp', () => {
    it('should resend OTP', async () => {
      mockAuthService.resendOtp.mockResolvedValue({ message: 'A new verification code has been sent.' });

      const result = await controller.resendOtp({ email: 'john@example.com', purpose: OtpPurpose.EMAIL_VERIFICATION });

      expect(result.message).toContain('verification code');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and set refresh token cookie', async () => {
      const dto = { identifier: 'john@example.com', password: 'Str0ng!Pass' };
      const res = mockRes();
      mockAuthService.login.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
        user: { id: 'user-id', fullName: 'John Doe' },
      });

      const result = await controller.login(dto, mockReq(), res);

      expect(result.accessToken).toBe('access-token');
      expect(res.cookie).toHaveBeenCalled();
    });

    it('should return MFA challenge when required', async () => {
      const dto = { identifier: 'john@example.com', password: 'Str0ng!Pass' };
      const res = mockRes();
      mockAuthService.login.mockResolvedValue({
        accessToken: 'mfa-token',
        refreshToken: '',
        expiresIn: 300,
        user: { id: 'user-id' },
        requiresMfa: true,
      });

      const result = await controller.login(dto, mockReq(), res);

      expect(result.requiresMfa).toBe(true);
      expect(result.mfaToken).toBe('mfa-token');
      expect(res.cookie).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should refresh token from cookie', async () => {
      const req = mockReq({ cookies: { refreshToken: 'old-refresh-token' } });
      const res = mockRes();
      mockAuthService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 900,
      });

      const result = await controller.refreshToken(req, res);

      expect(result.accessToken).toBe('new-access-token');
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'new-refresh-token', expect.any(Object));
    });

    it('should throw BadRequestException if no refresh token cookie', async () => {
      await expect(controller.refreshToken(mockReq(), mockRes())).rejects.toThrow(BadRequestException);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookie', async () => {
      const res = mockRes();
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockUser, res);

      expect(result.message).toBe('Logged out successfully');
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-id', 'session-id');
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });

  describe('POST /auth/logout-all', () => {
    it('should logout all sessions and clear cookie', async () => {
      const res = mockRes();
      mockAuthService.logoutAllSessions.mockResolvedValue({ sessionsRevoked: 3 });

      const result = await controller.logoutAll(mockUser, res);

      expect(result.message).toContain('All sessions');
      expect(result.sessionsRevoked).toBe(3);
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send forgot password email', async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'If an account exists, a password reset code has been sent.' });

      const result = await controller.forgotPassword({ identifier: 'john@example.com' });

      expect(result.message).toContain('If an account exists');
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password successfully', async () => {
      mockAuthService.resetPassword.mockResolvedValue({ message: 'Password reset successfully. Please log in again.' });

      const result = await controller.resetPassword({
        resetToken: 'valid-reset-token',
        newPassword: 'NewStr0ng!Pass',
        confirmPassword: 'NewStr0ng!Pass',
      });

      expect(result.message).toContain('Password reset successfully');
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(
        controller.resetPassword({
          resetToken: 'valid-reset-token',
          newPassword: 'NewStr0ng!Pass',
          confirmPassword: 'DifferentPass1!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('POST /auth/change-password', () => {
    it('should change password and clear cookie', async () => {
      const res = mockRes();
      mockAuthService.changePassword.mockResolvedValue({ message: 'Password changed successfully. Please log in again.' });

      const result = await controller.changePassword(
        { currentPassword: 'OldStr0ng!Pass', newPassword: 'NewStr0ng!Pass', confirmPassword: 'NewStr0ng!Pass' },
        mockUser,
        res,
      );

      expect(result.message).toContain('Password changed successfully');
      expect(res.clearCookie).toHaveBeenCalled();
    });

    it('should throw if new password does not match confirm', async () => {
      await expect(
        controller.changePassword(
          { currentPassword: 'OldStr0ng!Pass', newPassword: 'NewStr0ng!Pass', confirmPassword: 'DifferentPass1!' },
          mockUser,
          mockRes(),
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /auth/google', () => {
    it('should initiate Google OAuth', async () => {
      const result = await controller.googleAuth();
      expect(result).toBeUndefined();
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should handle Google OAuth callback and redirect', async () => {
      const req = mockReq({
        user: { providerId: 'google-123', email: 'john@gmail.com', name: 'John Doe', profilePhoto: 'https://photo.url' },
      } as any);
      const res = mockRes();
      mockAuthService.handleGoogleOAuth.mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
        user: { id: 'user-id' },
        isNewUser: false,
      });

      await controller.googleAuthCallback(req, res);

      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('token=access-token'));
    });
  });

  describe('MFA endpoints', () => {
    describe('POST /auth/mfa/setup', () => {
      it('should setup MFA', async () => {
        mockMfaService.setupMfa.mockResolvedValue({ secret: 'MOCK_SECRET', qrCodeUrl: 'data:image/png;base64,...', backupCodes: ['ABCD-EFGH'] });

        const result = await controller.setupMfa(mockUser);

        expect(result.secret).toBe('MOCK_SECRET');
        expect(mockMfaService.setupMfa).toHaveBeenCalledWith('user-id');
      });
    });

    describe('POST /auth/mfa/verify', () => {
      it('should verify and enable MFA', async () => {
        mockMfaService.verifyAndEnableMfa.mockResolvedValue({ enabled: true });

        const result = await controller.verifyMfa(mockUser, '123456');

        expect(result.enabled).toBe(true);
      });
    });

    describe('POST /auth/mfa/validate', () => {
      it('should validate MFA login', async () => {
        const res = mockRes();
        mockAuthService.verifyMfaLogin.mockResolvedValue({
          accessToken: 'access-token', refreshToken: 'refresh-token', expiresIn: 900, user: { id: 'user-id' },
        });

        const result = await controller.validateMfaLogin('mfa-token', '123456', mockReq(), res);

        expect(result.accessToken).toBe('access-token');
        expect(res.cookie).toHaveBeenCalled();
      });
    });

    describe('DELETE /auth/mfa/disable', () => {
      it('should disable MFA', async () => {
        mockMfaService.disableMfa.mockResolvedValue(undefined);

        const result = await controller.disableMfa(mockUser, '123456');

        expect(result.message).toContain('Two-factor authentication has been disabled');
      });
    });
  });

  describe('Session endpoints', () => {
    describe('GET /auth/sessions', () => {
      it('should list active sessions with isCurrent flag', async () => {
        mockSessionService.getActiveSessions.mockResolvedValue([
          { id: 'session-id', deviceInfo: 'desktop', ipAddress: '127.0.0.1', lastUsedAt: new Date(), createdAt: new Date() },
          { id: 'other-session', deviceInfo: 'mobile', ipAddress: '192.168.1.1', lastUsedAt: new Date(), createdAt: new Date() },
        ]);

        const result = await controller.getSessions(mockUser);

        expect(result).toHaveLength(2);
        expect(result[0].isCurrent).toBe(true);
        expect(result[1].isCurrent).toBe(false);
      });
    });

    describe('DELETE /auth/sessions/:sessionId', () => {
      it('should revoke specific session', async () => {
        mockSessionService.invalidateSession.mockResolvedValue(undefined);

        const result = await controller.revokeSession('session-to-revoke');

        expect(result.message).toContain('Session revoked');
      });
    });
  });
});
