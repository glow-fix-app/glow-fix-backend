// modules/payments/dto/process-payment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  booking_id: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Stripe payment method ID (for card payments)' })
  @IsOptional()
  @IsString()
  payment_method_id?: string;

  @ApiPropertyOptional({ description: 'Amount to pay (overrides calculated amount)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({ description: 'Redeem loyalty points' })
  @IsOptional()
  @IsBoolean()
  redeem_points?: boolean;

  @ApiPropertyOptional({ description: 'Points to redeem (if not all)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  points_to_redeem?: number;

  @ApiPropertyOptional({ description: 'Save payment method for future use' })
  @IsOptional()
  @IsBoolean()
  save_payment_method?: boolean;
}

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

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Payment Intent ID from Stripe' })
  @IsString()
  payment_intent_id: string;

  @ApiPropertyOptional({ description: 'Payment method ID' })
  @IsOptional()
  @IsString()
  payment_method_id?: string;
}