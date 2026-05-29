import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { Prisma, ParticipantRole } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { ChatGateway } from './chat.gateway';
import { ConversationCreateType } from './dto/create-conversation.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';

const chatUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
} as const satisfies Prisma.UserSelect;

const chatStatusSelect = {
  id: true,
  name: true,
  context: true,
} as const satisfies Prisma.StatusSelect;

const chatConversationSelect = {
  id: true,
  bookingId: true,
  type: true,
  statusId: true,
  closedAt: true,
  createdAt: true,
  updatedAt: true,
  status: { select: chatStatusSelect },
  participants: {
    where: { leftAt: null },
    select: {
      id: true,
      conversationId: true,
      userId: true,
      role: true,
      lastReadAt: true,
      joinedAt: true,
      leftAt: true,
      user: { select: chatUserSelect },
    },
  },
} as const satisfies Prisma.ConversationSelect;

const chatMessageSelect = {
  id: true,
  conversationId: true,
  senderUserId: true,
  senderRole: true,
  type: true,
  body: true,
  statusId: true,
  deliveredAt: true,
  readAt: true,
  editedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  status: { select: chatStatusSelect },
  sender: { select: chatUserSelect },
} as const satisfies Prisma.MessageSelect;

type ConversationRecord = Prisma.ConversationGetPayload<{
  select: typeof chatConversationSelect;
}>;

