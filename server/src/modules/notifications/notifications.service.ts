import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../core/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsQueryDto } from './dto/notifications-query.dto';
import {
  notificationDetailsSelect,
  sanitizeNotification,
} from './notifications.presenter';

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
    let type = await this.prisma.notificationType.findUnique({
      where: { code: input.typeCode },
    });
    if (!type) {
      type = await this.prisma.notificationType.create({
        data: { code: input.typeCode, label: input.typeCode.replace(/_/g, ' ') },
      });
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
      select: notificationDetailsSelect,
    });

    const sanitized = sanitizeNotification(notification, { includeRecipient: true });
    this.gateway.emitNotificationCreated(input.recipientUserId, sanitized);
    return sanitized;
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
        select: notificationDetailsSelect,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: items.map((item) => sanitizeNotification(item, { includeRecipient: true })),
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
    const notification = await this.ensureOwnership(notificationId, userId);

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: notification.readAt ?? new Date() },
      select: notificationDetailsSelect,
    });
    const sanitized = sanitizeNotification(updated, { includeRecipient: true });
    this.gateway.emitNotificationRead(userId, sanitized);
    return sanitized;
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
    await this.ensureOwnership(notificationId, userId);
    await this.prisma.notification.delete({ where: { id: notificationId } });
    this.gateway.emitNotificationDeleted(userId, { id: notificationId });
  }

  private async ensureOwnership(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, recipientUserId: userId },
      select: { id: true, readAt: true },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  @OnEvent('business.approved')
  async handleBusinessApproved(payload: { businessId: string; businessName: string; managerId: string }) {
    if (payload.managerId) {
      await this.createNotification({
        recipientUserId: payload.managerId,
        typeCode: 'BUSINESS_APPROVED',
        title: 'Business Approved',
        body: `Congratulations! Your business "${payload.businessName}" has been approved and is now active.`,
        actionUrl: `/provider/dashboard`,
      });
    }
  }

  @OnEvent('business.rejected')
  async handleBusinessRejected(payload: { businessId: string; businessName: string; managerId: string; reason?: string }) {
    if (payload.managerId) {
      await this.createNotification({
        recipientUserId: payload.managerId,
        typeCode: 'BUSINESS_REJECTED',
        title: 'Business Application Rejected',
        body: `Your business application for "${payload.businessName}" was rejected. Reason: ${payload.reason || 'Not specified'}`,
        actionUrl: `/provider/settings`,
      });
    }
  }
}
