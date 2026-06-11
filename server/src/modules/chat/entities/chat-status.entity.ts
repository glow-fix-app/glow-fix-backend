import { ApiProperty } from '@nestjs/swagger';

export class ChatStatusEntity {
  @ApiProperty({ description: 'Status ID' })
  id!: string;

  @ApiProperty({ description: 'Status context name (e.g. OPEN, CLOSED, SENT, DELIVERED, READ)' })
  context!: string;
}
