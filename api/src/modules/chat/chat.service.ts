import { ForbiddenException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { ChatGateway } from './chat.gateway';
import { ConversationCreateType } from './dto/create-conversation.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly gateway: ChatGateway,
  ) {}

  async getStatusId(context: string, name: string): Promise<string> {
    const status = await this.prisma.status.findFirst({ where: { context, name } });
    if (!status) {
      throw new NotFoundException(`Missing status ${context}:${name}`);
    }
    return status.id;
  }

  async listConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId, leftAt: null } } },
      include: { participants: true, booking: true, status: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    await this.assertParticipant(id, userId);
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { participants: true, booking: true, status: true },
    });
  }

  async createConversation(userId: string, type: ConversationCreateType, bookingId?: string, role?: string) {
    const statusId = await this.getStatusId('CONVERSATION', 'OPEN');
    const participants: Array<{ userId: string; role: string }> = [
      { userId, role: role || 'CLIENT' },
    ];

    if (type === ConversationCreateType.BOOKING) {
      if (!bookingId) {
        throw new ForbiddenException('bookingId is required for booking conversations');
      }
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { vehicle: { include: { client: true } }, business: true },
      });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      const allowed =
        booking.vehicle.client.userId === userId ||
        booking.business.managerId === userId ||
        role === 'ADMIN';
      if (!allowed) {
        throw new ForbiddenException('You cannot access this booking conversation');
      }
      participants.push({ userId: booking.business.managerId, role: 'MANAGER' });
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: type as any,
        bookingId: bookingId ?? null,
        statusId,
        participants: {
          create: participants.map((participant) => ({
            role: participant.role as any,
            user: { connect: { id: participant.userId } },
          })),
        },
      },
      include: { participants: true, booking: true, status: true },
    });

    return conversation;
  }

  async listMessages(conversationId: string, userId: string, query: MessagesQueryDto) {
    await this.assertParticipant(conversationId, userId);
    const where = { conversationId, deletedAt: null as Date | null };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.message.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async sendMessage(conversationId: string, userId: string, userRole: string, body: string) {
    await this.assertParticipant(conversationId, userId);
    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    return this.prisma.message.create({
      data: {
        conversationId,
        senderUserId: userId,
        senderRole: userRole as any,
        type: 'TEXT',
        body,
        statusId,
      },
    });
  }

  async markRead(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);
    const statusId = await this.getStatusId('MESSAGE', 'READ');
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId, leftAt: null },
      data: { lastReadAt: new Date() },
    });
    this.gateway.emitMessageRead(conversationId, { userId, statusId });
    return { message: 'Conversation marked as read' };
  }

  async editMessage(messageId: string, userId: string, body: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { body, editedAt: new Date() },
    });
    this.gateway.emitMessageEdited(message.conversationId, updated);
    return updated;
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    const deletedStatusId = await this.getStatusId('MESSAGE', 'DELETED');
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date(), statusId: deletedStatusId, body: null },
    });
    this.gateway.emitMessageDeleted(message.conversationId, updated);
    return updated;
  }

  async assertParticipant(conversationId: string, userId: string): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId, leftAt: null },
    });
    if (!participant) {
      throw new ForbiddenException('Access denied');
    }
  }

  async setTyping(conversationId: string, userId: string, active: boolean): Promise<void> {
    const key = `typing:${conversationId}:${userId}`;
    if (active) {
      await this.redis.set(key, '1', 10);
      return;
    }
    await this.redis.del(key);
  }
}
