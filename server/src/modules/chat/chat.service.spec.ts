import { BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantRole } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { StorageService } from '../../core/storage/storage.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConversationCreateType } from './dto/create-conversation.dto';
import { decryptMessage } from '../../core/utils/encryption.util';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: any;
  let redis: { set: jest.Mock; del: jest.Mock };
  let storage: { uploadFile: jest.Mock };
  let gateway: {
    emitMessageCreated: jest.Mock;
    emitMessageEdited: jest.Mock;
    emitMessageDeleted: jest.Mock;
    emitMessageRead: jest.Mock;
  };

  const participantUser = {
    id: 'client-1',
    fullName: 'Client User',
    email: 'client@example.com',
    role: 'CLIENT',
  };

  const managerUser = {
    id: 'manager-1',
    fullName: 'Manager User',
    email: 'manager@example.com',
    role: 'MANAGER',
  };

  const adminUser = {
    id: 'admin-1',
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  };

  const bookingConversation = {
    id: 'conversation-1',
    bookingId: 'booking-1',
    type: 'BOOKING',
    statusId: 'status-open',
    closedAt: null,
    createdAt: new Date('2026-05-29T10:00:00.000Z'),
    updatedAt: new Date('2026-05-29T10:05:00.000Z'),
    status: {
      id: 'status-open',
      context: 'CONVERSATION',
    },
    participants: [
      {
        id: 'cp-1',
        conversationId: 'conversation-1',
        userId: 'client-1',
        role: 'CLIENT',
        lastReadAt: null,
        joinedAt: new Date('2026-05-29T10:00:00.000Z'),
        leftAt: null,
        user: participantUser,
      },
      {
        id: 'cp-2',
        conversationId: 'conversation-1',
        userId: 'manager-1',
        role: 'MANAGER',
        lastReadAt: null,
        joinedAt: new Date('2026-05-29T10:00:00.000Z'),
        leftAt: null,
        user: managerUser,
      },
    ],
  };

  const messageRecord = {
    id: 'message-1',
    conversationId: 'conversation-1',
    senderUserId: 'client-1',
    senderRole: 'CLIENT',
    type: 'TEXT',
    body: 'Hello there',
    statusId: 'status-sent',
    deliveredAt: null,
    readAt: null,
    editedAt: null,
    deletedAt: null,
    createdAt: new Date('2026-05-29T11:00:00.000Z'),
    updatedAt: new Date('2026-05-29T11:00:00.000Z'),
    status: {
      id: 'status-sent',
      context: 'MESSAGE',
    },
    sender: participantUser,
  };

  beforeEach(async () => {
    prisma = {
      status: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      conversation: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      conversationParticipant: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      booking: {
        findUnique: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
      message: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    redis = {
      set: jest.fn(),
      del: jest.fn(),
    };

    storage = {
      uploadFile: jest.fn(),
    };

    gateway = {
      emitMessageCreated: jest.fn(),
      emitMessageEdited: jest.fn(),
      emitMessageDeleted: jest.fn(),
      emitMessageRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: redis },
        { provide: StorageService, useValue: storage },
        { provide: ChatGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get(ChatService);
    jest.clearAllMocks();
  });

  it('client can create booking conversation for own booking', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-open' });
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    prisma.conversation.create.mockResolvedValueOnce({ id: 'conversation-1' });
    prisma.conversation.findUniqueOrThrow.mockResolvedValueOnce(bookingConversation);

    const result = await service.createConversation({
      userId: 'client-1',
      userRole: 'CLIENT',
      type: ConversationCreateType.BOOKING,
      bookingId: 'booking-1',
    });

    expect(result).toMatchObject(bookingConversation);
    expect(prisma.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          bookingId: 'booking-1',
          type: ConversationCreateType.BOOKING,
          participants: {
            create: [
              expect.objectContaining({ role: ParticipantRole.CLIENT }),
              expect.objectContaining({ role: ParticipantRole.MANAGER }),
            ],
          },
        }),
      }),
    );
  });

  it('manager can create booking conversation for own business booking', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-open' });
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    prisma.conversation.create.mockResolvedValueOnce({ id: 'conversation-1' });
    prisma.conversation.findUniqueOrThrow.mockResolvedValueOnce(bookingConversation);

    await service.createConversation({
      userId: 'manager-1',
      userRole: 'MANAGER',
      type: ConversationCreateType.BOOKING,
      bookingId: 'booking-1',
    });

    expect(prisma.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          participants: {
            create: expect.arrayContaining([
              expect.objectContaining({ role: ParticipantRole.CLIENT }),
              expect.objectContaining({ role: ParticipantRole.MANAGER }),
            ]),
          },
        }),
      }),
    );
  });

  it('booking conversation includes both client and manager participants', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-open' });
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    prisma.conversation.create.mockResolvedValueOnce({ id: 'conversation-1' });
    prisma.conversation.findUniqueOrThrow.mockResolvedValueOnce(bookingConversation);

    await service.createConversation({
      userId: 'client-1',
      userRole: 'CLIENT',
      type: ConversationCreateType.BOOKING,
      bookingId: 'booking-1',
    });

    const createParticipants = prisma.conversation.create.mock.calls[0][0].data.participants.create;
    expect(createParticipants).toHaveLength(2);
    expect(createParticipants.map((participant: any) => participant.user.connect.id).sort()).toEqual([
      'client-1',
      'manager-1',
    ]);
  });

  it('manager-created booking conversation includes client and does not duplicate manager', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-open' });
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    prisma.conversation.create.mockResolvedValueOnce({ id: 'conversation-1' });
    prisma.conversation.findUniqueOrThrow.mockResolvedValueOnce(bookingConversation);

    await service.createConversation({
      userId: 'manager-1',
      userRole: 'MANAGER',
      type: ConversationCreateType.BOOKING,
      bookingId: 'booking-1',
    });

    const createParticipants = prisma.conversation.create.mock.calls[0][0].data.participants.create;
    expect(createParticipants).toHaveLength(2);
    expect(createParticipants.filter((participant: any) => participant.user.connect.id === 'manager-1')).toHaveLength(1);
  });

  it('admin booking creation is explicit and adds admin as a participant', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-open' });
    prisma.conversation.findFirst.mockResolvedValueOnce(null);
    prisma.conversation.create.mockResolvedValueOnce({ id: 'conversation-1' });
    prisma.conversation.findUniqueOrThrow.mockResolvedValueOnce({
      ...bookingConversation,
      participants: [
        ...bookingConversation.participants,
        {
          id: 'cp-3',
          conversationId: 'conversation-1',
          userId: 'admin-1',
          role: 'ADMIN',
          lastReadAt: null,
          joinedAt: new Date('2026-05-29T10:00:00.000Z'),
          leftAt: null,
          user: adminUser,
        },
      ],
    });

    await service.createConversation({
      userId: 'admin-1',
      userRole: 'ADMIN',
      type: ConversationCreateType.BOOKING,
      bookingId: 'booking-1',
    });

    const createParticipants = prisma.conversation.create.mock.calls[0][0].data.participants.create;
    expect(createParticipants).toHaveLength(3);
    expect(createParticipants.map((participant: any) => participant.role).sort()).toEqual([
      'ADMIN',
      'CLIENT',
      'MANAGER',
    ]);
  });

  it('non-owner client cannot create another user booking conversation', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });

    await expect(
      service.createConversation({
        userId: 'client-2',
        userRole: 'CLIENT',
        type: ConversationCreateType.BOOKING,
        bookingId: 'booking-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('non-owner manager cannot create another business booking conversation', async () => {
    prisma.booking.findUnique.mockResolvedValueOnce({
      id: 'booking-1',
      vehicle: { client: { userId: 'client-1' } },
      business: { managerId: 'manager-1' },
    });

    await expect(
      service.createConversation({
        userId: 'manager-2',
        userRole: 'MANAGER',
        type: ConversationCreateType.BOOKING,
        bookingId: 'booking-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('non-owner client cannot access another user booking conversation', async () => {
    prisma.conversation.findFirst.mockResolvedValueOnce(null);

    await expect(service.getConversation('conversation-1', 'client-2')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('non-owner manager cannot access another business booking conversation', async () => {
    prisma.conversation.findFirst.mockResolvedValueOnce(null);

    await expect(service.getConversation('conversation-1', 'manager-2')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('list conversations returns only current user active conversations', async () => {
    prisma.conversation.findMany.mockResolvedValueOnce([bookingConversation]);

    const result = await service.listConversations('client-1');

    expect(result).toMatchObject([bookingConversation]);
    expect(prisma.conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { participants: { some: { userId: 'client-1', leftAt: null } } },
      }),
    );
  });

  it('non-participant cannot read conversation', async () => {
    prisma.conversation.findFirst.mockResolvedValueOnce(null);

    await expect(service.getConversation('conversation-1', 'outsider-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('non-participant cannot list messages', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.listMessages('conversation-1', 'outsider-1', { page: 1, limit: 20 }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('non-participant cannot send message', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.sendMessage('conversation-1', 'outsider-1', 'CLIENT', 'Hello'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('send message rejects blank body', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });

    await expect(service.sendMessage('conversation-1', 'client-1', 'CLIENT', '   ')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('send message creates TEXT message with senderUserId senderRole and MESSAGE/SENT status', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-sent' });
    prisma.message.create.mockResolvedValueOnce(Promise.resolve(messageRecord));
    prisma.conversation.update.mockResolvedValueOnce(Promise.resolve({ id: 'conversation-1' }));
    prisma.$transaction.mockResolvedValueOnce([messageRecord, { id: 'conversation-1' }]);

    const result = await service.sendMessage('conversation-1', 'client-1', 'CLIENT', '  Hello there  ');

    expect(result.body).toBe('Hello there');
    expect(gateway.emitMessageCreated).toHaveBeenCalledWith(
      'conversation-1',
      expect.objectContaining({ id: 'message-1' }),
    );
    expect(prisma.message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          conversationId: 'conversation-1',
          senderUserId: 'client-1',
          senderRole: ParticipantRole.CLIENT,
          type: 'TEXT',
          body: expect.any(String),
          statusId: 'status-sent',
        }),
      }),
    );

    const messageCreateArgs = prisma.message.create.mock.calls[0][0];
    const encryptedBody = messageCreateArgs.data.body;
    expect(decryptMessage(encryptedBody)).toBe('Hello there');
  });

  it('send message updates conversation.updatedAt', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });
    prisma.status.findFirst.mockResolvedValueOnce({ id: 'status-sent' });
    prisma.message.create.mockResolvedValueOnce(Promise.resolve(messageRecord));
    prisma.conversation.update.mockResolvedValueOnce(Promise.resolve({ id: 'conversation-1' }));
    prisma.$transaction.mockResolvedValueOnce([messageRecord, { id: 'conversation-1' }]);

    await service.sendMessage('conversation-1', 'client-1', 'CLIENT', 'Hello there');

    expect(prisma.conversation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'conversation-1' },
        data: { updatedAt: expect.any(Date) },
      }),
    );
  });

  it('only sender can edit own message', async () => {
    prisma.message.findUnique.mockResolvedValueOnce({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderUserId: 'client-1',
      deletedAt: null,
    });
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-2' });

    await expect(service.editMessage('message-1', 'manager-1', 'Updated')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deleted message cannot be edited', async () => {
    prisma.message.findUnique.mockResolvedValueOnce({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderUserId: 'client-1',
      deletedAt: new Date('2026-05-29T12:00:00.000Z'),
    });
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });

    await expect(service.editMessage('message-1', 'client-1', 'Updated')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('only sender can delete own message', async () => {
    prisma.message.findUnique.mockResolvedValueOnce({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderUserId: 'client-1',
      deletedAt: null,
    });
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-2' });

    await expect(service.deleteMessage('message-1', 'manager-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('already-deleted message delete behavior is explicit', async () => {
    prisma.message.findUnique.mockResolvedValueOnce({
      id: 'message-1',
      conversationId: 'conversation-1',
      senderUserId: 'client-1',
      deletedAt: new Date('2026-05-29T12:00:00.000Z'),
    });
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });

    await expect(service.deleteMessage('message-1', 'client-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deleted message body is not exposed in listMessages', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });
    prisma.$transaction.mockResolvedValueOnce([
      [
        {
          ...messageRecord,
          body: 'Should be hidden',
          deletedAt: new Date('2026-05-29T12:00:00.000Z'),
          status: {
            id: 'status-deleted',
            context: 'MESSAGE',
          },
        },
      ],
      1,
    ]);

    const result = await service.listMessages('conversation-1', 'client-1', { page: 1, limit: 20 });

    expect(result.data[0].body).toBeNull();
    expect(result.data[0].deletedAt).toBeInstanceOf(Date);
  });

  it('support one-person conversation is rejected unless explicit participant target is provided', async () => {
    await expect(
      service.createConversation({
        userId: 'client-1',
        userRole: 'CLIENT',
        type: ConversationCreateType.SUPPORT,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('general one-person conversation is rejected unless explicit participant target is provided', async () => {
    prisma.user.findMany.mockResolvedValueOnce([{ id: 'client-1', role: 'CLIENT' }]);

    await expect(
      service.createConversation({
        userId: 'client-1',
        userRole: 'CLIENT',
        type: ConversationCreateType.GENERAL,
        participantUserIds: ['client-1'],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('mark read updates lastReadAt for active participant', async () => {
    prisma.conversationParticipant.findFirst.mockResolvedValueOnce({ id: 'cp-1' });
    prisma.conversationParticipant.updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await service.markRead('conversation-1', 'client-1');

    expect(result.message).toContain('marked as read');
    expect(prisma.conversationParticipant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { conversationId: 'conversation-1', userId: 'client-1', leftAt: null },
        data: { lastReadAt: expect.any(Date) },
      }),
    );
  });

  it('getStatusId fails clearly when status is missing and creation fails', async () => {
    prisma.status.findFirst.mockResolvedValueOnce(null);
    prisma.status.create.mockRejectedValueOnce(new Error('Failed to create status'));

    await expect(service.getStatusId('MESSAGE', 'READ')).rejects.toThrow(
      Error,
    );
  });
});
