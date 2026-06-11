import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

export class ProcessPayoutDto {
  @ApiProperty({ description: 'Payout ID' })
  @IsUUID()
  payout_id: string;

  @ApiProperty({ description: 'Amount to process (in EGP)' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PayoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  processed_at?: Date;

  @ApiProperty()
  created_at: Date;
}