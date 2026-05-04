// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { OtpService } from '../otp.service';
// import { RedisService } from '../../../core/redis/redis.service';
// import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

// describe('OtpService', () => {
//   let service: OtpService;
//   let redis: jest.Mocked<RedisService>;

//   const mockRedis = {
//     get: jest.fn(),
//     set: jest.fn(),
//     setJson: jest.fn(),
//     getJson: jest.fn(),
//     del: jest.fn(),
//     incr: jest.fn(),
//     expire: jest.fn(),
//   };

//   const mockConfig = {
//     get: jest.fn((key: string) => {
//       const configs: Record<string, string> = {
//         'app.nodeEnv': 'test',
//         'twilio.accountSid': 'test-sid',
//         'twilio.authToken': 'test-token',
//         'twilio.phoneNumber': '+10000000000',
//       };
//       return configs[key];
//     }),
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
//         OtpService,
//         { provide: RedisService, useValue: mockRedis },
//         { provide: ConfigService, useValue: mockConfig },
//         { provide: WinstonLoggerService, useValue: mockLogger },
//       ],
//     }).compile();

//     service = module.get<OtpService>(OtpService);
//     redis = module.get(RedisService);

//     jest.clearAllMocks();
//   });

//   describe('sendOtp', () => {
//     it('should generate and store OTP successfully', async () => {
//       mockRedis.get.mockResolvedValue(null); // no resend count
//       mockRedis.setJson.mockResolvedValue(undefined);
//       mockRedis.incr.mockResolvedValue(1);
//       mockRedis.expire.mockResolvedValue(true);

//       await service.sendOtp('+12025551234', 'REGISTRATION');

//       expect(mockRedis.setJson).toHaveBeenCalledWith(
//         expect.stringContaining('otp:REGISTRATION'),
//         expect.objectContaining({
//           otp: expect.stringMatching(/^\d{6}$/),
//           attempts: 0,
//         }),
//         600, // 10 minutes
//       );
//     });

//     it('should reject when max resend attempts reached', async () => {
//       mockRedis.get.mockResolvedValue('3'); // max attempts

//       await expect(
//         service.sendOtp('+12025551234', 'REGISTRATION'),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should log OTP in development mode', async () => {
//       mockRedis.get.mockResolvedValue(null);
//       mockRedis.setJson.mockResolvedValue(undefined);
//       mockRedis.incr.mockResolvedValue(1);
//       mockRedis.expire.mockResolvedValue(true);

//       await service.sendOtp('+12025551234', 'LOGIN');

//       expect(mockLogger.debug).toHaveBeenCalledWith(
//         expect.stringContaining('[DEV] OTP for'),
//         'OtpService',
//       );
//     });
//   });

//   describe('verifyOtp', () => {
//     it('should verify valid OTP', async () => {
//       mockRedis.get.mockResolvedValue(null); // no attempts
//       mockRedis.getJson.mockResolvedValue({
//         otp: '123456',
//         attempts: 0,
//         createdAt: new Date().toISOString(),
//       });
//       mockRedis.del.mockResolvedValue(1);

//       const result = await service.verifyOtp('+12025551234', '123456', 'REGISTRATION');

//       expect(result).toBe(true);
//       expect(mockRedis.del).toHaveBeenCalled();
//     });

//     it('should reject invalid OTP and increment attempts', async () => {
//       mockRedis.get
//         .mockResolvedValueOnce(null) // attempts check
//         .mockResolvedValueOnce('1'); // after increment

//       mockRedis.getJson.mockResolvedValue({
//         otp: '123456',
//         attempts: 0,
//         createdAt: new Date().toISOString(),
//       });
//       mockRedis.incr.mockResolvedValue(1);
//       mockRedis.expire.mockResolvedValue(true);

//       await expect(
//         service.verifyOtp('+12025551234', '999999', 'REGISTRATION'),
//       ).rejects.toThrow(BadRequestException);

//       expect(mockRedis.incr).toHaveBeenCalled();
//     });

//     it('should reject after max attempts reached', async () => {
//       mockRedis.get.mockResolvedValue('5'); // max attempts
//       mockRedis.del.mockResolvedValue(1);

//       await expect(
//         service.verifyOtp('+12025551234', '123456', 'REGISTRATION'),
//       ).rejects.toThrow('Too many verification attempts');
//     });

//     it('should reject expired OTP', async () => {
//       mockRedis.get.mockResolvedValue(null); // no attempts
//       mockRedis.getJson.mockResolvedValue(null); // OTP expired

//       await expect(
//         service.verifyOtp('+12025551234', '123456', 'REGISTRATION'),
//       ).rejects.toThrow('OTP has expired');
//     });
//   });
// });