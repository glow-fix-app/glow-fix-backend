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
import { MetricsService } from '../../core/metrics/metrics.service';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: true, credentials: true } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const user = await this.authenticate(client);
    await client.join(`user:${user.id}`);
    this.metrics.websocketConnections.inc();
  }

  handleDisconnect(): void {
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

    const session = await this.prisma.userSession.findUnique({
      where: { id: payload.sessionId },
      select: { id: true },
    });

    if (!session) {
      throw new Error('Session expired');
    }

    return user;
  }
}
