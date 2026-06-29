import { ParticipantRole } from '@prisma/client';
import { ConversationCreateType } from '../dto/create-conversation.dto';

export interface ParticipantInput {
  userId: string;
  role: ParticipantRole;
}

export interface IChatRepository {
  getStatusId(context: string, name: string): Promise<string>;
  findAvatars(userIds: string[]): Promise<Map<string, string>>;
  
  // Conversations
  listConversations(userId: string): Promise<any[]>;
  getConversation(id: string, userId: string): Promise<any | null>;
  findBooking(bookingId: string): Promise<any | null>;
  findAdmin(): Promise<{ id: string } | null>;
  findUsersByIds(userIds: string[]): Promise<any[]>;
  findExistingConversation(
    type: ConversationCreateType,
    statusId: string,
    participantIds: string[]
  ): Promise<{ id: string } | null>;
  findExistingBookingConversation(
    bookingId: string,
    type: ConversationCreateType,
    statusId: string
  ): Promise<{ id: string } | null>;
  createConversation(data: any): Promise<{ id: string }>;
  fetchConversationById(id: string): Promise<any>;
  
  // Participants
  ensureParticipants(conversationId: string, participants: ParticipantInput[]): Promise<void>;
  assertParticipant(conversationId: string, userId: string): Promise<void>;
  updateParticipantsRead(conversationId: string, userId: string, date: Date): Promise<void>;
  
  // Messages
  listMessages(conversationId: string, limit: number, skip: number, cursor?: string): Promise<[any[], number]>;
  createMessageAndUpdateConversation(messageData: any, conversationId: string, date: Date): Promise<any>;
  findMessage(messageId: string): Promise<any | null>;
  updateMessageDeliveredAt(messageId: string, date: Date): Promise<void>;
  updateMessageReadStatus(messageId: string, readAt: Date, deliveredAt: Date): Promise<void>;
  updateMessageBody(messageId: string, body: string, date: Date): Promise<any>;
  deleteMessage(messageId: string, statusId: string, date: Date): Promise<any>;
}
