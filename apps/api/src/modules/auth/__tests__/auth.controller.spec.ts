// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { AuthController } from '../auth.controller';
// import { AuthService } from '../auth.service';
// import { MfaService } from '../mfa.service';
// import { SessionService } from '../session.service';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// describe('AuthController', () => {
//   let app: INestApplication;
//   let authService: jest.Mocked<AuthService>;

//   const mockAuthService = {
//     register: jest.fn(),
//     verifyOtp: jest.fn(),
//     login: jest.fn(),
//     refreshTokens: jest.fn(),
//     logout: jest.fn(),
//     logoutAllSessions: jest.fn(),
//     forgotPassword: jest.fn(),
//     resetPassword: jest.fn(),
//     handleGoogleOAuth: jest.fn(),
//   };

//   const mockMfaService = {
//     setupMfa: jest.fn(),
//     verifyAndEnableMfa: jest.fn(),
//     disableMfa: jest.fn(),
//   };

//   const mockSessionService = {
//     getActiveSessions: jest.fn(),
//     invalidateSession: jest.fn(),
//   };

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         { provide: AuthService, useValue: mockAuthService },
//         { provide: MfaService, useValue: mockMfaService },
//         { provide: SessionService, useValue: mockSessionService },
//       ],
//     })
//       .overrideGuard(JwtAuthGuard)
//       .useValue({ canActivate: () => true })
//       .compile();

//     app = module.createNestApplication();
//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//         forbidNonWhitelisted: true,
//         transform: true,
//       }),
//     );

//     await app.init();

//     authService = module.get(AuthService);
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('POST /auth/register', () => {
//     const validRegisterDto = {
//       fullName: 'John Doe',
//       mobileNumber: '+12025551234',
//       email: 'john@example.com',
//       password: 'MyStr0ng!Pass',
//       confirmPassword: 'MyStr0ng!Pass',
//     };

//     it('should register successfully with valid data', async () => {
//       mockAuthService.register.mockResolvedValue({
//         message: 'Registration successful',
//         requiresOtp: true,
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/register')
//         .send(validRegisterDto)
//         .expect(201);

//       expect(response.body.requiresOtp).toBe(true);
//     });

//     it('should reject registration with missing fields', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/register')
//         .send({ email: 'john@example.com' })
//         .expect(400);
//     });

//     it('should reject registration with invalid email', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/register')
//         .send({ ...validRegisterDto, email: 'not-an-email' })
//         .expect(400);
//     });

//     it('should reject registration with weak password', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/register')
//         .send({ ...validRegisterDto, password: 'weak', confirmPassword: 'weak' })
//         .expect(400);
//     });

//     it('should reject registration with invalid phone', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/register')
//         .send({ ...validRegisterDto, mobileNumber: '123' })
//         .expect(400);
//     });
//   });

//   describe('POST /auth/login', () => {
//     it('should login successfully', async () => {
//       mockAuthService.login.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//         customer: { id: 'customer-id', fullName: 'John Doe' },
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/login')
//         .send({ identifier: 'john@example.com', password: 'MyStr0ng!Pass' })
//         .expect(200);

//       expect(response.body.accessToken).toBe('access-token');
//       expect(response.headers['set-cookie']).toBeDefined();
//     });

//     it('should return MFA challenge when required', async () => {
//       mockAuthService.login.mockResolvedValue({
//         accessToken: 'mfa-token',
//         refreshToken: '',
//         expiresIn: 300,
//         customer: { id: 'customer-id' },
//         requiresMfa: true,
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/login')
//         .send({ identifier: 'john@example.com', password: 'MyStr0ng!Pass' })
//         .expect(200);

//       expect(response.body.requiresMfa).toBe(true);
//     });

//     it('should reject login with missing fields', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/login')
//         .send({ identifier: 'john@example.com' })
//         .expect(400);
//     });
//   });

//   describe('POST /auth/verify-otp', () => {
//     it('should verify OTP successfully', async () => {
//       mockAuthService.verifyOtp.mockResolvedValue({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         expiresIn: 900,
//         customer: { id: 'customer-id' },
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/verify-otp')
//         .send({
//           mobileNumber: '+12025551234',
//           otp: '123456',
//           purpose: 'REGISTRATION',
//         })
//         .expect(200);

//       expect(response.body.accessToken).toBe('access-token');
//     });

//     it('should reject invalid OTP format', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/verify-otp')
//         .send({
//           mobileNumber: '+12025551234',
//           otp: '12345', // 5 digits — invalid
//           purpose: 'REGISTRATION',
//         })
//         .expect(400);
//     });

//     it('should reject invalid purpose', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/verify-otp')
//         .send({
//           mobileNumber: '+12025551234',
//           otp: '123456',
//           purpose: 'INVALID_PURPOSE',
//         })
//         .expect(400);
//     });
//   });

//   describe('POST /auth/forgot-password', () => {
//     it('should accept forgot password request', async () => {
//       mockAuthService.forgotPassword.mockResolvedValue({
//         message: 'If an account exists, a password reset link has been sent.',
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/forgot-password')
//         .send({ identifier: 'john@example.com' })
//         .expect(200);

//       expect(response.body.message).toContain('If an account exists');
//     });
//   });

//   describe('POST /auth/reset-password', () => {
//     it('should reset password successfully', async () => {
//       mockAuthService.resetPassword.mockResolvedValue({
//         message: 'Password has been reset successfully.',
//       });

//       const response = await request(app.getHttpServer())
//         .post('/auth/reset-password')
//         .send({
//           mobileNumber: '+12025551234',
//           otp: '123456',
//           newPassword: 'NewStr0ng!Pass',
//           confirmPassword: 'NewStr0ng!Pass',
//         })
//         .expect(200);

//       expect(response.body.message).toContain('reset successfully');
//     });

//     it('should reject weak new password', async () => {
//       await request(app.getHttpServer())
//         .post('/auth/reset-password')
//         .send({
//           mobileNumber: '+12025551234',
//           otp: '123456',
//           newPassword: 'weak',
//           confirmPassword: 'weak',
//         })
//         .expect(400);
//     });
//   });
// });