import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { INotificationRepository } from '../interfaces/notification-repository.interface';
import { notificationDetailsSelect } from '../presenters/notifications.presenter';

@Injectable()
export class NotificationsRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTypeByCode(code: string): Promise<any | null> {
    return this.prisma.notificationType.findUnique({
      where: { code },
    });
  }

  async createType(code: string, label: string): Promise<any> {
    return this.prisma.notificationType.create({
      data: { code, label },
    });
  }

  async createNotification(data: any): Promise<any> {
    return this.prisma.notification.create({
      data,
      select: notificationDetailsSelect,
    });
  }

  async findNotificationsForUser(userId: string, query: any): Promise<[any[], number]> {
    const where = {
      recipientUserId: userId,
      ...(query.unreadOnly ? { readAt: null } : {}),
      ...(query.typeCode ? { type: { code: query.typeCode } } : {}),
    };

    const limit = Number(query.limit) || 20;
    const page = Number(query.page) || 1;

    return this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        select: notificationDetailsSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);
  }

  async countUnreadForUser(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientUserId: userId, readAt: null },
    });
  }

  async findNotificationByIdAndUser(notificationId: string, userId: string): Promise<any | null> {
    return this.prisma.notification.findFirst({
      where: { id: notificationId, recipientUserId: userId },
      select: { id: true, readAt: true },
    });
  }

  async markRead(notificationId: string): Promise<any> {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
      select: notificationDetailsSelect,
    });
  }

  async markAllReadForUser(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { recipientUserId: userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}
