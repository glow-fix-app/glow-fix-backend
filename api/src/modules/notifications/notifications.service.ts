import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsQueryDto } from './dto/notifications-query.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createNotification(input: {
    recipientUserId: string;
    actorUserId?: string;
    typeCode: string;
    title: string;
    body?: string;
    actionUrl?: string;
  }) {
    const type = await this.prisma.notificationType.findUnique({
      where: { code: input.typeCode },
    });
    if (!type) {
      throw new NotFoundException('Notification type not found');
    }

    const notification = await this.prisma.notification.create({
      data: {
        recipientUserId: input.recipientUserId,
        actorUserId: input.actorUserId ?? null,
        typeId: type.id,
        title: input.title,
        body: input.body ?? null,
        actionUrl: input.actionUrl ?? null,
        sentAt: new Date(),
      },
      include: { type: true, actor: true, recipient: true },
    });

    this.gateway.emitNotificationCreated(input.recipientUserId, notification);
    return notification;
  }

  async listForUser(userId: string, query: NotificationsQueryDto) {
    const where = {
      recipientUserId: userId,
      ...(query.unreadOnly ? { readAt: null } : {}),
      ...(query.typeCode ? { type: { code: query.typeCode } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        include: { type: true, actor: true },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { recipientUserId: userId, readAt: null } });
  }

  async markRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.recipientUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: notification.readAt ?? new Date() },
    });
    this.gateway.emitNotificationRead(userId, updated);
    return updated;
  }

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { recipientUserId: userId, readAt: null },
      data: { readAt: new Date() },
    });
    this.gateway.emitNotificationReadAll(userId, { count: result.count });
    return result;
  }

  async delete(notificationId: string, userId: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.recipientUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await this.prisma.notification.delete({ where: { id: notificationId } });
  }
}
