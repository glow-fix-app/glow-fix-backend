import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Placeholder for audit log field-level detail records.
 * Future expansion: store field-by-field diffs here.
 */
export class AuditLogDetailEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Reference to the parent AuditLog entry' })
  auditLogId: string;

  @ApiProperty({ description: 'Field name that changed' })
  fieldName: string;

  @ApiPropertyOptional({ nullable: true, description: 'Old value of the field' })
  oldValue: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'New value of the field' })
  newValue: string | null;
}
