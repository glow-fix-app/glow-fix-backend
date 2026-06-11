import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatStatusEntity } from './chat-status.entity';
import { ChatParticipantEntity } from './chat-participant.entity';
import { MessageResponseDto } from '../dto/message-response.dto';

export class ChatConversationEntity {
  @ApiProperty({ description: 'Conversation ID' })
  id!: string;

  @ApiPropertyOptional({ description: 'Optional booking ID associated with the conversation', type: String, nullable: true })
  bookingId!: string | null;

  @ApiProperty({ description: 'Conversation type (SUPPORT, GENERAL, BOOKING)' })
  type!: string;

  @ApiProperty({ description: 'Status ID' })
  statusId!: string;

  @ApiPropertyOptional({ description: 'Timestamp when conversation was closed', type: Date, nullable: true })
  closedAt!: Date | null;

  @ApiProperty({ description: 'Timestamp when conversation was created', type: Date })
  createdAt!: Date;

  @ApiProperty({ description: 'Timestamp when conversation was last updated', type: Date })
  updatedAt!: Date;

  @ApiProperty({ description: 'Conversation status details', type: () => ChatStatusEntity })
  status!: ChatStatusEntity;

  @ApiProperty({ description: 'List of active participants', type: () => [ChatParticipantEntity] })
  participants!: ChatParticipantEntity[];

  @ApiPropertyOptional({ description: 'Last message in the conversation', type: () => MessageResponseDto, nullable: true })
  lastMessage!: MessageResponseDto | null;
}
