import { LogEntityType, LogAction } from '@prisma/client';

export interface AuditLogData {
  actorId?: string;
  entityType: LogEntityType;
  entityId: string;
  action: LogAction;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilter {
  actorId?: string;
  entityType?: LogEntityType;
  entityId?: string;
  action?: LogAction;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogs {
  data: AuditLogRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditLogRecord {
  id: string;
  actorId: string | null;
  entityType: LogEntityType;
  entityId: string;
  action: LogAction;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  actor?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;
}

export interface AuditLogSummary {
  totalLogs: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
  recentActivity: AuditLogRecord[];
}
