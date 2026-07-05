import { BaseEntity } from '../common/index';
import { NotificationChannel } from '../enums/index';

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  type: string;
  data: Record<string, unknown> | null;
  readAt: Date | null;
}

export interface SendNotificationRequest {
  userId: string;
  type: string;
  channels?: NotificationChannel[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface BroadcastNotificationRequest {
  title: string;
  body: string;
  channels: NotificationChannel[];
}