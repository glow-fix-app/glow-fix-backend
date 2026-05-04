// import { jest, describe, it, expect, beforeEach } from '@jest/globals';
// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   ConflictException,
//   UnauthorizedException,
//   BadRequestException,
// } from '@nestjs/common';
// import { AuthService } from '../auth.service';
// import { PrismaService } from '../../../core/prisma/prisma.service';
// import { RedisService } from '../../../core/redis/redis.service';
// import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';
// import { TokenService } from '../token.service';
// import { OtpService } from '../otp.service';
// import { PasswordService } from '../password.service';
// import { SessionService } from '../session.service';

//   describe('AuthService', () => {
//     let service: AuthService;
//     let prisma: jest.Mocked<PrismaService>;
//     let redis: jest.Mocked<RedisService>;
//     let tokenService: jest.Mocked<TokenService>;
//     let otpService: jest.Mocked<OtpService>;
//     let passwordService: jest.Mocked<PasswordService>;
//     let sessionService: jest.Mocked<SessionService>;

//     const mockPrisma = {
//       customer: {
//         findUnique: jest.fn(),
//         findFirst: jest.fn(),
//         create: jest.fn(),
//         update: jest.fn(),
//       },
//       oAuthAccount: {
//         findUnique: jest.fn(),
//         create: jest.fn(),
//       },
//       session: {
//         findUnique: jest.fn(),
//         update: jest.fn(),
//         delete: jest.fn(),
//       },
//       securityEvent: {
//         create: jest.fn(),
//       },
//       referral: {
//         findFirst: jest.fn(),
//         create: jest.fn(),
//         update: jest.fn(),
//       },
//     };

//   const mockRedis = {
//     checkRateLimit: jest.fn(),
//     incr: jest.fn(),
//     expire: jest.fn(),
//     del: jest.fn(),
//     get: jest.fn(),
//   };

//   const mockTokenService = {
//     generateTokenPair: jest.fn(),
//     generateMfaToken: jest.fn(),
//     isTokenBlacklisted: jest.fn(),
//   };

//   const mockOtpService = {
//     sendOtp: jest.fn(),
//     verifyOtp: jest.fn(),
//   };

//   const mockPasswordService = {
//     hash: jest.fn(),
//     compare: jest.fn(),
//     isPasswordReused: jest.fn(),
//     addToHistory: jest.fn(),
//   };

//   const mockSessionService = {
//     createSession: jest.fn(),
//     invalidateSession: jest.fn(),
//     invalidateAllSessions: jest.fn(),
//     enforceSessionLimit: jest.fn(),
//   };

//   const mockLogger = {
//     log: jest.fn(),
//     error: jest.fn(),
//     warn: jest.fn(),
//     debug: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: PrismaService, useValue: mockPrisma },
//         { provide: RedisService, useValue: mockRedis },
//         { provide: WinstonLoggerService, useValue: mockLogger },
//         { provide: TokenService, useValue: mockTokenService },
//         { provide: OtpService, useValue: mockOtpService },
//         { provide: PasswordService, useValue: mockPasswordService },
//         { provide: SessionService, useValue: mockSessionService },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     prisma = module.get(PrismaService);
//     redis = module.get(RedisService);
//     tokenService = module.get(TokenService);
//     otpService = module.get(OtpService);
//     passwordService = module.get(PasswordService);
//     sessionService = module.get(SessionService);

//     jest.clearAllMocks();
//   });

//   describe('register', () => {
//     const registerDto = {
//       fullName: 'John Doe',
//       mobileNumber: '+12025551234',
//       email: 'john@example.com',
//       password: 'MyStr0ng!Pass',
//       confirmPassword: 'MyStr0ng!Pass',
//     };

//     it('should register a new customer successfully', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue(null);
//       mockPasswordService.hash.mockResolvedValue('hashed_password');
//       mockPrisma.customer.create.mockResolvedValue({
//         id: 'customer-id',
//         ...registerDto,
//       });
//       mockOtpService.sendOtp.mockResolvedValue(undefined);

