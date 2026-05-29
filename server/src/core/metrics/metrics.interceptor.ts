import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method } = request;

    // Normalize route for metrics (replace UUIDs with :id)
    const route = this.normalizeRoute(request.route?.path || request.url);
    const endTimer = this.metricsService.httpRequestDuration.startTimer({
      method,
      route,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const statusCode = response.statusCode.toString();

          endTimer({ status_code: statusCode });
          this.metricsService.httpRequestTotal.inc({
            method,
            route,
            status_code: statusCode,
          });
        },
        error: (error) => {
          const statusCode = error.status || error.statusCode || 500;

          endTimer({ status_code: statusCode.toString() });
          this.metricsService.httpRequestTotal.inc({
            method,
            route,
            status_code: statusCode.toString(),
          });
          this.metricsService.httpErrorTotal.inc({
            method,
            route,
            status_code: statusCode.toString(),
            error_code: error.code || 'UNKNOWN',
          });
        },
      }),
    );
  }

  private normalizeRoute(path: string): string {
    return path
      .replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        ':id',
      )
      .replace(/\/\d+/g, '/:id');
  }
}