import { SetMetadata } from '@nestjs/common';
import { LogEntityType, LogAction } from '@prisma/client';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogMetadata {
  /** The type of entity this action targets (e.g. USER, BOOKING) */
  entityType: LogEntityType;
  /** The action being performed */
  action: LogAction;
  /**
   * Optional name of the route param that holds the entity ID.
   * Defaults to 'id' if not specified.
   * Example: for @Param('userId') set entityIdParam: 'userId'
   */
  entityIdParam?: string;
}

/**
 * Decorator that marks a controller method for automatic audit logging.
 * Requires `AuditLogsInterceptor` to be applied on the controller or globally.
 *
 * @example
 * @Patch(':id')
 * @AuditLog({ entityType: LogEntityType.USER, action: LogAction.UPDATED })
 * async update(@Param('id') id: string, ...) { ... }
 */
export const AuditLog = (metadata: AuditLogMetadata) =>
  SetMetadata(AUDIT_LOG_KEY, { entityIdParam: 'id', ...metadata });