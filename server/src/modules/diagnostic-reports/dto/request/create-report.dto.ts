import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsArray, IsOptional, IsInt, Min, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { FindingPriority, DEFAULT_VALID_HOURS } from '../../constants/diagnostic-report.constants';

export class CreateFindingDto {
  @ApiProperty({ description: 'Finding title', example: 'Timing belt — visible cracking' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Finding description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: FindingPriority, description: 'Priority level' })
  @IsEnum(FindingPriority)
  priority: FindingPriority;
}

export class CreateRepairDto {
  @ApiProperty({ description: 'Business service ID (from assigned services)' })
  @IsUUID()
  business_service_id: string;

  @ApiPropertyOptional({ description: 'Custom title (overrides service title)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Custom description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Custom price' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Custom duration' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration_minutes?: number;
}

export class CreateDiagnosticReportDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsString()
  booking_id: string;

  @ApiProperty({ description: 'Report summary' })
  @IsString()
  summary: string;

  @ApiProperty({ type: [CreateFindingDto], description: 'List of findings' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFindingDto)
  findings: CreateFindingDto[];

  @ApiProperty({ type: [CreateRepairDto], description: 'List of recommended repairs' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairDto)
  recommended_repairs: CreateRepairDto[];

  @ApiPropertyOptional({ description: 'Estimated total duration (minutes)', example: 240 })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_duration?: number;

  @ApiPropertyOptional({ description: 'Valid for hours', default: DEFAULT_VALID_HOURS })
  @IsOptional()
  @IsInt()
  @Min(1)
  valid_hours?: number;
}
