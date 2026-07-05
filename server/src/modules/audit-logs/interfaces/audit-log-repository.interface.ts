import {
  AuditLogData,
  AuditLogFilter,
  AuditLogRecord,
  AuditLogSummary,
  PaginatedAuditLogs,
} from './audit-log.interface';

export interface IAuditLogRepository {
  create(data: AuditLogData): Promise<AuditLogRecord>;
  findMany(filter: AuditLogFilter): Promise<PaginatedAuditLogs>;
  findById(id: string): Promise<AuditLogRecord | null>;
  getSummary(startDate?: Date, endDate?: Date): Promise<AuditLogSummary>;
  deleteOlderThan(date: Date): Promise<number>;
}
