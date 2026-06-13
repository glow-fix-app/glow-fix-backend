import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ParticipantRole } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { ChatGateway } from './chat.gateway';
import {
  chatConversationSelect,
  chatMessageSelect,
  presentConversation,
  presentMessage,
} from './chat.presenter';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { MessageResponseDto, MessageListResponseDto } from './dto/message-response.dto';
import { ConversationCreateType } from './dto/create-conversation.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';
import { encryptMessage } from '../../core/utils/encryption.util';

// ─── Internal Input Types ─────────────────────────────────────────────────────

type ParticipantInput = {
  userId: string;
  role: ParticipantRole;
};

type CreateConversationInput = {
  userId: string;
  userRole: string;
  type: ConversationCreateType;
  bookingId?: string;
  targetUserId?: string;
  participantUserIds?: string[];
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly gateway: ChatGateway,
  ) {}

  // ── Status lookup (cached per process lifetime) ──

  private readonly statusCache = new Map<string, string>();

  async getStatusId(context: string, name: string): Promise<string> {
    const cacheKey = `${context}:${name}`;
    const cached = this.statusCache.get(cacheKey);
    if (cached) return cached;

    let status = await this.prisma.status.findFirst({ where: { context: name } });
    if (!status) {
      status = await this.prisma.status.create({ data: { context: name } });
    }

    this.statusCache.set(cacheKey, status.id);
    return status.id;
  }

  // ── Conversations ────────────────────────────────

  async listConversations(userId: string): Promise<ConversationResponseDto[]> {
    const records = await this.prisma.conversation.findMany({
      where: { participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
      orderBy: { updatedAt: 'desc' },
    });

    return records.map(presentConversation);
  }

  async getConversation(id: string, userId: string): Promise<ConversationResponseDto> {
    const record = await this.prisma.conversation.findFirst({
      where: { id, participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
    });

    if (!record) {
      throw new ForbiddenException('Conversation not found or access denied');
    }

    return presentConversation(record);
  }

  async createConversation(input: CreateConversationInput): Promise<ConversationResponseDto> {
    if (input.type === ConversationCreateType.BOOKING) {
      return this.createBookingConversation(input);
    }

    return this.createDirectConversation(input);
  }

  // ── Messages ─────────────────────────────────────

  async listMessages(
    conversationId: string,
    userId: string,
    query: MessagesQueryDto,
  ): Promise<MessageListResponseDto> {
    await this.assertParticipant(conversationId, userId);

    const where = { conversationId };
    const [records, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        select: chatMessageSelect,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: records.reverse().map(presentMessage),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    userRole: string,
    body: string,
  ): Promise<MessageResponseDto> {
    await this.assertParticipant(conversationId, userId);

    const trimmedBody = this.normalizeBody(body);
    const encryptedBody = encryptMessage(trimmedBody);
    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    const now = new Date();

    const [record] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderUserId: userId,
          senderRole: this.toParticipantRole(userRole),
          type: 'TEXT',
          body: encryptedBody,
          statusId,
        },
        select: chatMessageSelect,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: now },
        select: { id: true },
      }),
    ]);

    const dto = presentMessage(record);
    this.gateway.emitMessageCreated(conversationId, dto);
    return dto;
  }

  async sendFileMessage(
    conversationId: string,
    userId: string,
    userRole: string,
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    caption?: string,
  ): Promise<MessageResponseDto> {
    await this.assertParticipant(conversationId, userId);

    const { url, storageKey } = await this.storage.uploadFile(
      buffer,
      'chat-attachments',
      mimetype,
      originalName,
    );

    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    const now = new Date();

    // Attachment stored as JSON so the frontend can render it properly
    const body = JSON.stringify({ url, storageKey, caption: caption ?? null });
    const encryptedBody = encryptMessage(body);

    const [record] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderUserId: userId,
          senderRole: this.toParticipantRole(userRole),
          type: 'FILE',
          body: encryptedBody,
          statusId,
        },
        select: chatMessageSelect,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: now },
        select: { id: true },
      }),
    ]);

    const dto = presentMessage(record);
    this.gateway.emitMessageCreated(conversationId, dto);
    return dto;
  }

  async markRead(conversationId: string, userId: string): Promise<{ message: string }> {
    await this.assertParticipant(conversationId, userId);

    const now = new Date();
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId, leftAt: null },
      data: { lastReadAt: now },
    });

    this.gateway.emitMessageRead(conversationId, { userId, lastReadAt: now });
    return { message: 'Conversation marked as read' };
  }

  async markMessageDelivered(messageId: string, userId: string): Promise<void> {
    const record = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { conversationId: true, deliveredAt: true },
    });
    if (!record) return;

    if (!record.deliveredAt) {
      await this.assertParticipant(record.conversationId, userId);
      const now = new Date();
      await this.prisma.message.update({
        where: { id: messageId },
        data: { deliveredAt: now },
      });
      this.gateway.emitMessageDelivered(record.conversationId, { messageId, deliveredAt: now });
    }
  }

  async markMessageReadStatus(messageId: string, userId: string): Promise<void> {
    const record = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { conversationId: true, readAt: true, deliveredAt: true },
    });
    if (!record) return;

    if (!record.readAt) {
      await this.assertParticipant(record.conversationId, userId);
      const now = new Date();
      await this.prisma.message.update({
        where: { id: messageId },
        data: { readAt: now, deliveredAt: record.deliveredAt ?? now },
      });
      this.gateway.emitMessageReadStatus(record.conversationId, { messageId, readAt: now, deliveredAt: record.deliveredAt ?? now });
    }
  }

  async editMessage(messageId: string, userId: string, body: string): Promise<MessageResponseDto> {
    const record = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderUserId: true, deletedAt: true, type: true },
    });

    if (!record) {
      throw new NotFoundException('Message not found');
    }

    await this.assertParticipant(record.conversationId, userId);

    if (record.senderUserId !== userId) {
      throw new ForbiddenException('Only the original sender can edit this message');
    }

    if (record.deletedAt) {
      throw new BadRequestException('Deleted messages cannot be edited');
    }

    if (record.type === 'FILE') {
      throw new BadRequestException('File messages cannot be edited');
    }

    const now = new Date();
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        body: encryptMessage(this.normalizeBody(body)),
        editedAt: now,
        updatedAt: now,
      },
      select: chatMessageSelect,
    });

    const dto = presentMessage(updated);
    this.gateway.emitMessageEdited(record.conversationId, dto);
    return dto;
  }

  async deleteMessage(messageId: string, userId: string): Promise<MessageResponseDto> {
    const record = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderUserId: true, deletedAt: true },
    });

    if (!record) {
      throw new NotFoundException('Message not found');
    }

    await this.assertParticipant(record.conversationId, userId);

    if (record.senderUserId !== userId) {
      throw new ForbiddenException('Only the original sender can delete this message');
    }

    if (record.deletedAt) {
      throw new BadRequestException('Message already deleted');
    }

    const deletedStatusId = await this.getStatusId('MESSAGE', 'DELETED');
    const now = new Date();

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: now,
        statusId: deletedStatusId,
        body: null,
      },
      select: chatMessageSelect,
    });

    const dto = presentMessage(updated);
    this.gateway.emitMessageDeleted(record.conversationId, dto);
    return dto;
  }

  // ── Public Utilities (used by Gateway) ──────────

  async assertParticipant(conversationId: string, userId: string): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId, leftAt: null },
      select: { id: true },
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

  // ── Private Helpers ──────────────────────────────

  private async createBookingConversation(input: CreateConversationInput): Promise<ConversationResponseDto> {
    if (!input.bookingId) {
      throw new BadRequestException('bookingId is required for BOOKING conversations');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        id: true,
        vehicle: { select: { client: { select: { userId: true } } } },
        business: { select: { managerId: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isClientOwner = booking.vehicle.client.userId === input.userId;
    const isManagerOwner = booking.business.managerId === input.userId;
    const isAdmin = input.userRole === 'ADMIN';

    if (!isClientOwner && !isManagerOwner && !isAdmin) {
      throw new ForbiddenException('You cannot access this booking conversation');
    }

    const openStatusId = await this.getStatusId('CONVERSATION', 'OPEN');
    const requiredParticipants = this.uniqueParticipants([
      { userId: booking.vehicle.client.userId, role: ParticipantRole.CLIENT },
      { userId: booking.business.managerId, role: ParticipantRole.MANAGER },
      ...(isAdmin ? [{ userId: input.userId, role: ParticipantRole.ADMIN }] : []),
    ]);

    let conversation = await this.prisma.conversation.findFirst({
      where: {
        bookingId: input.bookingId,
        type: ConversationCreateType.BOOKING,
        statusId: openStatusId,
        closedAt: null,
      },
      select: { id: true },
    });

    if (conversation) {
      await this.ensureParticipants(conversation.id, requiredParticipants);
    } else {
      conversation = await this.prisma.conversation.create({
        data: {
          type: ConversationCreateType.BOOKING,
          bookingId: input.bookingId,
          statusId: openStatusId,
          participants: {
            create: requiredParticipants.map((p) => ({
              user: { connect: { id: p.userId } },
              role: p.role,
            })),
          },
        },
        select: { id: true },
      });
    }

    return this.fetchConversationById(conversation.id);
  }

  private async createDirectConversation(input: CreateConversationInput): Promise<ConversationResponseDto> {
    const explicitParticipantIds = [
      ...(input.targetUserId ? [input.targetUserId] : []),
      ...(input.participantUserIds ?? []),
    ];

    if (explicitParticipantIds.length === 0) {
      const msg =
        input.type === ConversationCreateType.SUPPORT
          ? 'Support conversations require targetUserId or participantUserIds'
          : 'General conversations require targetUserId or participantUserIds';
      throw new BadRequestException(msg);
    }

    const uniqueIds = Array.from(new Set([input.userId, ...explicitParticipantIds]));
    if (uniqueIds.length < 2) {
      throw new BadRequestException('Conversation must include at least one other participant');
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: uniqueIds }, isActive: true, deletedAt: null },
      select: { id: true, role: true },
    });

    if (users.length !== uniqueIds.length) {
      throw new BadRequestException('One or more participants could not be found');
    }

    const usersById = new Map(users.map((u) => [u.id, u.role]));
    const participants = uniqueIds.map((participantId) => {
      const role = usersById.get(participantId);
      if (!role) throw new BadRequestException('One or more participants could not be found');
      return { userId: participantId, role: this.toParticipantRole(role) };
    });

    const statusId = await this.getStatusId('CONVERSATION', 'OPEN');
    const participantIds = participants.map(p => p.userId).sort();

    // Check for existing open conversation with the exact same participant set
    const existingConversations = await this.prisma.conversation.findMany({
      where: {
        bookingId: null,
        type: input.type,
        statusId,
        closedAt: null,
        participants: {
          every: { userId: { in: participantIds } },
        },
      },
      select: {
        id: true,
        _count: { select: { participants: true } },
      },
    });

    const existing = existingConversations.find(
      (c) => c._count.participants === participantIds.length,
    );

    if (existing) {
      await this.ensureParticipants(existing.id, participants);
      return this.fetchConversationById(existing.id);
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: input.type,
        bookingId: null,
        statusId,
        participants: {
          create: participants.map((p) => ({
            user: { connect: { id: p.userId } },
            role: p.role,
          })),
        },
      },
      select: { id: true },
    });

    return this.fetchConversationById(conversation.id);
  }

  private async fetchConversationById(id: string): Promise<ConversationResponseDto> {
    const record = await this.prisma.conversation.findUniqueOrThrow({
      where: { id },
      select: chatConversationSelect,
    });
    return presentConversation(record);
  }

  private async ensureParticipants(
    conversationId: string,
    participants: ParticipantInput[],
  ): Promise<void> {
    const existing = await this.prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { in: participants.map((p) => p.userId) } },
      select: { id: true, userId: true, leftAt: true, role: true },
    });

    const existingById = new Map(existing.map((p) => [p.userId, p]));

    for (const participant of participants) {
      const found = existingById.get(participant.userId);

      if (!found) {
        await this.prisma.conversationParticipant.create({
          data: {
            conversation: { connect: { id: conversationId } },
            user: { connect: { id: participant.userId } },
            role: participant.role,
          },
        });
        continue;
      }

      if (found.leftAt || found.role !== participant.role) {
        await this.prisma.conversationParticipant.update({
          where: { id: found.id },
          data: { role: participant.role, leftAt: null },
        });
      }
    }
  }

  private normalizeBody(body: string): string {
    const trimmed = body.trim();
    if (!trimmed) {
      throw new BadRequestException('Message body cannot be empty');
    }
    return trimmed;
  }

  private uniqueParticipants(participants: ParticipantInput[]): ParticipantInput[] {
    return Array.from(
      participants.reduce((acc, p) => {
        acc.set(p.userId, p);
        return acc;
      }, new Map<string, ParticipantInput>()),
    ).map(([, p]) => p);
  }

  private toParticipantRole(role: string): ParticipantRole {
    if (
      role === ParticipantRole.CLIENT ||
      role === ParticipantRole.MANAGER ||
      role === ParticipantRole.ADMIN
    ) {
      return role;
    }
    return ParticipantRole.SYSTEM;
  }
}
