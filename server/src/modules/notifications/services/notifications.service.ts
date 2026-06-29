import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import { NotificationsQueryDto } from '../dto/notifications-query.dto';
import { sanitizeNotification } from '../presenters/notifications.presenter';
import { NotificationsRepository } from '../repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repository: NotificationsRepository,
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
    let type = await this.repository.findTypeByCode(input.typeCode);
    if (!type) {
      type = await this.repository.createType(input.typeCode, input.typeCode.replace(/_/g, ' '));
    }

    const notification = await this.repository.createNotification({
      recipientUserId: input.recipientUserId,
      actorUserId: input.actorUserId ?? null,
      typeId: type.id,
      title: input.title,
      body: input.body ?? null,
      actionUrl: input.actionUrl ?? null,
      sentAt: new Date(),
    });

    const sanitized = sanitizeNotification(notification, { includeRecipient: true });
    this.gateway.emitNotificationCreated(input.recipientUserId, sanitized);
    return sanitized;
  }

  async listForUser(userId: string, query: NotificationsQueryDto) {
    const [items, total] = await this.repository.findNotificationsForUser(userId, query);

    const limit = Number(query.limit) || 20;
    const page = Number(query.page) || 1;

    return {
      data: items.map((item) => sanitizeNotification(item, { includeRecipient: true })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  unreadCount(userId: string): Promise<number> {
    return this.repository.countUnreadForUser(userId);
  }

  async markRead(notificationId: string, userId: string) {
    await this.ensureOwnership(notificationId, userId);

    const updated = await this.repository.markRead(notificationId);
    const sanitized = sanitizeNotification(updated, { includeRecipient: true });
    this.gateway.emitNotificationRead(userId, sanitized);
    return sanitized;
  }

  async markAllRead(userId: string) {
    const count = await this.repository.markAllReadForUser(userId);
    this.gateway.emitNotificationReadAll(userId, { count });
    return { count };
  }

  async delete(notificationId: string, userId: string): Promise<void> {
    await this.ensureOwnership(notificationId, userId);
    await this.repository.deleteNotification(notificationId);
    this.gateway.emitNotificationDeleted(userId, { id: notificationId });
  }

  private async ensureOwnership(notificationId: string, userId: string) {
    const notification = await this.repository.findNotificationByIdAndUser(notificationId, userId);

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

