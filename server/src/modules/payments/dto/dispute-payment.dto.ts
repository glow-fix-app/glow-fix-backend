import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum DisputeReason {
  WORK_NOT_COMPLETED = 'WORK_NOT_COMPLETED',
  WORK_POOR_QUALITY = 'WORK_POOR_QUALITY',
  OVERCHARGED = 'OVERCHARGED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  OTHER = 'OTHER',
}

export enum DesiredOutcome {
  FULL_REFUND = 'FULL_REFUND',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  REDO_SERVICE = 'REDO_SERVICE',
}

export class CreateDisputeDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsUUID()
  payment_id: string;

  @ApiProperty({ enum: DisputeReason })
  @IsEnum(DisputeReason)
  reason: DisputeReason;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo_urls?: string[];

  @ApiProperty({ enum: DesiredOutcome })
  @IsEnum(DesiredOutcome)
  desired_outcome: DesiredOutcome;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  suggested_amount?: number;
}

export class DisputeResponseDto {
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

  @ApiProperty({ enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'] })
  status: string;

  @ApiPropertyOptional()
  resolution?: string;

  @ApiPropertyOptional()
  resolved_at?: Date;

  @ApiProperty()
  created_at: Date;
}