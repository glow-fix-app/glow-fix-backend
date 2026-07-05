import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogEntityType, LogAction } from '@prisma/client';

export class AuditLogActorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class AuditLogResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiPropertyOptional({ example: 'uuid-v4', nullable: true })
  actorId: string | null;

  @ApiProperty({ enum: LogEntityType })
  entityType: LogEntityType;

  @ApiProperty()
  entityId: string;

  @ApiProperty({ enum: LogAction })
  action: LogAction;

  @ApiPropertyOptional({ nullable: true, description: 'State before the change' })
  oldData: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, description: 'State after the change' })
  newData: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  ipAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  userAgent: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ type: AuditLogActorDto, nullable: true })
  actor: AuditLogActorDto | null;
}

export class PaginationMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class AuditLogListResponseDto {
  @ApiProperty({ type: [AuditLogResponseDto] })
  data: AuditLogResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}