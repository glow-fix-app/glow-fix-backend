import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogsDto } from './dto/request/query-audit-logs.dto';
import { CreateAuditLogDto } from './dto/request/create-audit-log.dto';
import { AuditLogResponseDto, AuditLogListResponseDto } from './dto/response/audit-log-response.dto';
import { AuditLogSummaryDto } from './dto/response/audit-log-summary.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@glow-fix/types';

@ApiTags('Audit Logs')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
@Controller({ path: 'audit-logs', version: '1' })
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) { }

    @Get()
    @ApiOperation({ summary: 'Get audit logs with filters (admin only)' })
    @ApiResponse({ status: 200, description: 'Audit logs retrieved', type: AuditLogListResponseDto })
    async getLogs(@Query() query: QueryAuditLogsDto): Promise<AuditLogListResponseDto> {
        return this.auditLogsService.getLogs(query);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get audit log summary (admin only)' })
    @ApiResponse({ status: 200, description: 'Audit log summary', type: AuditLogSummaryDto })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async getSummary(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ): Promise<AuditLogSummaryDto> {
        return this.auditLogsService.getSummary(startDate, endDate);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get audit log by ID (admin only)' })
    @ApiParam({ name: 'id', description: 'Audit log UUID' })
    @ApiResponse({ status: 200, description: 'Audit log retrieved', type: AuditLogResponseDto })
    @ApiResponse({ status: 404, description: 'Audit log not found' })
    async getLogById(@Param('id', ParseUUIDPipe) id: string): Promise<AuditLogResponseDto> {
        return this.auditLogsService.getLogById(id);
    }

    @Post('cleanup')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Clean up old audit logs (admin only)' })
    @ApiQuery({ name: 'daysToKeep', required: false, schema: { type: 'number', default: 90 } })
    async cleanupLogs(@Query('daysToKeep') daysToKeep?: string): Promise<{ deletedCount: number }> {
        return this.auditLogsService.cleanupLogs(daysToKeep ? parseInt(daysToKeep, 10) : 90);
    }
}