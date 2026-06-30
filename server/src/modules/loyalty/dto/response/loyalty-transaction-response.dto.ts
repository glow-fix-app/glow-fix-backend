import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyTransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  client_id: string;

  @ApiPropertyOptional()
  booking_id?: string;

  @ApiProperty({ enum: ['EARNED', 'REDEEMED'] })
  type: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  balance_after: number;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  booking_code?: string;

  @ApiPropertyOptional()
  business_name?: string;

  @ApiProperty()
  created_at: Date;
}
