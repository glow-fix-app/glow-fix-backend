import { AdminRole, Permission, AuditAction, SecurityEventSeverity, SecurityEventType } from '../enums/index';
import { BaseEntity } from '../common/index';

export interface Admin extends BaseEntity {
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: Permission[];
  twoFactorSecret: string | null;
  twoFactorEnabled: boolean;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
}

export interface AuditLog extends BaseEntity {
  adminId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
}

export interface SecurityEvent extends BaseEntity {
  eventType: SecurityEventType;
  severity: SecurityEventSeverity;
  userId: string | null;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, unknown>;
  resolved: boolean;
  resolvedBy: string | null;
  resolvedAt: Date | null;
}

export interface SystemConfig extends BaseEntity {
  key: string;
  value: Record<string, unknown>;
  description: string;
  updatedBy: string;
}

export interface DashboardMetrics {
  activeBookings: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  newCustomers: number;
  returningCustomers: number;
  averageServiceTime: number;
  staffUtilization: number;
  customerSatisfaction: number;
  queueLength: number;
}