import { Module, Global } from '@nestjs/common';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsRepository } from './audit-logs.repository';
import { AuditLogsInterceptor } from './audit-logs.interceptor';

/**
 * @Global() makes AuditLogsService available application-wide without
 * importing AuditLogsModule into every feature module.
 */
@Global()
@Module({
  controllers: [AuditLogsController],
  providers: [
    AuditLogsRepository,
    AuditLogsService,
    AuditLogsInterceptor,
  ],
  exports: [
    AuditLogsService,
    AuditLogsInterceptor,
  ],
})
export class AuditLogsModule {}