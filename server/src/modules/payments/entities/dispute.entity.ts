import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DisputeEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payment_id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({ type: [String] })
  photo_urls?: string[];

  @ApiProperty()
  desired_outcome: string;

  @ApiPropertyOptional()
  suggested_amount?: number;

  @ApiProperty({ enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'] })
  status: string;

  @ApiPropertyOptional()
  resolution?: string;

  @ApiPropertyOptional()
  resolved_at?: Date;

  @ApiProperty()
  created_at: Date;
}