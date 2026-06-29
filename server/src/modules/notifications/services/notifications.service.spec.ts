import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: {
    findTypeByCode: jest.Mock;
    createType: jest.Mock;
    createNotification: jest.Mock;
    findNotificationsForUser: jest.Mock;
    countUnreadForUser: jest.Mock;
    findNotificationByIdAndUser: jest.Mock;
    markRead: jest.Mock;
    markAllReadForUser: jest.Mock;
    deleteNotification: jest.Mock;
  };
  let gateway: {
    emitNotificationCreated: jest.Mock;
    emitNotificationRead: jest.Mock;
    emitNotificationReadAll: jest.Mock;
    emitNotificationDeleted: jest.Mock;
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
    repository = {
      findTypeByCode: jest.fn(),
      createType: jest.fn(),
      createNotification: jest.fn(),
      findNotificationsForUser: jest.fn(),
      countUnreadForUser: jest.fn(),
      findNotificationByIdAndUser: jest.fn(),
      markRead: jest.fn(),
      markAllReadForUser: jest.fn(),
      deleteNotification: jest.fn(),
    };

    gateway = {
      emitNotificationCreated: jest.fn(),
      emitNotificationRead: jest.fn(),
      emitNotificationReadAll: jest.fn(),
      emitNotificationDeleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsRepository, useValue: repository },
        { provide: NotificationsGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get(NotificationsService);
    jest.clearAllMocks();
  });

  it('list own notifications returns sanitized payload', async () => {
    repository.findNotificationsForUser.mockResolvedValueOnce([[notificationRecord], 1]);

    const result = await service.listForUser('recipient-1', {
      page: 1,
      limit: 10,
      unreadOnly: false,
      typeCode: undefined,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].actor).toEqual(sanitizedActor);
    expect(result.data[0].recipient).toEqual(sanitizedRecipient);
    expect(repository.findNotificationsForUser).toHaveBeenCalled();
  });

  it('list does not include passwordHash, twoFactorSecret, deletedAt, emailVerified, phoneVerified', async () => {
    repository.findNotificationsForUser.mockResolvedValueOnce([[notificationRecord], 1]);

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
    repository.countUnreadForUser.mockResolvedValueOnce(3);

    const result = await service.unreadCount('recipient-1');

    expect(result).toBe(3);
    expect(repository.countUnreadForUser).toHaveBeenCalledWith('recipient-1');
  });

  it('mark own notification as read', async () => {
    repository.findNotificationByIdAndUser.mockResolvedValueOnce({
      id: 'notification-1',
      readAt: null,
    });
    repository.markRead.mockResolvedValueOnce(notificationRecord);

    const result = await service.markRead('notification-1', 'recipient-1');

    expect(result.actor).toEqual(sanitizedActor);
    expect(gateway.emitNotificationRead).toHaveBeenCalledWith(
      'recipient-1',
      expect.objectContaining({ id: 'notification-1' }),
    );
  });

  it('cannot mark another user notification as read', async () => {
    repository.findNotificationByIdAndUser.mockResolvedValueOnce(null);

    await expect(service.markRead('notification-1', 'other-user')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('read all marks only current user notifications', async () => {
    repository.markAllReadForUser.mockResolvedValueOnce(2);

    const result = await service.markAllRead('recipient-1');

    expect(result).toEqual({ count: 2 });
    expect(repository.markAllReadForUser).toHaveBeenCalledWith('recipient-1');
  });

  it('delete own notification', async () => {
    repository.findNotificationByIdAndUser.mockResolvedValueOnce({
      id: 'notification-1',
      readAt: null,
    });
    repository.deleteNotification.mockResolvedValueOnce(undefined);

    await service.delete('notification-1', 'recipient-1');

    expect(repository.deleteNotification).toHaveBeenCalledWith('notification-1');
    expect(gateway.emitNotificationDeleted).toHaveBeenCalledWith(
      'recipient-1',
      { id: 'notification-1' },
    );
  });

  it('createNotification returns sanitized payload', async () => {
    repository.findTypeByCode.mockResolvedValueOnce({
      id: 'type-1',
      code: 'GENERAL',
      label: 'General',
    });
    repository.createNotification.mockResolvedValueOnce(notificationRecord);

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
