import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogEntityType, LogAction } from '@prisma/client';

/**
 * TypeScript representation of the audit_logs Prisma model.
 * Used for typing and Swagger documentation - not a TypeORM entity.
 */
export class AuditLogEntity {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  actorId: string | null;

  @ApiProperty({ enum: LogEntityType })
  entityType: LogEntityType;

  @ApiProperty()
  entityId: string;

  @ApiProperty({ enum: LogAction })
  action: LogAction;

  @ApiPropertyOptional({ nullable: true })
  oldData: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  newData: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  ipAddress: string | null;

  @ApiPropertyOptional({ nullable: true })
  userAgent: string | null;

  @ApiProperty()
  createdAt: Date;
}
