import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from '../auth/token.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { MetricsService } from '../../core/metrics/metrics.service';

const notificationAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: notificationAllowedOrigins.length > 0 ? notificationAllowedOrigins : false,
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly authenticatedSocketIds = new Set<string>();

  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly metrics: MetricsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.authenticate(client);
      await client.join(`user:${user.id}`);
      this.authenticatedSocketIds.add(client.id);
      this.metrics.websocketConnections.inc();
    } catch (error) {
      this.logger.warn(
        `Socket authentication failed: ${(error as Error).message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    if (!this.authenticatedSocketIds.delete(client.id)) {
      return;
    }
    this.metrics.websocketConnections.dec();
  }

  emitNotificationCreated(userId: string, payload: unknown): void {
    this.server.to(`user:${userId}`).emit('notification.created', payload);
  }

  emitNotificationRead(userId: string, payload: unknown): void {
    this.server.to(`user:${userId}`).emit('notification.read', payload);
  }

  emitNotificationReadAll(userId: string, payload: unknown): void {
    this.server.to(`user:${userId}`).emit('notification.read_all', payload);
  }

  emitNotificationDeleted(userId: string, payload: unknown): void {
    this.server.to(`user:${userId}`).emit('notification.deleted', payload);
  }

  private async authenticate(client: Socket): Promise<{ id: string }> {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new Error('Missing JWT token');
    }

    const payload = this.tokenService.verifyAccessToken(token);
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, isActive: true, deletedAt: null },
      select: { id: true },
    });

    if (!user) {
      throw new Error('Unauthorized');
    }

    const sessionKey = `ws:session:${payload.sessionId}`;
    const cachedSession = await this.redis.get(sessionKey);

    if (!cachedSession) {
      const session = await this.prisma.userSession.findUnique({
        where: { id: payload.sessionId },
        select: { id: true, expiresAt: true },
      });

      if (!session || session.expiresAt <= new Date()) {
        throw new Error('Session expired');
      }

      await this.redis.set(sessionKey, '1', 300); // Cache for 5 minutes
    }

    return user;
  }
}