//       const result = await service.register(
//         registerDto,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.requiresOtp).toBe(true);
//       expect(mockPrisma.customer.create).toHaveBeenCalled();
//       expect(mockOtpService.sendOtp).toHaveBeenCalledWith(
//         registerDto.mobileNumber,
//         'REGISTRATION',
//       );
//     });

//     it('should throw ConflictException if email exists', async () => {
//       mockPrisma.customer.findUnique
//         .mockResolvedValueOnce({ id: 'existing' }) // email check
//         .mockResolvedValueOnce(null); // mobile check

//       await expect(
//         service.register(registerDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should throw ConflictException if mobile exists', async () => {
//       mockPrisma.customer.findUnique
//         .mockResolvedValueOnce(null) // email check
//         .mockResolvedValueOnce({ id: 'existing' }); // mobile check

//       await expect(
//         service.register(registerDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(ConflictException);
//     });

//     it('should handle referral code during registration', async () => {
//       const dtoWithReferral = { ...registerDto, referralCode: 'GF-ABC123' };

//       mockPrisma.customer.findUnique
//         .mockResolvedValueOnce(null) // email check
//         .mockResolvedValueOnce(null) // mobile check
//         .mockResolvedValueOnce(null) // referral code uniqueness
//         .mockResolvedValueOnce({
//           id: 'referrer-id',
//           referralCode: 'GF-ABC123',
//         }); // referrer lookup

//       mockPasswordService.hash.mockResolvedValue('hashed_password');
//       mockPrisma.customer.create.mockResolvedValue({
//         id: 'new-customer-id',
//         ...dtoWithReferral,
//         referredBy: 'referrer-id',
//       });
//       mockOtpService.sendOtp.mockResolvedValue(undefined);

//       const result = await service.register(
//         dtoWithReferral,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.requiresOtp).toBe(true);
//       expect(mockPrisma.customer.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             referredBy: 'referrer-id',
//           }),
//         }),
//       );
//     });
//   });

//   describe('login', () => {
//     const loginDto = {
//       identifier: 'john@example.com',
//       password: 'MyStr0ng!Pass',
//     };

//     const mockCustomer = {
//       id: 'customer-id',
//       fullName: 'John Doe',
//       email: 'john@example.com',
//       mobileNumber: '+12025551234',
//       passwordHash: 'hashed_password',
//       loyaltyPoints: 100,
//       profilePhotoUrl: null,
//       mobileVerified: true,
//       emailVerified: true,
//       twoFactorEnabled: false,
//       deletedAt: null,
//     };

//     it('should login successfully with valid credentials', async () => {
//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 4,
//         resetAt: 0,
//       });
//       mockPasswordService.compare.mockResolvedValue(true);
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.customer.update.mockResolvedValue(mockCustomer);
//       mockPrisma.session.update.mockResolvedValue({});
//       mockRedis.del.mockResolvedValue(1);

//       const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

//       expect(result.accessToken).toBe('access-token');
//       expect(result.customer).toHaveProperty('id', 'customer-id');
//       expect(result.requiresMfa).toBeUndefined();
//     });

//     it('should throw UnauthorizedException for invalid password', async () => {
//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 4,
//         resetAt: 0,
//       });
//       mockPasswordService.compare.mockResolvedValue(false);
//       mockRedis.incr.mockResolvedValue(1);
//       mockRedis.expire.mockResolvedValue(true);
//       mockPrisma.securityEvent.create.mockResolvedValue({});

//       await expect(
//         service.login(loginDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(UnauthorizedException);

//       expect(mockPrisma.securityEvent.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             eventType: 'FAILED_LOGIN',
//           }),
//         }),
//       );
//     });

//     it('should throw UnauthorizedException for non-existent user', async () => {
//       mockPrisma.customer.findFirst.mockResolvedValue(null);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 4,
//         resetAt: 0,
//       });

//       await expect(
//         service.login(loginDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should return MFA challenge when 2FA is enabled', async () => {
//       const mfaCustomer = { ...mockCustomer, twoFactorEnabled: true };
//       mockPrisma.customer.findFirst.mockResolvedValue(mfaCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 4,
//         resetAt: 0,
//       });
//       mockPasswordService.compare.mockResolvedValue(true);
//       mockTokenService.generateMfaToken.mockResolvedValue('mfa-token');

