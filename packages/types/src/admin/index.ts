import { AdminRole, Permission, LogAction, LogEntityType } from '../enums/index';
import { BaseEntity } from '../common/index';

export interface Admin extends BaseEntity {
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: Permission[];
}

export interface AuditLog extends BaseEntity {
  userId: string | null;
  action: LogAction;
  entityType: LogEntityType;
  entityId: string;
  details: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
}

export interface DashboardMetrics {
  activeBookings: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  newClients: number;
  averageServiceTime: number;
}