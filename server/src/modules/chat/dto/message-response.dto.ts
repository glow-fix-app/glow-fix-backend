import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageEntity } from '../entities/chat-message.entity';

export class MessageResponseDto extends ChatMessageEntity {}

export class PaginatedMetaDto {
  @ApiProperty({ description: 'Total number of items matching the query' })
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  page!: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
}

export class MessageListResponseDto {
  @ApiProperty({ type: [MessageResponseDto], description: 'List of messages' })
  data!: MessageResponseDto[];

  @ApiProperty({ type: PaginatedMetaDto, description: 'Pagination metadata' })
  meta!: PaginatedMetaDto;
}
