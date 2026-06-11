import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatStatusEntity } from './chat-status.entity';
import { ChatUserEntity } from './chat-user.entity';

export class AttachmentPayloadEntity {
  @ApiProperty({ description: 'URL of the uploaded attachment' })
  url!: string;

  @ApiProperty({ description: 'S3/R2 storage key' })
  storageKey!: string;

  @ApiPropertyOptional({ description: 'Optional text caption', type: String, nullable: true })
  caption!: string | null;
}

export class ChatMessageEntity {
  @ApiProperty({ description: 'Message ID' })
  id!: string;

  @ApiProperty({ description: 'Conversation ID' })
  conversationId!: string;

  @ApiProperty({ description: 'User ID of the sender' })
  senderUserId!: string;

  @ApiProperty({ description: 'Role of the sender' })
  senderRole!: string;

  @ApiProperty({ description: 'Message type (TEXT, FILE, SYSTEM)' })
  type!: string;

  @ApiPropertyOptional({
    description: 'Message text body or attachment metadata object',
    type: 'object',
    nullable: true,
  })
  body!: string | AttachmentPayloadEntity | null;

  @ApiProperty({ description: 'Status ID' })
  statusId!: string;

  @ApiPropertyOptional({ description: 'Timestamp when message was delivered', type: Date, nullable: true })
  deliveredAt!: Date | null;

  @ApiPropertyOptional({ description: 'Timestamp when message was read', type: Date, nullable: true })
  readAt!: Date | null;

  @ApiPropertyOptional({ description: 'Timestamp when message was edited', type: Date, nullable: true })
  editedAt!: Date | null;

  @ApiPropertyOptional({ description: 'Timestamp when message was deleted', type: Date, nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ description: 'Timestamp when message was created', type: Date })
  createdAt!: Date;

  @ApiProperty({ description: 'Timestamp when message was last updated', type: Date })
  updatedAt!: Date;

  @ApiProperty({ description: 'Message status details', type: () => ChatStatusEntity })
  status!: ChatStatusEntity;

  @ApiProperty({ description: 'Sender user details', type: () => ChatUserEntity })
  sender!: ChatUserEntity;
}
