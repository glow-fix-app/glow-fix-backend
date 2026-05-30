import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessDocumentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}