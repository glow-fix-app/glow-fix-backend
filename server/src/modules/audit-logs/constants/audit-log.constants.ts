import { LogEntityType, LogAction } from '@prisma/client';

export const AUDIT_LOG_REPOSITORY_TOKEN = 'AUDIT_LOG_REPOSITORY';

export const DEFAULT_AUDIT_LOG_PAGE = 1;
export const DEFAULT_AUDIT_LOG_LIMIT = 20;
export const MAX_AUDIT_LOG_LIMIT = 100;
export const DEFAULT_CLEANUP_DAYS = 90;

// Re-export Prisma enums for convenience
export { LogEntityType, LogAction };
