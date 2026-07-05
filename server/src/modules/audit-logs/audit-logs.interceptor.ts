import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from './audit-logs.service';
import { AUDIT_LOG_KEY, AuditLogMetadata } from './decorators/audit-log.decorator';

/**
 * Interceptor that automatically creates an audit log entry after a
 * controller method decorated with @AuditLog() completes successfully.
 *
 * Usage (on a controller or globally):
 *   @UseInterceptors(AuditLogsInterceptor)
 *   @AuditLog({ entityType: LogEntityType.USER, action: LogAction.UPDATED })
 *   async update(...) { ... }
 */
@Injectable()
export class AuditLogsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogsInterceptor.name);

  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditLogMetadata | undefined>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    // Only log when the handler is decorated with @AuditLog()
    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const actorId: string | undefined =
      (request.user as any)?.sub ?? (request.user as any)?.id;
    const ipAddress: string =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? request.ip;
    const userAgent: string = (request.headers['user-agent'] as string) ?? '';

    return next.handle().pipe(
      tap({
        next: () => {
          const entityId =
            metadata.entityIdParam
              ? (request.params?.[metadata.entityIdParam] ?? 'unknown')
              : 'unknown';

          // Fire-and-forget — never await so the response is not delayed
          this.auditLogsService
            .log({
              actorId,
              entityType: metadata.entityType,
              entityId,
              action: metadata.action,
              ipAddress,
              userAgent,
            })
            .catch((err) =>
              this.logger.error('AuditLogsInterceptor failed to write log', err),
            );
        },
      }),
    );
  }
}