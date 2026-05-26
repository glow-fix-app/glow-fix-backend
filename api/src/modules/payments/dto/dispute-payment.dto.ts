import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsOptional, MaxLength, IsArray, IsNumber } from 'class-validator';

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

  @ApiProperty({ enum: DisputeReason, description: 'Reason for dispute' })
  @IsEnum(DisputeReason)
  reason: DisputeReason;

  @ApiProperty({ description: 'Detailed description of what went wrong' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ description: 'Photo evidence URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo_urls?: string[];

  @ApiProperty({ enum: DesiredOutcome, description: 'Desired resolution' })
  @IsEnum(DesiredOutcome)
  desired_outcome: DesiredOutcome;

  @ApiPropertyOptional({ description: 'Suggested refund amount (for partial refund)' })
  @IsOptional()
  @IsNumber()
  suggested_amount?: number;
}

export class DisputeResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  payment_id: string;
  @ApiProperty()
  booking_id: string;
  @ApiProperty({ enum: DisputeReason })
  reason: DisputeReason;
  @ApiProperty()
  description: string;
  @ApiProperty({ enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'] })
  status: string;
  @ApiPropertyOptional({ enum: DesiredOutcome })
  desired_outcome?: DesiredOutcome;
  @ApiPropertyOptional()
  resolution?: string;
  @ApiPropertyOptional()
  resolved_at?: Date;
  @ApiProperty()
  created_at: Date;
}