type MessageRecord = Prisma.MessageGetPayload<{
  select: typeof chatMessageSelect;
}>;

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
      throw new InternalServerErrorException(`Missing required status ${context}:${name}`);
    }
    return status.id;
  }

  async listConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    return this.getActiveConversationForUser(id, userId);
  }

  async createConversation(input: CreateConversationInput) {
    if (input.type === ConversationCreateType.BOOKING) {
      return this.createBookingConversation(input);
    }

    return this.createDirectConversation(input);
  }

  async listMessages(conversationId: string, userId: string, query: MessagesQueryDto) {
    await this.assertParticipant(conversationId, userId);

    const where = { conversationId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        select: chatMessageSelect,
        orderBy: { createdAt: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: data.map((message) => this.sanitizeMessage(message)),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  async sendMessage(conversationId: string, userId: string, userRole: string, body: string) {
    await this.assertParticipant(conversationId, userId);

    const trimmedBody = this.normalizeBody(body);
    const statusId = await this.getStatusId('MESSAGE', 'SENT');
    const now = new Date();

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderUserId: userId,
          senderRole: this.toParticipantRole(userRole),
          type: 'TEXT',
          body: trimmedBody,
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

    const sanitized = this.sanitizeMessage(message);
    this.gateway.emitMessageCreated(conversationId, sanitized);
    return sanitized;
  }

  async markRead(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);

    const now = new Date();
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId, leftAt: null },
      data: { lastReadAt: now },
    });

    this.gateway.emitMessageRead(conversationId, { userId, lastReadAt: now });
    return { message: 'Conversation marked as read' };
  }

  async editMessage(messageId: string, userId: string, body: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        conversationId: true,
        senderUserId: true,
        deletedAt: true,
      },
    });

    if (!message) {
      throw new ForbiddenException('Access denied');
    }

    await this.assertParticipant(message.conversationId, userId);

    if (message.senderUserId !== userId) {
      throw new ForbiddenException('Only the original sender can edit this message');
    }

    if (message.deletedAt) {
      throw new BadRequestException('Deleted messages cannot be edited');
    }

    const now = new Date();
    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        body: this.normalizeBody(body),
        editedAt: now,
        updatedAt: now,
      },
      select: chatMessageSelect,
    });

    const sanitized = this.sanitizeMessage(updated);
    this.gateway.emitMessageEdited(message.conversationId, sanitized);
    return sanitized;
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        conversationId: true,
        senderUserId: true,
        deletedAt: true,
      },
    });

    if (!message) {
      throw new ForbiddenException('Access denied');
    }

    await this.assertParticipant(message.conversationId, userId);

    if (message.senderUserId !== userId) {
      throw new ForbiddenException('Only the original sender can delete this message');
    }

    if (message.deletedAt) {
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

    const sanitized = this.sanitizeMessage(updated);
    this.gateway.emitMessageDeleted(message.conversationId, sanitized);
    return sanitized;
  }

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

  private async createBookingConversation(input: CreateConversationInput) {
    if (!input.bookingId) {
      throw new BadRequestException('bookingId is required for BOOKING conversations');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        id: true,
        vehicle: {
          select: {
            client: {
              select: {
                userId: true,
              },
            },
          },
        },
        business: {
          select: {
            managerId: true,
          },
        },
      },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
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
      return this.getConversationById(conversation.id);
    }

    conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationCreateType.BOOKING,
        bookingId: input.bookingId,
        statusId: openStatusId,
        participants: {
          create: requiredParticipants.map((participant) => ({
            user: { connect: { id: participant.userId } },
            role: participant.role,
          })),
        },
      },
      select: { id: true },
    });

    return this.getConversationById(conversation.id);
  }

  private async createDirectConversation(input: CreateConversationInput) {
    const explicitParticipantIds = [
      ...(input.targetUserId ? [input.targetUserId] : []),
      ...(input.participantUserIds ?? []),
    ];

    if (explicitParticipantIds.length === 0) {
      const message =
        input.type === ConversationCreateType.SUPPORT
          ? 'Support conversations require targetUserId or participantUserIds until support assignment is implemented'
          : 'General conversations require targetUserId or participantUserIds';
      throw new BadRequestException(message);
    }

    const uniqueIds = Array.from(new Set([input.userId, ...explicitParticipantIds]));
    if (uniqueIds.length < 2) {
      throw new BadRequestException('Conversation must include at least one other participant');
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: uniqueIds },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (users.length !== uniqueIds.length) {
      throw new BadRequestException('One or more participants could not be found');
    }

    const usersById = new Map(users.map((user) => [user.id, user.role]));
    const participants = uniqueIds.map((participantId) => {
      const role = usersById.get(participantId);
      if (!role) {
        throw new BadRequestException('One or more participants could not be found');
      }

      return {
        userId: participantId,
        role: this.toParticipantRole(role),
      };
    });

    const statusId = await this.getStatusId('CONVERSATION', 'OPEN');
    const conversation = await this.prisma.conversation.create({
      data: {
        type: input.type,
        bookingId: null,
        statusId,
        participants: {
          create: participants.map((participant) => ({
            user: { connect: { id: participant.userId } },
            role: participant.role,
          })),
        },
      },
      select: { id: true },
    });

    return this.getConversationById(conversation.id);
  }

  private async getActiveConversationForUser(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
    });

    if (!conversation) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  private async getConversationById(id: string) {
    return this.prisma.conversation.findUniqueOrThrow({
      where: { id },
      select: chatConversationSelect,
    });
  }

  private async ensureParticipants(conversationId: string, participants: ParticipantInput[]) {
    const existingParticipants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId, userId: { in: participants.map((participant) => participant.userId) } },
      select: {
        id: true,
        userId: true,
        leftAt: true,
        role: true,
      },
    });

    const existingByUserId = new Map(existingParticipants.map((participant) => [participant.userId, participant]));
    for (const participant of participants) {
      const existing = existingByUserId.get(participant.userId);
      if (!existing) {
        await this.prisma.conversationParticipant.create({
          data: {
            conversation: { connect: { id: conversationId } },
            user: { connect: { id: participant.userId } },
            role: participant.role,
          },
        });
        continue;
      }

      if (existing.leftAt || existing.role !== participant.role) {
        await this.prisma.conversationParticipant.update({
          where: { id: existing.id },
          data: {
            role: participant.role,
            leftAt: null,
          },
        });
      }
    }
  }

  private sanitizeMessage(message: MessageRecord) {
    return {
      ...message,
      body: message.deletedAt ? null : message.body,
    };
  }

  private normalizeBody(body: string) {
    const trimmedBody = body.trim();
    if (!trimmedBody) {
      throw new BadRequestException('Message body must be a non-empty trimmed string');
    }
    return trimmedBody;
  }

  private uniqueParticipants(participants: ParticipantInput[]) {
    return Array.from(
      participants.reduce((acc, participant) => {
        acc.set(participant.userId, participant);
        return acc;
      }, new Map<string, ParticipantInput>()),
    ).map(([, participant]) => participant);
  }

  private toParticipantRole(role: string): ParticipantRole {
    if (role === ParticipantRole.CLIENT || role === ParticipantRole.MANAGER || role === ParticipantRole.ADMIN) {
      return role;
    }

    return ParticipantRole.SYSTEM;
  }
}
