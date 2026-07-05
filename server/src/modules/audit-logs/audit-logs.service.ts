import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AuditLogsRepository } from './audit-logs.repository';
import { QueryAuditLogsDto } from './dto/request/query-audit-logs.dto';
import { CreateAuditLogDto } from './dto/request/create-audit-log.dto';
import { AuditLogResponseDto, AuditLogListResponseDto } from './dto/response/audit-log-response.dto';
import { AuditLogSummaryDto } from './dto/response/audit-log-summary.dto';
import { AuditLogRecord, AuditLogSummary } from './interfaces/audit-log.interface';
import { DEFAULT_CLEANUP_DAYS } from './constants/audit-log.constants';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly repository: AuditLogsRepository) {}

  async getLogs(query: QueryAuditLogsDto): Promise<AuditLogListResponseDto> {
    const result = await this.repository.findMany({
      actorId: query.actorId,
      entityType: query.entityType,
      entityId: query.entityId,
      action: query.action,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page,
      limit: query.limit,
    });
    return {
      data: result.data.map((e) => this.mapToResponseDto(e)),
      meta: result.meta,
    };
  }

  async getLogById(id: string): Promise<AuditLogResponseDto> {
    const entry = await this.repository.findById(id);
    if (!entry) {
      throw new NotFoundException(`Audit log with ID "${id}" not found`);
    }
    return this.mapToResponseDto(entry);
  }

  async getSummary(startDate?: string, endDate?: string): Promise<AuditLogSummaryDto> {
    const summary: AuditLogSummary = await this.repository.getSummary(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      totalLogs: summary.totalLogs,
      byAction: Object.entries(summary.byAction).map(([action, count]) => ({ action, count })),
      byEntityType: Object.entries(summary.byEntityType).map(([entityType, count]) => ({
        entityType,
        count,
      })),
      recentActivity: summary.recentActivity.map((e) => this.mapToResponseDto(e)),
    };
  }

  async cleanupLogs(daysToKeep: number = DEFAULT_CLEANUP_DAYS): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    this.logger.log(
      `Cleaning up audit logs older than ${daysToKeep} days (before ${cutoffDate.toISOString()})`,
    );
    const deletedCount = await this.repository.deleteOlderThan(cutoffDate);
    return { deletedCount };
  }

  /** Internal fire-and-forget API — used by interceptors and other modules */
  async log(dto: CreateAuditLogDto): Promise<void> {
    try {
      await this.repository.create({
        actorId: dto.actorId,
        entityType: dto.entityType,
        entityId: dto.entityId,
        action: dto.action,
        oldData: dto.oldData,
        newData: dto.newData,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      });
    } catch (err) {
      // Never throw — audit logging must not break the main request flow
      this.logger.error('Failed to persist audit log entry', err);
    }
  }

  private mapToResponseDto(entry: AuditLogRecord): AuditLogResponseDto {
    return {
      id: entry.id,
      actorId: entry.actorId,
      entityType: entry.entityType,
      entityId: entry.entityId,
      action: entry.action,
      oldData: entry.oldData,
      newData: entry.newData,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: entry.createdAt,
      actor: entry.actor ?? null,
    };
  }
}