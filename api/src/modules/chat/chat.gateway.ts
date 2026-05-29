import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TokenService } from '../auth/token.service';
import { RedisService } from '../../core/redis/redis.service';
import { ChatService } from './chat.service';
import { MetricsService } from '../../core/metrics/metrics.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat', cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly redis: RedisService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
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

  @SubscribeMessage('conversation.join')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const user = await this.authenticate(client);
    await this.chatService.assertParticipant(payload.conversationId, user.id);
    await client.join(`conversation:${payload.conversationId}`);
    return { ok: true };
  }

  @SubscribeMessage('conversation.leave')
  async leaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    await client.leave(`conversation:${payload.conversationId}`);
    return { ok: true };
  }

  @SubscribeMessage('message.send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; body: string },
  ) {
    const user = await this.authenticate(client);
    const message = await this.chatService.sendMessage(
      payload.conversationId,
      user.id,
      user.role,
      payload.body,
    );
    this.server.to(`conversation:${payload.conversationId}`).emit('message.created', message);
    return message;
  }

  @SubscribeMessage('typing.start')
  async typingStart(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }) {
    const user = await this.authenticate(client);
    await this.chatService.setTyping(payload.conversationId, user.id, true);
    this.server.to(`conversation:${payload.conversationId}`).emit('typing.start', { userId: user.id });
  }

  @SubscribeMessage('typing.stop')
  async typingStop(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }) {
    const user = await this.authenticate(client);
    await this.chatService.setTyping(payload.conversationId, user.id, false);
    this.server.to(`conversation:${payload.conversationId}`).emit('typing.stop', { userId: user.id });
  }

  emitMessageEdited(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.edited', payload);
  }

  emitMessageDeleted(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.deleted', payload);
  }

  emitMessageRead(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.read', payload);
  }

  private async authenticate(client: Socket): Promise<{ id: string; role: string }> {
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
    return { id: user.id, role: payload.role };
  }
}
