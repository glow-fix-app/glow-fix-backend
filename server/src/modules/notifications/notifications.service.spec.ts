import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: {
    notificationType: { findUnique: jest.Mock };
    notification: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let gateway: {
    emitNotificationCreated: jest.Mock;
    emitNotificationRead: jest.Mock;
    emitNotificationReadAll: jest.Mock;
  };

  const sanitizedActor = {
    id: 'actor-1',
    fullName: 'Actor User',
    email: 'actor@example.com',
    role: 'ADMIN',
  };

  const sanitizedRecipient = {
    id: 'recipient-1',
    fullName: 'Recipient User',
    email: 'recipient@example.com',
    role: 'CLIENT',
  };

  const notificationRecord = {
    id: 'notification-1',
    recipientUserId: 'recipient-1',
    actorUserId: 'actor-1',
    typeId: 'type-1',
    title: 'New notification',
    body: 'Hello',
    actionUrl: '/notifications/1',
    readAt: null,
    sentAt: new Date('2026-05-29T10:00:00.000Z'),
    createdAt: new Date('2026-05-29T10:00:00.000Z'),
    type: {
      id: 'type-1',
      code: 'GENERAL',
      label: 'General',
    },
    actor: {
      ...sanitizedActor,
      passwordHash: 'secret',
      twoFactorSecret: 'totp-secret',
      deletedAt: null,
      emailVerified: true,
      phoneVerified: true,
    },
    recipient: {
      ...sanitizedRecipient,
      passwordHash: 'recipient-secret',
      twoFactorSecret: 'recipient-totp-secret',
      deletedAt: null,
      emailVerified: true,
      phoneVerified: true,
    },
  };

  beforeEach(async () => {
    prisma = {
      notificationType: {
        findUnique: jest.fn(),
      },
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    gateway = {
      emitNotificationCreated: jest.fn(),
      emitNotificationRead: jest.fn(),
      emitNotificationReadAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get(NotificationsService);
    jest.clearAllMocks();
  });

  it('list own notifications returns sanitized payload', async () => {
    prisma.$transaction.mockResolvedValueOnce([[notificationRecord], 1]);

    const result = await service.listForUser('recipient-1', {
      page: 1,
      limit: 10,
      unreadOnly: false,
      typeCode: undefined,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].actor).toEqual(sanitizedActor);
    expect(result.data[0].recipient).toEqual(sanitizedRecipient);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('list does not include passwordHash, twoFactorSecret, deletedAt, emailVerified, phoneVerified', async () => {
    prisma.$transaction.mockResolvedValueOnce([[notificationRecord], 1]);

    const result = await service.listForUser('recipient-1', {
      page: 1,
      limit: 10,
      unreadOnly: false,
      typeCode: undefined,
    });

    expect(result.data[0].actor).not.toHaveProperty('passwordHash');
    expect(result.data[0].actor).not.toHaveProperty('twoFactorSecret');
    expect(result.data[0].actor).not.toHaveProperty('deletedAt');
    expect(result.data[0].actor).not.toHaveProperty('emailVerified');
    expect(result.data[0].actor).not.toHaveProperty('phoneVerified');
    expect(result.data[0].recipient).not.toHaveProperty('passwordHash');
    expect(result.data[0].recipient).not.toHaveProperty('twoFactorSecret');
    expect(result.data[0].recipient).not.toHaveProperty('deletedAt');
    expect(result.data[0].recipient).not.toHaveProperty('emailVerified');
    expect(result.data[0].recipient).not.toHaveProperty('phoneVerified');
  });

  it('unread count only counts current user', async () => {
    prisma.notification.count.mockResolvedValueOnce(3);

    const result = await service.unreadCount('recipient-1');

    expect(result).toBe(3);
    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: { recipientUserId: 'recipient-1', readAt: null },
    });
  });

  it('mark own notification as read', async () => {
    prisma.notification.findFirst.mockResolvedValueOnce({
      id: 'notification-1',
      readAt: null,
    });
    prisma.notification.update.mockResolvedValueOnce(notificationRecord);

    const result = await service.markRead('notification-1', 'recipient-1');

    expect(result.actor).toEqual(sanitizedActor);
    expect(gateway.emitNotificationRead).toHaveBeenCalledWith(
      'recipient-1',
      expect.objectContaining({ id: 'notification-1' }),
    );
  });

  it('cannot mark another user notification as read', async () => {
    prisma.notification.findFirst.mockResolvedValueOnce(null);

    await expect(service.markRead('notification-1', 'other-user')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('read all marks only current user notifications', async () => {
    prisma.notification.updateMany.mockResolvedValueOnce({ count: 2 });

    const result = await service.markAllRead('recipient-1');

    expect(result).toEqual({ count: 2 });
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { recipientUserId: 'recipient-1', readAt: null },
      data: { readAt: expect.any(Date) },
    });
  });

  it('delete own notification', async () => {
    prisma.notification.findFirst.mockResolvedValueOnce({
      id: 'notification-1',
      readAt: null,
    });
    prisma.notification.delete.mockResolvedValueOnce(notificationRecord);

    await service.delete('notification-1', 'recipient-1');

    expect(prisma.notification.delete).toHaveBeenCalledWith({
      where: { id: 'notification-1' },
    });
  });

  it('createNotification returns sanitized payload', async () => {
    prisma.notificationType.findUnique.mockResolvedValueOnce({
      id: 'type-1',
      code: 'GENERAL',
      label: 'General',
    });
    prisma.notification.create.mockResolvedValueOnce(notificationRecord);

    const result = await service.createNotification({
      recipientUserId: 'recipient-1',
      actorUserId: 'actor-1',
      typeCode: 'GENERAL',
      title: 'New notification',
      body: 'Hello',
      actionUrl: '/notifications/1',
    });

    expect(result.actor).toEqual(sanitizedActor);
    expect(result.recipient).toEqual(sanitizedRecipient);
    expect(result.actor).not.toHaveProperty('passwordHash');
    expect(result.recipient).not.toHaveProperty('twoFactorSecret');
    expect(gateway.emitNotificationCreated).toHaveBeenCalledWith(
      'recipient-1',
      expect.objectContaining({ id: 'notification-1' }),
    );
  });
});
