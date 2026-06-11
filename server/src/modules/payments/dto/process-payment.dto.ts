import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
  WALLET = 'WALLET',
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  booking_id: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Payment provider (stripe, paymob, etc.)' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'Payment provider token/card ID' })
  @IsOptional()
  @IsString()
  provider_token?: string;

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
}

export class ProcessPaymentResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  payment_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  loyalty_points_used: number;

  @ApiProperty()
  loyalty_points_earned: number;

  @ApiProperty()
  receipt_url: string;

  @ApiProperty()
  message: string;
}