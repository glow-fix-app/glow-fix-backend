/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from '../session.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    userSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
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
        SessionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WinstonLoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('createSession', () => {
    const userId = 'user-id';
    const refreshToken = 'test-refresh-token';
    const ipAddress = '127.0.0.1';
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0';

    it('should create a session with parsed device info and return id', async () => {
      mockPrisma.userSession.create.mockResolvedValue({ id: 'session-id' });

      const result = await service.createSession(userId, refreshToken, ipAddress, userAgent);

      expect(result.id).toBe('session-id');
      expect(mockPrisma.userSession.create).toHaveBeenCalledTimes(1);
      const data = mockPrisma.userSession.create.mock.calls[0][0].data;
      expect(data.userId).toBe(userId);
      expect(data.ipAddress).toBe(ipAddress);
      expect(data.userAgent).toBe(userAgent);
      expect(data.deviceInfo).toContain('desktop');
      expect(data.tokenHash).toBeDefined();
      expect(data.expiresAt).toBeInstanceOf(Date);
      expect(data.lastUsedAt).toBeInstanceOf(Date);
    });
  });

  describe('invalidateSession', () => {
    it('should delete session by id', async () => {
      mockPrisma.userSession.delete.mockResolvedValue({} as any);

      await service.invalidateSession('session-id');

      expect(mockPrisma.userSession.delete).toHaveBeenCalledWith({
        where: { id: 'session-id' },
      });
    });

    it('should handle non-existent session gracefully', async () => {
      mockPrisma.userSession.delete.mockRejectedValue(new Error('Not found'));

      await expect(service.invalidateSession('non-existent')).resolves.not.toThrow();
    });
  });

  describe('invalidateAllSessions', () => {
    it('should delete all sessions for user and return count', async () => {
      mockPrisma.userSession.deleteMany.mockResolvedValue({ count: 4 });

      const result = await service.invalidateAllSessions('user-id');

      expect(result).toBe(4);
      expect(mockPrisma.userSession.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
    });

    it('should return 0 when no sessions exist', async () => {
      mockPrisma.userSession.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.invalidateAllSessions('user-id');

      expect(result).toBe(0);
    });
  });

  describe('invalidateByTokenHash', () => {
    it('should delete sessions by hashed refresh token', async () => {
      mockPrisma.userSession.deleteMany.mockResolvedValue({ count: 1 });

      await service.invalidateByTokenHash('some-refresh-token');

      expect(mockPrisma.userSession.deleteMany).toHaveBeenCalledTimes(1);
      const arg = mockPrisma.userSession.deleteMany.mock.calls[0][0];
      expect(arg.where.tokenHash).toBeDefined();
      expect(typeof arg.where.tokenHash).toBe('string');
    });
  });

  describe('findByTokenHash', () => {
    it('should find session by hashed refresh token', async () => {
      const mockSession = { id: 'session-id', userId: 'user-id' };
      mockPrisma.userSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.findByTokenHash('some-refresh-token');

      expect(result).toEqual(mockSession);
      const arg = mockPrisma.userSession.findUnique.mock.calls[0][0];
      expect(arg.where.tokenHash).toBeDefined();
      expect(arg.select).toEqual({ id: true, userId: true });
    });

    it('should return null when no session found', async () => {
      mockPrisma.userSession.findUnique.mockResolvedValue(null);

      const result = await service.findByTokenHash('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('enforceSessionLimit', () => {
    it('should remove oldest sessions when limit exceeded', async () => {
      const sessions = Array.from({ length: 6 }, (_, i) => ({
        id: `session-${i}`,
        lastUsedAt: new Date(Date.now() - (6 - i) * 3600000),
      }));
      mockPrisma.userSession.findMany.mockResolvedValue(sessions);
      mockPrisma.userSession.deleteMany.mockResolvedValue({ count: 2 });

      await service.enforceSessionLimit('user-id');

      expect(mockPrisma.userSession.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: expect.objectContaining({
              in: expect.arrayContaining(['session-0', 'session-1']),
            }),
          }),
        }),
      );
    });

    it('should not remove sessions when under limit', async () => {
      const sessions = Array.from({ length: 3 }, (_, i) => ({
        id: `session-${i}`,
        lastUsedAt: new Date(),
      }));
      mockPrisma.userSession.findMany.mockResolvedValue(sessions);

      await service.enforceSessionLimit('user-id');

      expect(mockPrisma.userSession.deleteMany).not.toHaveBeenCalled();
    });

    it('should remove oldest session when exactly at limit', async () => {
      const sessions = Array.from({ length: 5 }, (_, i) => ({
        id: `session-${i}`,
        lastUsedAt: new Date(Date.now() - (5 - i) * 3600000),
      }));
      mockPrisma.userSession.findMany.mockResolvedValue(sessions);
      mockPrisma.userSession.deleteMany.mockResolvedValue({ count: 1 });

      await service.enforceSessionLimit('user-id');

      expect(mockPrisma.userSession.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: expect.objectContaining({
              in: ['session-0'],
            }),
          }),
        }),
      );
    });
  });

  describe('getActiveSessions', () => {
    it('should return non-expired sessions ordered by lastUsedAt desc', async () => {
      const sessions = [
        {
          id: 'session-1',
          deviceInfo: 'desktop | Chrome 120 | Windows 10',
          ipAddress: '127.0.0.1',
          lastUsedAt: new Date(),
          createdAt: new Date(),
        },
      ];
      mockPrisma.userSession.findMany.mockResolvedValue(sessions);

      const result = await service.getActiveSessions('user-id');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('session-1');
      expect(mockPrisma.userSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-id',
            expiresAt: expect.objectContaining({ gt: expect.any(Date) }),
          }),
          orderBy: { lastUsedAt: 'desc' },
        }),
      );
    });

    it('should return empty array when no active sessions', async () => {
      mockPrisma.userSession.findMany.mockResolvedValue([]);

      const result = await service.getActiveSessions('user-id');

      expect(result).toEqual([]);
    });
  });

  describe('updateActivity', () => {
    it('should update lastUsedAt for session', async () => {
      mockPrisma.userSession.update.mockResolvedValue({} as any);

      await service.updateActivity('session-id');

      expect(mockPrisma.userSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-id' },
          data: expect.objectContaining({
            lastUsedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('should fail silently on error', async () => {
      mockPrisma.userSession.update.mockRejectedValue(new Error('Not found'));

      await expect(service.updateActivity('non-existent')).resolves.not.toThrow();
    });
  });
});
