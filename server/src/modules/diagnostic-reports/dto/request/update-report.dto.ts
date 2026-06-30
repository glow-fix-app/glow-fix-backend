import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFindingDto, CreateRepairDto } from './create-report.dto';

export class UpdateDiagnosticReportDto {
  @ApiPropertyOptional({ description: 'Report summary' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ type: [CreateFindingDto], description: 'Updated findings' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFindingDto)
  findings?: CreateFindingDto[];

  @ApiPropertyOptional({ type: [CreateRepairDto], description: 'Updated recommended repairs' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepairDto)
  recommended_repairs?: CreateRepairDto[];

  @ApiPropertyOptional({ description: 'Estimated total duration (minutes)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimated_duration?: number;
}