//       const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

//       expect(result.requiresMfa).toBe(true);
//       expect(result.accessToken).toBe('mfa-token');
//       expect(result.expiresIn).toBe(300);
//     });

//     it('should block login after too many failed attempts', async () => {
//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: false,
//         remaining: 0,
//         resetAt: Date.now() + 900000,
//       });

//       await expect(
//         service.login(loginDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow('Too many login attempts');
//     });

//     it('should handle login with mobile number', async () => {
//       const mobileLoginDto = {
//         identifier: '+12025551234',
//         password: 'MyStr0ng!Pass',
//       };
//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 4,
//         resetAt: 0,
//       });
//       mockPasswordService.compare.mockResolvedValue(true);
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.customer.update.mockResolvedValue(mockCustomer);
//       mockPrisma.session.update.mockResolvedValue({});
//       mockRedis.del.mockResolvedValue(1);

//       const result = await service.login(
//         mobileLoginDto,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.accessToken).toBeDefined();
//       expect(mockPrisma.customer.findFirst).toHaveBeenCalledWith(
//         expect.objectContaining({
//           where: expect.objectContaining({
//             OR: expect.arrayContaining([{ mobileNumber: '+12025551234' }]),
//           }),
//         }),
//       );
//     });
//   });

//   describe('verifyOtp', () => {
//     const verifyOtpDto = {
//       mobileNumber: '+12025551234',
//       otp: '123456',
//       purpose: 'REGISTRATION' as const,
//     };

//     const mockCustomer = {
//       id: 'customer-id',
//       fullName: 'John Doe',
//       email: 'john@example.com',
//       mobileNumber: '+12025551234',
//       mobileVerified: false,
//       emailVerified: false,
//       loyaltyPoints: 0,
//       referredBy: null,
//     };

//     it('should verify OTP and return tokens', async () => {
//       mockOtpService.verifyOtp.mockResolvedValue(true);
//       mockPrisma.customer.findUnique.mockResolvedValue(mockCustomer);
//       mockPrisma.customer.update.mockResolvedValue({
//         ...mockCustomer,
//         mobileVerified: true,
//       });
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       const result = await service.verifyOtp(
//         verifyOtpDto,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.accessToken).toBe('access-token');
//       expect(result.customer).toHaveProperty('id', 'customer-id');
//       expect(mockPrisma.customer.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: { mobileVerified: true },
//         }),
//       );
//     });

//     it('should throw BadRequestException for invalid OTP', async () => {
//       mockOtpService.verifyOtp.mockResolvedValue(false);

//       await expect(
//         service.verifyOtp(verifyOtpDto, '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should activate referral on registration verification', async () => {
//       const customerWithReferral = {
//         ...mockCustomer,
//         referredBy: 'referrer-id',
//       };

//       mockOtpService.verifyOtp.mockResolvedValue(true);
//       mockPrisma.customer.findUnique.mockResolvedValue(customerWithReferral);
//       mockPrisma.customer.update.mockResolvedValue({
//         ...customerWithReferral,
//         mobileVerified: true,
//       });
//       mockPrisma.referral.findFirst.mockResolvedValue(null);
//       mockPrisma.referral.create.mockResolvedValue({});
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       await service.verifyOtp(verifyOtpDto, '127.0.0.1', 'test-agent');

//       expect(mockPrisma.referral.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             referrerId: 'referrer-id',
//             refereeId: 'customer-id',
//             status: 'ACTIVATED',
//           }),
//         }),
//       );
//     });
//   });

//   describe('refreshTokens', () => {
//     it('should refresh tokens with valid refresh token', async () => {
//       const mockSession = {
//         id: 'session-id',
//         userId: 'customer-id',
//         refreshToken: 'valid-refresh-token',
//         expiresAt: new Date(Date.now() + 86400000), // tomorrow
//       };

//       const mockCustomer = {
//         id: 'customer-id',
//         deletedAt: null,
//       };

//       mockPrisma.session.findUnique.mockResolvedValue(mockSession);
//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'new-access-token',
//         refreshToken: 'new-refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       const result = await service.refreshTokens(
//         'valid-refresh-token',
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.accessToken).toBe('new-access-token');
//       expect(result.refreshToken).toBe('new-refresh-token');
//       expect(mockPrisma.session.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             refreshToken: 'new-refresh-token',
//           }),
//         }),
//       );
//     });

