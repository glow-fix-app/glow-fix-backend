import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { LogEntityType, LogAction } from '@prisma/client';

export class QueryAuditLogsDto {
  @ApiPropertyOptional({ description: 'Filter by actor (user) UUID' })
  @IsOptional()
  @IsUUID()
  actorId?: string;

  @ApiPropertyOptional({ enum: LogEntityType, description: 'Filter by entity type' })
  @IsOptional()
  @IsEnum(LogEntityType)
  entityType?: LogEntityType;

  @ApiPropertyOptional({ description: 'Filter by entity ID' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ enum: LogAction, description: 'Filter by action' })
  @IsOptional()
  @IsEnum(LogAction)
  action?: LogAction;

  @ApiPropertyOptional({ description: 'Filter logs from this date (ISO 8601)', example: '2025-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter logs up to this date (ISO 8601)', example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}