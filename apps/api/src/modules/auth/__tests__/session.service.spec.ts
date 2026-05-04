// import { Test, TestingModule } from '@nestjs/testing';
// import { SessionService } from '../session.service';
// import { PrismaService } from '../../../core/prisma/prisma.service';
// import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

// describe('SessionService', () => {
//   let service: SessionService;
//   let prisma: jest.Mocked<PrismaService>;

//   const mockPrisma = {
//     session: {
//       create: jest.fn(),
//       findMany: jest.fn(),
//       delete: jest.fn(),
//       deleteMany: jest.fn(),
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
//         SessionService,
//         { provide: PrismaService, useValue: mockPrisma },
//         { provide: WinstonLoggerService, useValue: mockLogger },
//       ],
//     }).compile();

//     service = module.get<SessionService>(SessionService);
//     prisma = module.get(PrismaService);

//     jest.clearAllMocks();
//   });

//   describe('createSession', () => {
//     it('should create a session with parsed user agent', async () => {
//       mockPrisma.session.create.mockResolvedValue({
//         id: 'session-id',
//       });

//       const result = await service.createSession(
//         'user-id',
//         'CUSTOMER',
//         '127.0.0.1',
//         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0',
//       );

//       expect(result.id).toBe('session-id');
//       expect(mockPrisma.session.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           data: expect.objectContaining({
//             userId: 'user-id',
//             userType: 'CUSTOMER',
//             ipAddress: '127.0.0.1',
//             browser: expect.stringContaining('Chrome'),
//           }),
//         }),
//       );
//     });
//   });

//   describe('enforceSessionLimit', () => {
//     it('should remove oldest sessions when limit exceeded', async () => {
//       const sessions = Array.from({ length: 6 }, (_, i) => ({
//         id: `session-${i}`,
//         lastActivityAt: new Date(Date.now() - (6 - i) * 3600000),
//       }));

//       mockPrisma.session.findMany.mockResolvedValue(sessions);
//       mockPrisma.session.deleteMany.mockResolvedValue({ count: 2 });

//       await service.enforceSessionLimit('user-id');

//       expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith(
//         expect.objectContaining({
//           where: expect.objectContaining({
//             id: expect.objectContaining({
//               in: expect.arrayContaining(['session-0', 'session-1']),
//             }),
//           }),
//         }),
//       );
//     });

//     it('should not remove sessions when under limit', async () => {
//       const sessions = Array.from({ length: 3 }, (_, i) => ({
//         id: `session-${i}`,
//         lastActivityAt: new Date(),
//       }));

//       mockPrisma.session.findMany.mockResolvedValue(sessions);

//       await service.enforceSessionLimit('user-id');

//       expect(mockPrisma.session.deleteMany).not.toHaveBeenCalled();
//     });
//   });

//   describe('invalidateSession', () => {
//     it('should delete specified session', async () => {
//       mockPrisma.session.delete.mockResolvedValue({});

//       await service.invalidateSession('session-id');

//       expect(mockPrisma.session.delete).toHaveBeenCalledWith({
//         where: { id: 'session-id' },
//       });
//     });

//     it('should handle non-existent session gracefully', async () => {
//       mockPrisma.session.delete.mockRejectedValue(new Error('Not found'));

//       await expect(
//         service.invalidateSession('non-existent'),
//       ).resolves.not.toThrow();
//     });
//   });

//   describe('invalidateAllSessions', () => {
//     it('should delete all sessions for user', async () => {
//       mockPrisma.session.deleteMany.mockResolvedValue({ count: 4 });

//       const result = await service.invalidateAllSessions('user-id');

//       expect(result).toBe(4);
//       expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
//         where: { userId: 'user-id' },
//       });
//     });
//   });

//   describe('getActiveSessions', () => {
//     it('should return non-expired sessions', async () => {
//       const sessions = [
//         {
//           id: 'session-1',
//           deviceType: 'desktop',
//           browser: 'Chrome 120',
//           os: 'macOS 14',
//           ipAddress: '127.0.0.1',
//           lastActivityAt: new Date(),
//           createdAt: new Date(),
//         },
//       ];

//       mockPrisma.session.findMany.mockResolvedValue(sessions);

//       const result = await service.getActiveSessions('user-id');

//       expect(result).toHaveLength(1);
//       expect(mockPrisma.session.findMany).toHaveBeenCalledWith(
//         expect.objectContaining({
//           where: expect.objectContaining({
//             userId: 'user-id',
//             expiresAt: expect.objectContaining({
//               gt: expect.any(Date),
//             }),
//           }),
//         }),
//       );
//     });
//   });

//   describe('updateActivity', () => {
//     it('should update lastActivityAt', async () => {
//       mockPrisma.session.update.mockResolvedValue({});

//       await service.updateActivity('session-id');

//       expect(mockPrisma.session.update).toHaveBeenCalledWith(
//         expect.objectContaining({
//           where: { id: 'session-id' },
//           data: expect.objectContaining({
//             lastActivityAt: expect.any(Date),
//           }),
//         }),
//       );
//     });

//     it('should fail silently on error', async () => {
//       mockPrisma.session.update.mockRejectedValue(new Error('Not found'));

//       await expect(
//         service.updateActivity('non-existent'),
//       ).resolves.not.toThrow();
//     });
//   });
// });