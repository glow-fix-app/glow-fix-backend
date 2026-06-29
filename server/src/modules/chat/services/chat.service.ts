import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ParticipantRole } from '@prisma/client';
import { RedisService } from '../../../core/redis/redis.service';
import { StorageService } from '../../../core/storage/storage.service';
import { ChatGateway } from '../gateways/chat.gateway';
import {
  presentConversation,
  presentMessage,
} from '../presenters/chat.presenter';
import { ConversationResponseDto } from '../dto/conversation-response.dto';
import { MessageResponseDto, MessageListResponseDto } from '../dto/message-response.dto';
import { ConversationCreateType } from '../dto/create-conversation.dto';
import { MessagesQueryDto } from '../dto/messages-query.dto';
import { encryptMessage } from '../../../core/utils/encryption.util';
import { ChatRepository } from '../repositories/chat.repository';
import { ParticipantInput } from '../interfaces/chat-repository.interface';

// ─── Internal Input Types ─────────────────────────────────────────────────────

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
    private readonly repository: ChatRepository,
    private readonly redis: RedisService,
    private readonly storage: StorageService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly gateway: ChatGateway,
  ) {}

  // ── Status lookup (cached per process lifetime) ──

  private readonly statusCache = new Map<string, Promise<string>>();

  async getStatusId(context: string, name: string): Promise<string> {
    const cacheKey = `${context}:${name}`;
    let cachedPromise = this.statusCache.get(cacheKey);
    
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = this.repository.getStatusId(context, name);
    this.statusCache.set(cacheKey, cachedPromise);
    return cachedPromise;
  }

  // ── Conversations ────────────────────────────────

  private async attachAvatars(conversations: ConversationResponseDto[]): Promise<ConversationResponseDto[]> {
    const userIds = new Set<string>();
    for (const conv of conversations) {
      for (const p of conv.participants) {
        if (p.user) userIds.add(p.user.id);
      }
      if (conv.lastMessage?.sender) {
        userIds.add(conv.lastMessage.sender.id);
      }
    }

    if (userIds.size === 0) return conversations;

    const avatarMap = await this.repository.findAvatars(Array.from(userIds));

    for (const conv of conversations) {
      for (const p of conv.participants) {
        if (p.user && avatarMap.has(p.user.id)) {
          (p.user as any).avatar_url = avatarMap.get(p.user.id);
        }
      }
      if (conv.lastMessage?.sender && avatarMap.has(conv.lastMessage.sender.id)) {
        (conv.lastMessage.sender as any).avatar_url = avatarMap.get(conv.lastMessage.sender.id);
      }
    }

    return conversations;
  }

  async listConversations(userId: string): Promise<ConversationResponseDto[]> {
    const records = await this.repository.listConversations(userId);
    const dtos = records.map(presentConversation);
    return this.attachAvatars(dtos);
  }

  async getConversation(id: string, userId: string): Promise<ConversationResponseDto> {
    const record = await this.repository.getConversation(id, userId);

    if (!record) {
      throw new ForbiddenException('Conversation not found or access denied');
    }

    const dto = presentConversation(record);
    const [attachedDto] = await this.attachAvatars([dto]);
    return attachedDto;
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
    await this.repository.assertParticipant(conversationId, userId);

    const skip = query.page > 1 ? (query.page - 1) * query.limit : 0;
    const [records, total] = await this.repository.listMessages(
      conversationId,
      query.limit,
      skip,
      query.cursor
    );

    const data = records.reverse().map(presentMessage);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
        cursor: data.length > 0 ? data[0].id : null,
      },
    };
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    userRole: string,
    body: string,
  ): Promise<MessageResponseDto> {
    await this.repository.assertParticipant(conversationId, userId);

    const trimmedBody = this.normalizeBody(body);
    const encryptedBody = encryptMessage(trimmedBody);
    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    const now = new Date();

    const record = await this.repository.createMessageAndUpdateConversation(
      {
        conversationId,
        senderUserId: userId,
        senderRole: this.toParticipantRole(userRole),
        type: 'TEXT',
        body: encryptedBody,
        statusId,
      },
      conversationId,
      now
    );

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
    await this.repository.assertParticipant(conversationId, userId);

    const { url, storageKey } = await this.storage.uploadFile(
      buffer,
      'chat-attachments',
      mimetype,
      originalName,
    );

    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    const now = new Date();

    const body = JSON.stringify({ url, storageKey, caption: caption ?? null });
    const encryptedBody = encryptMessage(body);

    const record = await this.repository.createMessageAndUpdateConversation(
      {
        conversationId,
        senderUserId: userId,
        senderRole: this.toParticipantRole(userRole),
        type: 'FILE',
        body: encryptedBody,
        statusId,
      },
      conversationId,
      now
    );

    const dto = presentMessage(record);
    this.gateway.emitMessageCreated(conversationId, dto);
    return dto;
  }

  async markRead(conversationId: string, userId: string): Promise<{ message: string }> {
    await this.repository.assertParticipant(conversationId, userId);

    const now = new Date();
    await this.repository.updateParticipantsRead(conversationId, userId, now);

    this.gateway.emitMessageRead(conversationId, { userId, lastReadAt: now });
    return { message: 'Conversation marked as read' };
  }

  async markMessageDelivered(messageId: string, userId: string): Promise<void> {
    const record = await this.repository.findMessage(messageId);
    if (!record) return;

    if (!record.deliveredAt) {
      await this.repository.assertParticipant(record.conversationId, userId);
      const now = new Date();
      await this.repository.updateMessageDeliveredAt(messageId, now);
      this.gateway.emitMessageDelivered(record.conversationId, { messageId, deliveredAt: now });
    }
  }

  async markMessageReadStatus(messageId: string, userId: string): Promise<void> {
    const record = await this.repository.findMessage(messageId);
    if (!record) return;

    if (!record.readAt) {
      await this.repository.assertParticipant(record.conversationId, userId);
      const now = new Date();
      const deliveredAt = record.deliveredAt ?? now;
      await this.repository.updateMessageReadStatus(messageId, now, deliveredAt);
      this.gateway.emitMessageReadStatus(record.conversationId, { messageId, readAt: now, deliveredAt });
    }
  }

  async editMessage(messageId: string, userId: string, body: string): Promise<MessageResponseDto> {
    const record = await this.repository.findMessage(messageId);

    if (!record) {
      throw new NotFoundException('Message not found');
    }

    await this.repository.assertParticipant(record.conversationId, userId);

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
    const updated = await this.repository.updateMessageBody(
      messageId,
      encryptMessage(this.normalizeBody(body)),
      now
    );

    const dto = presentMessage(updated);
    this.gateway.emitMessageEdited(record.conversationId, dto);
    return dto;
  }

  async deleteMessage(messageId: string, userId: string): Promise<MessageResponseDto> {
    const record = await this.repository.findMessage(messageId);

    if (!record) {
      throw new NotFoundException('Message not found');
    }

    await this.repository.assertParticipant(record.conversationId, userId);

    if (record.senderUserId !== userId) {
      throw new ForbiddenException('Only the original sender can delete this message');
    }

    if (record.deletedAt) {
      throw new BadRequestException('Message already deleted');
    }

    const deletedStatusId = await this.getStatusId('MESSAGE', 'DELETED');
    const now = new Date();

    const updated = await this.repository.deleteMessage(messageId, deletedStatusId, now);

    const dto = presentMessage(updated);
    this.gateway.emitMessageDeleted(record.conversationId, dto);
    return dto;
  }

  // ── Public Utilities (used by Gateway) ──────────

  async assertParticipant(conversationId: string, userId: string): Promise<void> {
    await this.repository.assertParticipant(conversationId, userId);
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

    const booking = await this.repository.findBooking(input.bookingId);

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

    let conversation = await this.repository.findExistingBookingConversation(
      input.bookingId,
      ConversationCreateType.BOOKING,
      openStatusId
    );

    if (conversation) {
      await this.repository.ensureParticipants(conversation.id, requiredParticipants);
    } else {
      conversation = await this.repository.createConversation({
        type: ConversationCreateType.BOOKING,
        bookingId: input.bookingId,
        statusId: openStatusId,
        participants: {
          create: requiredParticipants.map((p) => ({
            user: { connect: { id: p.userId } },
            role: p.role,
          })),
        },
      });
    }

    const record = await this.repository.fetchConversationById(conversation.id);
    return presentConversation(record);
  }

  private async createDirectConversation(input: CreateConversationInput): Promise<ConversationResponseDto> {
    let explicitParticipantIds = [
      ...(input.targetUserId ? [input.targetUserId] : []),
      ...(input.participantUserIds ?? []),
    ];

    if (input.type === ConversationCreateType.SUPPORT && explicitParticipantIds.length === 0) {
      const admin = await this.repository.findAdmin();
      if (admin) {
        explicitParticipantIds = [admin.id];
      }
    }

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

    const users = await this.repository.findUsersByIds(uniqueIds);

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

    const existing = await this.repository.findExistingConversation(
      input.type,
      statusId,
      participantIds
    );

    if (existing) {
      await this.repository.ensureParticipants(existing.id, participants);
      const record = await this.repository.fetchConversationById(existing.id);
      return presentConversation(record);
    }

    const conversation = await this.repository.createConversation({
      type: input.type,
      bookingId: null,
      statusId,
      participants: {
        create: participants.map((p) => ({
          user: { connect: { id: p.userId } },
          role: p.role,
        })),
      },
    });

    const record = await this.repository.fetchConversationById(conversation.id);
    return presentConversation(record);
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
      return role as ParticipantRole;
    }
    return ParticipantRole.SYSTEM;
  }
}
