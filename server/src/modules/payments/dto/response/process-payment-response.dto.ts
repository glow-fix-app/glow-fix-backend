import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessPaymentResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  payment_id?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  client_secret?: string;

  @ApiPropertyOptional()
  payment_intent_id?: string;

  @ApiPropertyOptional()
  loyalty_points_used?: number;

  @ApiPropertyOptional()
  loyalty_points_earned?: number;

  @ApiPropertyOptional()
  receipt_url?: string;

  @ApiPropertyOptional()
  message?: string;
}
