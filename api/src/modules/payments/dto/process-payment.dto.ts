import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsEnum, IsBoolean, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethodType {
  CARD = 'CARD',
  CASH = 'CASH',
  WALLET = 'WALLET',
}

export enum PaymentType {
  SERVICE = 'SERVICE',
  REPAIR_AUTHORIZATION = 'REPAIR_AUTHORIZATION',
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  booking_id: string;

  @ApiProperty({ enum: PaymentMethodType, description: 'Payment method' })
  @IsEnum(PaymentMethodType)
  payment_method: PaymentMethodType;

  @ApiPropertyOptional({ description: 'Payment provider (e.g., stripe, paymob)', example: 'stripe' })
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
  amount?: number;

  @ApiPropertyOptional({ description: 'Redeem loyalty points' })
  @IsOptional()
  @IsBoolean()
  redeem_points?: boolean;

  @ApiPropertyOptional({ description: 'Points to redeem (if not all)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  points_to_redeem?: number;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  booking_id: string;
  @ApiProperty({ enum: PaymentType })
  type: PaymentType;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  currency: string;
  @ApiProperty({ enum: ['PENDING', 'PAID', 'FAILED'] })
  status: string;
  @ApiPropertyOptional()
  provider_ref?: string;
  @ApiPropertyOptional()
  paid_at?: Date;
  @ApiProperty()
  created_at: Date;
}