//     it('should throw UnauthorizedException for expired refresh token', async () => {
//       const expiredSession = {
//         id: 'session-id',
//         userId: 'customer-id',
//         refreshToken: 'expired-token',
//         expiresAt: new Date(Date.now() - 86400000), // yesterday
//       };

//       mockPrisma.session.findUnique.mockResolvedValue(expiredSession);

//       await expect(
//         service.refreshTokens('expired-token', '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should throw UnauthorizedException for deleted user', async () => {
//       const mockSession = {
//         id: 'session-id',
//         userId: 'customer-id',
//         refreshToken: 'valid-token',
//         expiresAt: new Date(Date.now() + 86400000),
//       };

//       mockPrisma.session.findUnique.mockResolvedValue(mockSession);
//       mockPrisma.customer.findFirst.mockResolvedValue(null);
//       mockPrisma.session.delete.mockResolvedValue({});

//       await expect(
//         service.refreshTokens('valid-token', '127.0.0.1', 'test-agent'),
//       ).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('forgotPassword', () => {
//     it('should send OTP for existing user', async () => {
//       const mockCustomer = {
//         id: 'customer-id',
//         mobileNumber: '+12025551234',
//         deletedAt: null,
//       };

//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: true,
//         remaining: 2,
//         resetAt: 0,
//       });
//       mockOtpService.sendOtp.mockResolvedValue(undefined);

//       const result = await service.forgotPassword({
//         identifier: 'john@example.com',
//       });

//       expect(result.message).toContain('If an account exists');
//       expect(mockOtpService.sendOtp).toHaveBeenCalledWith(
//         '+12025551234',
//         'PASSWORD_RESET',
//       );
//     });

//     it('should return generic message for non-existent user', async () => {
//       mockPrisma.customer.findFirst.mockResolvedValue(null);

//       const result = await service.forgotPassword({
//         identifier: 'nonexistent@example.com',
//       });

//       expect(result.message).toContain('If an account exists');
//       expect(mockOtpService.sendOtp).not.toHaveBeenCalled();
//     });

//     it('should handle rate limiting for password reset', async () => {
//       const mockCustomer = {
//         id: 'customer-id',
//         mobileNumber: '+12025551234',
//         deletedAt: null,
//       };

//       mockPrisma.customer.findFirst.mockResolvedValue(mockCustomer);
//       mockRedis.checkRateLimit.mockResolvedValue({
//         allowed: false,
//         remaining: 0,
//         resetAt: 0,
//       });

//       const result = await service.forgotPassword({
//         identifier: 'john@example.com',
//       });

//       expect(result.message).toContain('If an account exists');
//       expect(mockOtpService.sendOtp).not.toHaveBeenCalled();
//     });
//   });

//   describe('resetPassword', () => {
//     const resetDto = {
//       mobileNumber: '+12025551234',
//       otp: '123456',
//       newPassword: 'NewStr0ng!Pass',
//       confirmPassword: 'NewStr0ng!Pass',
//     };

//     it('should reset password successfully', async () => {
//       mockOtpService.verifyOtp.mockResolvedValue(true);
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         id: 'customer-id',
//         mobileNumber: '+12025551234',
//       });
//       mockPasswordService.isPasswordReused.mockResolvedValue(false);
//       mockPasswordService.hash.mockResolvedValue('new_hashed_password');
//       mockPrisma.customer.update.mockResolvedValue({});
//       mockPasswordService.addToHistory.mockResolvedValue(undefined);
//       mockSessionService.invalidateAllSessions.mockResolvedValue(3);

//       const result = await service.resetPassword(resetDto);

//       expect(result.message).toContain('Password has been reset');
//       expect(mockSessionService.invalidateAllSessions).toHaveBeenCalledWith(
//         'customer-id',
//       );
//     });

//     it('should reject reused password', async () => {
//       mockOtpService.verifyOtp.mockResolvedValue(true);
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         id: 'customer-id',
//         mobileNumber: '+12025551234',
//       });
//       mockPasswordService.isPasswordReused.mockResolvedValue(true);

