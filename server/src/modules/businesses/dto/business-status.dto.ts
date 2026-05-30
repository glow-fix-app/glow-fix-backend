import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum BusinessStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export class UpdateBusinessStatusDto {
  @ApiProperty({ enum: BusinessStatus })
  @IsEnum(BusinessStatus)
  status: BusinessStatus;

  @ApiPropertyOptional({ description: 'Required when status is REJECTED or SUSPENDED' })
  @IsOptional()
  @IsString()
  rejection_reason?: string;
}

export class BusinessStatusResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiProperty()
  created_at: Date;
}