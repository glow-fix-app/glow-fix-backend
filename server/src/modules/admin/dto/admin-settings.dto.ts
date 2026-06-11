import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsInt, Min, Max, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSystemSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  business_fee_pct?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  max_cancel_minutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  max_booking_advance_days?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  min_booking_cancel_hours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  maintenance_mode?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maintenance_message?: string;
}

export class SystemSettingsResponseDto {
  @ApiProperty()
  business_fee_pct: number;

  @ApiProperty()
  max_cancel_minutes: number;

  @ApiProperty()
  max_booking_advance_days: number;

  @ApiProperty()
  min_booking_cancel_hours: number;

  @ApiProperty()
  maintenance_mode: boolean;

  @ApiPropertyOptional()
  maintenance_message?: string;

  @ApiProperty()
  updated_at: Date;
}