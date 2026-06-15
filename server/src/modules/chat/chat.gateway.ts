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

const chatAllowedOrigins = (() => {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
})();

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: chatAllowedOrigins,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly authenticatedSocketIds = new Set<string>();
  private readonly socketUsers = new Map<string, { id: string; role: string }>();
  private readonly typingConversationsBySocket = new Map<string, Set<string>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly redis: RedisService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly metrics: MetricsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.authenticate(client);
      await client.join(`user:${user.id}`);
      this.authenticatedSocketIds.add(client.id);
      this.socketUsers.set(client.id, user);
      client.data.userId = user.id;
      client.data.userRole = user.role;
      this.metrics.websocketConnections.inc();
    } catch (error) {
      this.logger.warn(`Socket authentication failed: ${(error as Error).message}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.clearTypingState(client);
    this.socketUsers.delete(client.id);
    this.typingConversationsBySocket.delete(client.id);

    if (!this.authenticatedSocketIds.delete(client.id)) {
      return;
    }
    this.metrics.websocketConnections.dec();
  }

  @SubscribeMessage('conversation.join')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const user = await this.authenticateSocket(client);
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }
    await this.chatService.assertParticipant(payload.conversationId, user.id);
    await client.join(`conversation:${payload.conversationId}`);
    return { ok: true };
  }

  @SubscribeMessage('conversation.leave')
  async leaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const user = await this.authenticateSocket(client);
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }
    await this.chatService.assertParticipant(payload.conversationId, user.id);
    await this.chatService.setTyping(payload.conversationId, user.id, false);
    this.untrackTypingConversation(client.id, payload.conversationId);
    await client.leave(`conversation:${payload.conversationId}`);
    return { ok: true };
  }

  @SubscribeMessage('message.send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; body: string },
  ) {
    const user = await this.authenticateSocket(client);
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }

    return this.chatService.sendMessage(payload.conversationId, user.id, user.role, payload.body);
  }

  @SubscribeMessage('message.delivered')
  async messageDelivered(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string },
  ) {
    const user = await this.authenticateSocket(client);
    if (!user) return { ok: false, error: 'Unauthorized' };
    await this.chatService.markMessageDelivered(payload.messageId, user.id);
    return { ok: true };
  }

  @SubscribeMessage('message.read')
  async messageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string },
  ) {
    const user = await this.authenticateSocket(client);
    if (!user) return { ok: false, error: 'Unauthorized' };
    await this.chatService.markMessageReadStatus(payload.messageId, user.id);
    return { ok: true };
  }

  @SubscribeMessage('typing.start')
  async typingStart(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }) {
    const user = await this.authenticateSocket(client);
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }
    await this.chatService.assertParticipant(payload.conversationId, user.id);
    await this.chatService.setTyping(payload.conversationId, user.id, true);
    this.trackTypingConversation(client.id, payload.conversationId);
    this.server.to(`conversation:${payload.conversationId}`).emit('typing.start', { userId: user.id });
    return { ok: true };
  }

  @SubscribeMessage('typing.stop')
  async typingStop(@ConnectedSocket() client: Socket, @MessageBody() payload: { conversationId: string }) {
    const user = await this.authenticateSocket(client);
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }
    await this.chatService.assertParticipant(payload.conversationId, user.id);
    await this.chatService.setTyping(payload.conversationId, user.id, false);
    this.untrackTypingConversation(client.id, payload.conversationId);
    this.server.to(`conversation:${payload.conversationId}`).emit('typing.stop', { userId: user.id });
    return { ok: true };
  }

  emitMessageCreated(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.created', payload);
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

  emitMessageDelivered(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.delivered', payload);
  }

  emitMessageReadStatus(conversationId: string, payload: unknown): void {
    this.server.to(`conversation:${conversationId}`).emit('message.readStatus', payload);
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

    return { id: user.id, role: payload.role };
  }

  private async authenticateSocket(client: Socket): Promise<{ id: string; role: string } | null> {
    try {
      const user = await this.authenticate(client);
      this.socketUsers.set(client.id, user);
      return user;
    } catch (error) {
      this.logger.warn(`Socket event authentication failed: ${(error as Error).message}`);
      client.disconnect(true);
      return null;
    }
  }

  private trackTypingConversation(socketId: string, conversationId: string) {
    const conversations = this.typingConversationsBySocket.get(socketId) ?? new Set<string>();
    conversations.add(conversationId);
    this.typingConversationsBySocket.set(socketId, conversations);
  }

  private untrackTypingConversation(socketId: string, conversationId: string) {
    const conversations = this.typingConversationsBySocket.get(socketId);
    if (!conversations) {
      return;
    }

    conversations.delete(conversationId);
    if (conversations.size === 0) {
      this.typingConversationsBySocket.delete(socketId);
    }
  }

  private async clearTypingState(client: Socket) {
    const user = this.socketUsers.get(client.id);
    const conversations = this.typingConversationsBySocket.get(client.id);

    if (!user || !conversations || conversations.size === 0) {
      return;
    }

    await Promise.all(
      Array.from(conversations).map(async (conversationId) => {
        await this.chatService.setTyping(conversationId, user.id, false);
        this.server.to(`conversation:${conversationId}`).emit('typing.stop', { userId: user.id });
      }),
    );
  }
}
