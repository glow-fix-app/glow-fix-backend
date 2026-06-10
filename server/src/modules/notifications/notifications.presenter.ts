import { Prisma } from '@prisma/client';

export const notificationUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
} as const;

export const notificationTypeSelect = {
  id: true,
  code: true,
  label: true,
} as const;

export const notificationDetailsSelect = {
  id: true,
  recipientUserId: true,
  actorUserId: true,
  typeId: true,
  title: true,
  body: true,
  actionUrl: true,
  readAt: true,
  sentAt: true,
  createdAt: true,
  type: { select: notificationTypeSelect },
  actor: { select: notificationUserSelect },
  recipient: { select: notificationUserSelect },
} as const satisfies Prisma.NotificationSelect;

type NotificationDetails = {
  id: string;
  recipientUserId: string;
  actorUserId: string | null;
  typeId: string;
  title: string;
  body: string | null;
  actionUrl: string | null;
  readAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  type: {
    id: string;
    code: string;
    label: string;
  };
  actor: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
  recipient?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
};

export type SanitizedNotification = {
  id: string;
  recipientUserId: string;
  actorUserId: string | null;
  typeId: string;
  title: string;
  body: string | null;
  actionUrl: string | null;
  readAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  type: NotificationDetails['type'];
  actor: NotificationDetails['actor'];
  recipient?: NonNullable<NotificationDetails['recipient']> | null;
};

export function sanitizeNotification(
  notification: NotificationDetails,
  options: { includeRecipient?: boolean } = {},
): SanitizedNotification {
  const actor = notification.actor
    ? {
        id: notification.actor.id,
        fullName: notification.actor.fullName,
        email: notification.actor.email,
        role: notification.actor.role,
      }
    : null;

  const sanitized = {
    id: notification.id,
    recipientUserId: notification.recipientUserId,
    actorUserId: notification.actorUserId,
    typeId: notification.typeId,
    title: notification.title,
    body: notification.body,
    actionUrl: notification.actionUrl,
    readAt: notification.readAt,
    sentAt: notification.sentAt,
    createdAt: notification.createdAt,
    type: {
      id: notification.type.id,
      code: notification.type.code,
      label: notification.type.label,
    },
    actor,
  };

  if (options.includeRecipient) {
    return {
      ...sanitized,
      recipient: notification.recipient
        ? {
            id: notification.recipient.id,
            fullName: notification.recipient.fullName,
            email: notification.recipient.email,
            role: notification.recipient.role,
          }
        : null,
    };
  }

  return sanitized;
}
