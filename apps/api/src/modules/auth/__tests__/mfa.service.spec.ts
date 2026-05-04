// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException } from '@nestjs/common';
// import { authenticator } from 'otplib';
// import { MfaService } from '../mfa.service';
// import { PrismaService } from '../../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

// jest.mock('otplib');
// jest.mock('qrcode', () => ({
//   toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRCode'),
// }));

// describe('MfaService', () => {
//   let service: MfaService;
//   let prisma: jest.Mocked<PrismaService>;

//   const mockPrisma = {
//     customer: {
//       findUnique: jest.fn(),
//       update: jest.fn(),
//     },
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
//         MfaService,
//         { provide: PrismaService, useValue: mockPrisma },
//         { provide: WinstonLoggerService, useValue: mockLogger },
//       ],
//     }).compile();

//     service = module.get<MfaService>(MfaService);
//     prisma = module.get(PrismaService);

//     jest.clearAllMocks();
//   });

//   describe('setupMfa', () => {
//     it('should generate secret, QR code and backup codes', async () => {
//       (authenticator.generateSecret as jest.Mock).mockReturnValue('MOCK_SECRET');
//       (authenticator.keyuri as jest.Mock).mockReturnValue('otpauth://...');
//       mockPrisma.customer.update.mockResolvedValue({});

//       const result = await service.setupMfa('user-id', 'user@example.com');

//       expect(result.secret).toBe('MOCK_SECRET');
//       expect(result.qrCodeUrl).toContain('data:image');
//       expect(result.backupCodes).toHaveLength(10);
//       expect(result.backupCodes[0]).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
//       expect(mockPrisma.customer.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             twoFactorSecret: 'MOCK_SECRET',
//           }),
//         }),
//       );
//     });
//   });

//   describe('verifyAndEnableMfa', () => {
//     it('should enable MFA with valid code', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(true);
//       mockPrisma.customer.update.mockResolvedValue({});

//       const result = await service.verifyAndEnableMfa('user-id', '123456');

//       expect(result.enabled).toBe(true);
//       expect(mockPrisma.customer.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: { twoFactorEnabled: true },
//         }),
//       );
//     });

//     it('should reject invalid verification code', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(false);

//       await expect(
//         service.verifyAndEnableMfa('user-id', 'invalid'),
//       ).rejects.toThrow(BadRequestException);
//     });

//     it('should throw if MFA setup was not initiated', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorSecret: null,
//       });

//       await expect(
//         service.verifyAndEnableMfa('user-id', '123456'),
//       ).rejects.toThrow('MFA setup not initiated');
//     });
//   });

//   describe('verifyMfaCode', () => {
//     it('should return true for valid code', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorEnabled: true,
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(true);

//       const result = await service.verifyMfaCode('user-id', '123456');

//       expect(result).toBe(true);
//     });

//     it('should return false for invalid code', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorEnabled: true,
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(false);

//       const result = await service.verifyMfaCode('user-id', 'invalid');

//       expect(result).toBe(false);
//     });

//     it('should throw if MFA is not enabled', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorEnabled: false,
//         twoFactorSecret: null,
//       });

//       await expect(
//         service.verifyMfaCode('user-id', '123456'),
//       ).rejects.toThrow('MFA is not enabled');
//     });
//   });

//   describe('disableMfa', () => {
//     it('should disable MFA with valid code', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorEnabled: true,
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(true);
//       mockPrisma.customer.update.mockResolvedValue({});

//       await service.disableMfa('user-id', '123456');

//       expect(mockPrisma.customer.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             twoFactorEnabled: false,
//             twoFactorSecret: null,
//           }),
//         }),
//       );
//     });

//     it('should reject if code is invalid', async () => {
//       mockPrisma.customer.findUnique.mockResolvedValue({
//         twoFactorEnabled: true,
//         twoFactorSecret: 'MOCK_SECRET',
//       });
//       (authenticator.verify as jest.Mock).mockReturnValue(false);

//       await expect(
//         service.disableMfa('user-id', 'invalid'),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });
// });