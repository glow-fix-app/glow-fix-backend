import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IChatRepository, ParticipantInput } from '../interfaces/chat-repository.interface';
import { chatConversationSelect, chatMessageSelect } from '../presenters/chat.presenter';
import { ConversationCreateType } from '../dto/create-conversation.dto';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStatusId(context: string, name: string): Promise<string> {
    let status = await this.prisma.status.findFirst({ where: { context: name } });
    if (!status) {
      status = await this.prisma.status.create({ data: { context: name } });
    }
    return status.id;
  }

  async findAvatars(userIds: string[]): Promise<Map<string, string>> {
    const avatars = await this.prisma.image.findMany({
      where: {
        entityType: 'USER_AVATAR',
        entityId: { in: userIds },
      },
    });

    const avatarMap = new Map<string, string>();
    for (const img of avatars) {
      avatarMap.set(img.entityId, img.url);
    }
    return avatarMap;
  }

  async listConversations(userId: string): Promise<any[]> {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string): Promise<any | null> {
    return this.prisma.conversation.findFirst({
      where: { id, participants: { some: { userId, leftAt: null } } },
      select: chatConversationSelect,
    });
  }

  async findBooking(bookingId: string): Promise<any | null> {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        vehicle: { select: { client: { select: { userId: true } } } },
        business: { select: { managerId: true } },
      },
    });
  }

  async findAdmin(): Promise<{ id: string } | null> {
    return this.prisma.user.findFirst({
      where: { role: 'ADMIN', isActive: true, deletedAt: null },
      select: { id: true },
    });
  }

  async findUsersByIds(userIds: string[]): Promise<any[]> {
    return this.prisma.user.findMany({
      where: { id: { in: userIds }, isActive: true, deletedAt: null },
      select: { id: true, role: true },
    });
  }

  async findExistingConversation(
    type: ConversationCreateType,
    statusId: string,
    participantIds: string[]
  ): Promise<{ id: string } | null> {
    const existingConversations = await this.prisma.conversation.findMany({
      where: {
        bookingId: null,
        type,
        statusId,
        closedAt: null,
        participants: {
          some: { userId: participantIds[0] },
        },
      },
      include: {
        participants: { select: { userId: true } },
      },
    });

    const existing = existingConversations.find((c) => {
      if (c.participants.length !== participantIds.length) return false;
      const ids = c.participants.map((p) => p.userId).sort();
      return ids.every((id, idx) => id === participantIds[idx]);
    });

    return existing ? { id: existing.id } : null;
  }

  async findExistingBookingConversation(
    bookingId: string,
    type: ConversationCreateType,
    statusId: string
  ): Promise<{ id: string } | null> {
    return this.prisma.conversation.findFirst({
      where: {
        bookingId,
        type,
        statusId,
        closedAt: null,
      },
      select: { id: true },
    });
  }

  async createConversation(data: any): Promise<{ id: string }> {
    return this.prisma.conversation.create({
      data,
      select: { id: true },
    });
  }

  async fetchConversationById(id: string): Promise<any> {
    return this.prisma.conversation.findUniqueOrThrow({
      where: { id },
      select: chatConversationSelect,
    });
  }

  async ensureParticipants(conversationId: string, participants: ParticipantInput[]): Promise<void> {
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

  async assertParticipant(conversationId: string, userId: string): Promise<void> {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId, leftAt: null },
      select: { id: true },
    });

    if (!participant) {
      throw new ForbiddenException('Access denied');
    }
  }

  async updateParticipantsRead(conversationId: string, userId: string, date: Date): Promise<void> {
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId, leftAt: null },
      data: { lastReadAt: date },
    });
  }

  async listMessages(
    conversationId: string,
    limit: number,
    skip: number,
    cursor?: string
  ): Promise<[any[], number]> {
    const where = { conversationId };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where,
        select: chatMessageSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : skip > 0 ? { skip } : {}),
      }),
      this.prisma.message.count({ where }),
    ]);

    return [records, total];
  }

  async createMessageAndUpdateConversation(messageData: any, conversationId: string, date: Date): Promise<any> {
    const [record] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: messageData,
        select: chatMessageSelect,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: date },
        select: { id: true },
      }),
    ]);

    return record;
  }

  async findMessage(messageId: string): Promise<any | null> {
    return this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, conversationId: true, senderUserId: true, deletedAt: true, type: true, readAt: true, deliveredAt: true },
    });
  }

  async updateMessageDeliveredAt(messageId: string, date: Date): Promise<void> {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { deliveredAt: date },
    });
  }

  async updateMessageReadStatus(messageId: string, readAt: Date, deliveredAt: Date): Promise<void> {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { readAt, deliveredAt },
    });
  }

  async updateMessageBody(messageId: string, body: string, date: Date): Promise<any> {
    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        body,
        editedAt: date,
        updatedAt: date,
      },
      select: chatMessageSelect,
    });
  }

  async deleteMessage(messageId: string, statusId: string, date: Date): Promise<any> {
    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: date,
        statusId: statusId,
        body: null,
      },
      select: chatMessageSelect,
    });
  }
}
