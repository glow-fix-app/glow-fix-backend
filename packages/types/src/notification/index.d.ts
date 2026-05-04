import { BaseEntity } from '../common/index';
import { NotificationChannel, NotificationType } from '../enums/index';
export interface Notification extends BaseEntity {
    userId: string;
    type: NotificationType;
    channel: NotificationChannel;
    title: string;
    body: string;
    data: Record<string, unknown> | null;
    read: boolean;
    readAt: Date | null;
    sentAt: Date | null;
    failedAt: Date | null;
    failureReason: string | null;
}
export interface NotificationTemplate extends BaseEntity {
    name: string;
    type: NotificationType;
    channels: NotificationChannel[];
    subject: string;
    body: string;
    variables: string[];
}
export interface SendNotificationRequest {
    userId: string;
    type: NotificationType;
    channels?: NotificationChannel[];
    data: Record<string, unknown>;
}
export interface BroadcastNotificationRequest {
    title: string;
    body: string;
    channels: NotificationChannel[];
    targetAudience?: 'all' | 'subscribers' | 'active';
    scheduledAt?: string;
}
