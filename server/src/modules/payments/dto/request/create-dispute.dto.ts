import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { DisputeReason, DesiredOutcome } from '../../constants/payment.constants';

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
