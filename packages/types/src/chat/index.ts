import { BaseEntity } from '../common/index';
import { ConversationType, ParticipantRole } from '../enums/index';

export interface ChatConversation extends BaseEntity {
  bookingId: string | null;
  type: ConversationType;
  metadata: Record<string, unknown> | null;
}

export interface ChatParticipant extends BaseEntity {
  conversationId: string;
  userId: string;
  role: ParticipantRole;
  lastReadAt: Date | null;
}

export interface ChatMessage extends BaseEntity {
  conversationId: string;
  senderId: string | null;
  content: string;
  isSystem: boolean;
  metadata: Record<string, unknown> | null;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  isSystem?: boolean;
}