//       await expect(service.resetPassword(resetDto)).rejects.toThrow(
//         BadRequestException,
//       );
//     });

//     it('should reject invalid OTP during reset', async () => {
//       mockOtpService.verifyOtp.mockResolvedValue(false);

//       await expect(service.resetPassword(resetDto)).rejects.toThrow(
//         BadRequestException,
//       );
//     });
//   });

//   describe('logout', () => {
//     it('should invalidate session on logout', async () => {
//       mockSessionService.invalidateSession.mockResolvedValue(undefined);

//       await service.logout('user-id', 'session-id');

//       expect(mockSessionService.invalidateSession).toHaveBeenCalledWith(
//         'session-id',
//       );
//     });
//   });

//   describe('logoutAllSessions', () => {
//     it('should invalidate all sessions', async () => {
//       mockSessionService.invalidateAllSessions.mockResolvedValue(5);

//       const result = await service.logoutAllSessions('user-id');

//       expect(result.sessionsRevoked).toBe(5);
//     });
//   });

//   describe('handleGoogleOAuth', () => {
//     const googleProfile = {
//       providerId: 'google-123',
//       email: 'john@gmail.com',
//       name: 'John Doe',
//       profilePhoto: 'https://photo.url',
//     };

//     it('should login existing OAuth user', async () => {
//       const existingOAuth = {
//         customer: {
//           id: 'customer-id',
//           fullName: 'John Doe',
//           email: 'john@gmail.com',
//           mobileNumber: '+12025551234',
//           loyaltyPoints: 100,
//           profilePhotoUrl: null,
//           mobileVerified: true,
//           emailVerified: true,
//         },
//       };

//       mockPrisma.oAuthAccount.findUnique.mockResolvedValue(existingOAuth);
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       const result = await service.handleGoogleOAuth(
//         googleProfile,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.isNewUser).toBe(false);
//       expect(result.accessToken).toBe('access-token');
//     });

//     it('should link Google to existing email account', async () => {
//       const existingCustomer = {
//         id: 'customer-id',
//         fullName: 'John Doe',
//         email: 'john@gmail.com',
//         mobileNumber: '+12025551234',
//         loyaltyPoints: 0,
//         profilePhotoUrl: null,
//         mobileVerified: true,
//         emailVerified: true,
//       };

//       mockPrisma.oAuthAccount.findUnique.mockResolvedValue(null);
//       mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
//       mockPrisma.oAuthAccount.create.mockResolvedValue({});
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       const result = await service.handleGoogleOAuth(
//         googleProfile,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.isNewUser).toBe(false);
//       expect(mockPrisma.oAuthAccount.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             provider: 'google',
//             providerId: 'google-123',
//           }),
//         }),
//       );
//     });

//     it('should create new user for new Google account', async () => {
//       mockPrisma.oAuthAccount.findUnique.mockResolvedValue(null);
//       mockPrisma.customer.findUnique
//         .mockResolvedValueOnce(null) // email check
//         .mockResolvedValueOnce(null); // referral code uniqueness
//       mockPrisma.customer.create.mockResolvedValue({
//         id: 'new-customer-id',
//         fullName: 'John Doe',
//         email: 'john@gmail.com',
//         mobileNumber: '',
//         loyaltyPoints: 0,
//         profilePhotoUrl: 'https://photo.url',
//         mobileVerified: false,
//         emailVerified: true,
//       });
//       mockPrisma.oAuthAccount.create.mockResolvedValue({});
//       mockSessionService.enforceSessionLimit.mockResolvedValue(undefined);
//       mockSessionService.createSession.mockResolvedValue({ id: 'session-id' });
//       mockTokenService.generateTokenPair.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//       });
//       mockPrisma.session.update.mockResolvedValue({});

//       const result = await service.handleGoogleOAuth(
//         googleProfile,
//         '127.0.0.1',
//         'test-agent',
//       );

//       expect(result.isNewUser).toBe(true);
//       expect(mockPrisma.customer.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             email: 'john@gmail.com',
//             emailVerified: true,
//           }),
//         }),
//       );
//     });
//   });
// });
