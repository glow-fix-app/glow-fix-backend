import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';
import { LogEntityType, LogAction } from '@prisma/client';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ description: 'ID of the user performing the action' })
  @IsOptional()
  @IsUUID()
  actorId?: string;

  @ApiProperty({ enum: LogEntityType, description: 'Type of entity being acted upon' })
  @IsNotEmpty()
  @IsEnum(LogEntityType)
  entityType: LogEntityType;

  @ApiProperty({ description: 'ID of the entity being acted upon' })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  @ApiProperty({ enum: LogAction, description: 'Action performed' })
  @IsNotEmpty()
  @IsEnum(LogAction)
  action: LogAction;

  @ApiPropertyOptional({ description: 'State before the change (null for CREATED)' })
  @IsOptional()
  @IsObject()
  oldData?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'State after the change (null for DELETED)' })
  @IsOptional()
  @IsObject()
  newData?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'IP address of the actor' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent of the actor' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}