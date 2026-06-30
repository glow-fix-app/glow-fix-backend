/**
 * Chat presenter — selects and typed output shapes for all chat entities.
 *
 * Following the same pattern as notifications.presenter.ts:
 *   1. Prisma `select` objects (type-safe at compile time)
 *   2. Inferred `*Record` types via `Prisma.XxxGetPayload`
 *   3. Sanitised output classes stripped of internal DB fields
 *   4. Pure presenter functions with no side-effects
 */

import { Prisma } from '@prisma/client';
import { decryptMessage } from '../../../core/utils/encryption.util';
import {
  ChatUserEntity,
  ChatStatusEntity,
  ChatParticipantEntity,
  AttachmentPayloadEntity,
} from '../entities';
import { ConversationResponseDto } from '../dto/conversation-response.dto';
import { MessageResponseDto } from '../dto/message-response.dto';

// ─── Select Objects ───────────────────────────────────────────────────────────

export const chatUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
} as const satisfies Prisma.UserSelect;

export const chatStatusSelect = {
  id: true,
  context: true,
} as const satisfies Prisma.StatusSelect;

export const chatParticipantSelect = {
  id: true,
  conversationId: true,
  userId: true,
  role: true,
  lastReadAt: true,
  joinedAt: true,
  leftAt: true,
  user: { select: chatUserSelect },
} as const satisfies Prisma.ConversationParticipantSelect;

export const chatMessageSelect = {
  id: true,
  conversationId: true,
  senderUserId: true,
  senderRole: true,
  type: true,
  body: true,
  statusId: true,
  deliveredAt: true,
  readAt: true,
  editedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  status: { select: chatStatusSelect },
  sender: { select: chatUserSelect },
} as const satisfies Prisma.MessageSelect;

export const chatConversationSelect = {
  id: true,
  bookingId: true,
  type: true,
  statusId: true,
  closedAt: true,
  createdAt: true,
  updatedAt: true,
  status: { select: chatStatusSelect },
  participants: {
    where: { leftAt: null },
    select: chatParticipantSelect,
  },
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    select: chatMessageSelect,
  },
} as const satisfies Prisma.ConversationSelect;

// ─── Inferred Record Types ────────────────────────────────────────────────────

export type ConversationRecord = Prisma.ConversationGetPayload<{
  select: typeof chatConversationSelect;
}>;

export type MessageRecord = Prisma.MessageGetPayload<{
  select: typeof chatMessageSelect;
}>;

// ─── Presenter Functions ──────────────────────────────────────────────────────

export function presentConversation(record: ConversationRecord): ConversationResponseDto {
  const conversation = new ConversationResponseDto();
  
  conversation.id = record.id;
  conversation.bookingId = record.bookingId;
  conversation.type = record.type;
  conversation.statusId = record.statusId;
  conversation.closedAt = record.closedAt;
  conversation.createdAt = record.createdAt;
  conversation.updatedAt = record.updatedAt;
  
  const status = new ChatStatusEntity();
  status.id = record.status.id;
  status.context = record.status.context;
  conversation.status = status;

  conversation.participants = record.participants.map((p) => {
    const participant = new ChatParticipantEntity();
    participant.id = p.id;
    participant.conversationId = p.conversationId;
    participant.userId = p.userId;
    participant.role = p.role;
    participant.lastReadAt = p.lastReadAt;
    participant.joinedAt = p.joinedAt;
    participant.leftAt = p.leftAt;

    const user = new ChatUserEntity();
    user.id = p.user.id;
    user.fullName = p.user.fullName;
    user.email = p.user.email;
    user.role = p.user.role;
    participant.user = user;

    return participant;
  });

  // Attach last message preview
  const lastMsgRecord = record.messages?.[0];
  conversation.lastMessage = lastMsgRecord ? presentMessage(lastMsgRecord) : null;

  return conversation;
}

export function presentMessage(record: MessageRecord): MessageResponseDto {
  let body: string | AttachmentPayloadEntity | null = null;

  if (!record.deletedAt && record.body) {
    const decryptedBody = decryptMessage(record.body);
    if (record.type === 'FILE') {
      // Parse attachment JSON safely; fall back to raw string if malformed
      try {
        const parsed = JSON.parse(decryptedBody);
        const attachment = new AttachmentPayloadEntity();
        attachment.url = parsed.url;
        attachment.storageKey = parsed.storageKey;
        attachment.caption = parsed.caption || null;
        body = attachment;
      } catch {
        body = decryptedBody;
      }
    } else {
      body = decryptedBody;
    }
  }

  const message = new MessageResponseDto();
  message.id = record.id;
  message.conversationId = record.conversationId;
  message.senderUserId = record.senderUserId ?? '';
  message.senderRole = record.senderRole;
  message.type = record.type;
  message.body = body;
  message.statusId = record.statusId;
  message.deliveredAt = record.deliveredAt;
  message.readAt = record.readAt;
  message.editedAt = record.editedAt;
  message.deletedAt = record.deletedAt;
  message.createdAt = record.createdAt;
  message.updatedAt = record.updatedAt;

  const status = new ChatStatusEntity();
  status.id = record.status.id;
  status.context = record.status.context;
  message.status = status;

  const sender = new ChatUserEntity();
  if (record.sender) {
    sender.id = record.sender.id;
    sender.fullName = record.sender.fullName;
    sender.email = record.sender.email;
    sender.role = record.sender.role;
  } else {
    sender.id = 'system';
    sender.fullName = 'System';
    sender.email = 'system@glowfix.com';
    sender.role = 'SYSTEM';
  }
  message.sender = sender;

  return message;
}
