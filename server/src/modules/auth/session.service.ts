import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { SESSION } from '@glow-fix/utils';

import { PrismaService } from '../../core/prisma/prisma.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createSession(
    userId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ id: string }> {
    const parsed = new UAParser(userAgent);
    const browser = parsed.getBrowser();
    const os = parsed.getOS();
    const device = parsed.getDevice();

    const deviceInfo = [
      device.type ?? 'desktop',
      browser.name ? `${browser.name} ${browser.version ?? ''}`.trim() : null,
      os.name ? `${os.name} ${os.version ?? ''}`.trim() : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const expiresAt = new Date(
      Date.now() + SESSION.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000,
    );

    // Store hashed refresh token — never store plain tokens in DB
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt,
        lastUsedAt: new Date(),
      },
    });

    return { id: session.id };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    try {
      await this.prisma.userSession.delete({ where: { id: sessionId } });
    } catch {
      this.logger.debug(
        `Session ${sessionId} not found for deletion`,
        'SessionService',
      );
    }
  }

  async invalidateAllSessions(userId: string): Promise<number> {
    const result = await this.prisma.userSession.deleteMany({ where: { userId } });
    return result.count;
  }

  async invalidateByTokenHash(refreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.userSession.deleteMany({ where: { tokenHash } });
  }

  async findByTokenHash(refreshToken: string): Promise<{ id: string; userId: string } | null> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    return this.prisma.userSession.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true },
    });
  }

  async enforceSessionLimit(userId: string): Promise<void> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'asc' },
    });

    if (sessions.length >= SESSION.MAX_CONCURRENT_DEVICES) {
      const sessionsToRemove = sessions.slice(
        0,
        sessions.length - SESSION.MAX_CONCURRENT_DEVICES + 1,
      );

      await this.prisma.userSession.deleteMany({
        where: { id: { in: sessionsToRemove.map((s) => s.id) } },
      });

      this.logger.debug(
        `Removed ${sessionsToRemove.length} old sessions for user ${userId}`,
        'SessionService',
      );
    }
  }

  async getActiveSessions(userId: string): Promise<
    {
      id: string;
      deviceInfo: string | null;
      ipAddress: string | null;
      lastUsedAt: Date;
      createdAt: Date;
    }[]
  > {
    return this.prisma.userSession.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async updateActivity(sessionId: string): Promise<void> {
    await this.prisma.userSession
      .update({
        where: { id: sessionId },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {
        // Silent fail — non-critical
      });
  }
}
