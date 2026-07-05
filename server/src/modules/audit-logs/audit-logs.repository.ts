import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { LogEntityType, LogAction, Prisma } from '@prisma/client';
import {
  AuditLogData,
  AuditLogFilter,
  AuditLogRecord,
  AuditLogSummary,
  PaginatedAuditLogs,
} from './interfaces/audit-log.interface';
import {
  DEFAULT_AUDIT_LOG_LIMIT,
  DEFAULT_AUDIT_LOG_PAGE,
  MAX_AUDIT_LOG_LIMIT,
} from './constants/audit-log.constants';

const ACTOR_SELECT = {
  id: true,
  fullName: true,
  email: true,
  role: true,
};

@Injectable()
export class AuditLogsRepository {
  private readonly logger = new Logger(AuditLogsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: AuditLogData): Promise<AuditLogRecord> {
    const entry = await this.prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldData: data.oldData != null ? (data.oldData as Prisma.InputJsonValue) : undefined,
        newData: data.newData != null ? (data.newData as Prisma.InputJsonValue) : undefined,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
      include: { actor: { select: ACTOR_SELECT } },
    });
    return this.mapToRecord(entry);
  }

  async findMany(filter: AuditLogFilter): Promise<PaginatedAuditLogs> {
    const page = filter.page ?? DEFAULT_AUDIT_LOG_PAGE;
    const limit = Math.min(filter.limit ?? DEFAULT_AUDIT_LOG_LIMIT, MAX_AUDIT_LOG_LIMIT);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filter);

    const [entries, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { actor: { select: ACTOR_SELECT } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: entries.map((e) => this.mapToRecord(e)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<AuditLogRecord | null> {
    const entry = await this.prisma.auditLog.findUnique({
      where: { id },
      include: { actor: { select: ACTOR_SELECT } },
    });
    return entry ? this.mapToRecord(entry) : null;
  }

  async getSummary(startDate?: Date, endDate?: Date): Promise<AuditLogSummary> {
    const dateFilter =
      startDate || endDate
        ? { createdAt: { gte: startDate, lte: endDate } }
        : {};

    const [total, byAction, byEntityType, recentEntries] = await Promise.all([
      this.prisma.auditLog.count({ where: dateFilter }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where: dateFilter,
        _count: { action: true },
      }),
      this.prisma.auditLog.groupBy({
        by: ['entityType'],
        where: dateFilter,
        _count: { entityType: true },
      }),
      this.prisma.auditLog.findMany({
        where: dateFilter,
        include: { actor: { select: ACTOR_SELECT } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalLogs: total,
      byAction: byAction.reduce(
        (acc, item) => ({ ...acc, [item.action]: item._count.action }),
        {} as Record<string, number>,
      ),
      byEntityType: byEntityType.reduce(
        (acc, item) => ({ ...acc, [item.entityType]: item._count.entityType }),
        {} as Record<string, number>,
      ),
      recentActivity: recentEntries.map((e) => this.mapToRecord(e)),
    };
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: date } },
    });
    this.logger.log(`Cleaned up ${result.count} audit log entries older than ${date.toISOString()}`);
    return result.count;
  }

  private buildWhereClause(filter: AuditLogFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filter.actorId) where.actorId = filter.actorId;
    if (filter.entityType) where.entityType = filter.entityType;
    if (filter.entityId) where.entityId = filter.entityId;
    if (filter.action) where.action = filter.action;
    if (filter.startDate || filter.endDate) {
      where.createdAt = {
        ...(filter.startDate ? { gte: filter.startDate } : {}),
        ...(filter.endDate ? { lte: filter.endDate } : {}),
      };
    }
    return where;
  }

  private mapToRecord(entry: any): AuditLogRecord {
    return {
      id: entry.id,
      actorId: entry.actorId,
      entityType: entry.entityType as LogEntityType,
      entityId: entry.entityId,
      action: entry.action as LogAction,
      oldData: entry.oldData as Record<string, unknown> | null,
      newData: entry.newData as Record<string, unknown> | null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: entry.createdAt,
      actor: entry.actor
        ? {
            id: entry.actor.id,
            fullName: entry.actor.fullName,
            email: entry.actor.email,
            role: entry.actor.role,
          }
        : null,
    };
  }
}