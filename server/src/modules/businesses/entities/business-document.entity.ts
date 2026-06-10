import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessDocumentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;
}
