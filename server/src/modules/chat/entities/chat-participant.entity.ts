import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatUserEntity } from './chat-user.entity';

export class ChatParticipantEntity {
  @ApiProperty({ description: 'Participant record ID' })
  id!: string;

  @ApiProperty({ description: 'Conversation ID' })
  conversationId!: string;

  @ApiProperty({ description: 'User ID of the participant' })
  userId!: string;

  @ApiProperty({ description: 'Participant role' })
  role!: string;

  @ApiPropertyOptional({ description: 'Timestamp when participant last read the messages', type: Date, nullable: true })
  lastReadAt!: Date | null;

  @ApiProperty({ description: 'Timestamp when participant joined the conversation', type: Date })
  joinedAt!: Date;

  @ApiPropertyOptional({ description: 'Timestamp when participant left the conversation', type: Date, nullable: true })
  leftAt!: Date | null;

  @ApiProperty({ description: 'User details', type: () => ChatUserEntity })
  user!: ChatUserEntity;
}
