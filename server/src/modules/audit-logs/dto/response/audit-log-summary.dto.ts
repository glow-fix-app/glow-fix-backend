import { ApiProperty } from '@nestjs/swagger';
import { AuditLogResponseDto } from './audit-log-response.dto';

export class ActionCountDto {
  @ApiProperty({ description: 'Action name (e.g. CREATED, UPDATED)' })
  action: string;

  @ApiProperty()
  count: number;
}

export class EntityTypeCountDto {
  @ApiProperty({ description: 'Entity type (e.g. USER, BOOKING)' })
  entityType: string;

  @ApiProperty()
  count: number;
}

export class AuditLogSummaryDto {
  @ApiProperty({ description: 'Total number of audit log entries in the period' })
  totalLogs: number;

  @ApiProperty({ type: [ActionCountDto], description: 'Count of events grouped by action' })
  byAction: ActionCountDto[];

  @ApiProperty({ type: [EntityTypeCountDto], description: 'Count of events grouped by entity type' })
  byEntityType: EntityTypeCountDto[];

  @ApiProperty({ type: [AuditLogResponseDto], description: 'The 10 most recent audit log entries' })
  recentActivity: AuditLogResponseDto[];
}