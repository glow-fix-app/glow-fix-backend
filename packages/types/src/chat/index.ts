import { BaseEntity } from '../common/index';
import { ChatMessageType } from '../enums/index';

export interface ChatConversation extends BaseEntity {
  bookingId: string | null;
  customerId: string;
  staffId: string | null;
  lastMessageAt: Date;
  customerUnreadCount: number;
  staffUnreadCount: number;
  isClosed: boolean;
}

export interface ChatMessage extends BaseEntity {
  conversationId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'STAFF';
  type: ChatMessageType;
  content: string;
  mediaUrls: string[];
  readAt: Date | null;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type?: ChatMessageType;
  mediaUrls?: string[];
}