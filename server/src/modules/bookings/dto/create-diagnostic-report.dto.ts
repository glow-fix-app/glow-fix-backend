import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReportFindingDto } from './create-report-finding.dto';
import { CreateRecommendedRepairDto } from './create-recommended-repair.dto';

export class CreateDiagnosticReportDto {
  @ApiProperty({ description: 'Summary description of the diagnostic report' })
  @IsNotEmpty()
  @IsString()
  summary: string;

  @ApiPropertyOptional({ description: 'Expiration date of the diagnostics validity (ISO format)' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({ description: 'Estimated duration for repairs in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  estimatedDuration?: number;

  @ApiPropertyOptional({ description: 'List of issues found', type: [CreateReportFindingDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportFindingDto)
  findings?: CreateReportFindingDto[];

  @ApiPropertyOptional({ description: 'List of suggested repairs', type: [CreateRecommendedRepairDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecommendedRepairDto)
  recommendedRepairs?: CreateRecommendedRepairDto[];
}
