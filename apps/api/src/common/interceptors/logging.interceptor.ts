// src/common/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  // Make constructor parameter optional
  constructor(logger?: Logger) {
    this.logger = logger || new Logger(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const duration = Date.now() - startTime;

        this.logger.log(`${method} ${url} ${statusCode} +${duration}ms`);
      }),
    );
  }
}

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Request } from 'express';
// import { WinstonLoggerService } from '../logger/winston-logger.service';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   constructor(private readonly logger: WinstonLoggerService) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const ctx = context.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const { method, url, ip } = request;
//     const correlationId = (request as any).correlationId || 'unknown';
//     const userAgent = request.get('user-agent') || '';
//     const startTime = Date.now();
//     const className = context.getClass().name;
//     const handlerName = context.getHandler().name;

//     this.logger.debug(`→ ${method} ${url}`, 'LoggingInterceptor', {
//       correlationId,
//       handler: `${className}.${handlerName}`,
//       ip,
//       userAgent: userAgent.substring(0, 100),
//     });

//     return next.handle().pipe(
//       tap({
//         next: () => {
//           const duration = Date.now() - startTime;
//           const response = ctx.getResponse();
//           const statusCode = response.statusCode;

//           this.logger.debug(
//             `← ${method} ${url} ${statusCode} ${duration}ms`,
//             'LoggingInterceptor',
//             {
//               correlationId,
//               duration,
//               statusCode,
//             },
//           );

//           // Warn on slow responses
//           if (duration > 1000) {
//             this.logger.warn(
//               `Slow response: ${method} ${url} took ${duration}ms`,
//               'LoggingInterceptor',
//               { correlationId, duration },
//             );
//           }
//         },
//         error: (error) => {
//           const duration = Date.now() - startTime;
//           this.logger.error(
//             `✖ ${method} ${url} ${duration}ms - ${error.message}`,
//             error.stack,
//             'LoggingInterceptor',
//             { correlationId, duration },
//           );
//         },
//       }),
//     );
//   }
// }

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Logger,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   private readonly logger = new Logger('HTTP');

//   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();

//     // Attach correlation ID to every request
//     const requestId = (request.headers['x-request-id'] as string) || uuidv4();
//     request.headers['x-request-id'] = requestId;
//     response.setHeader('X-Request-Id', requestId);

//     const startTime = Date.now();
//     const { method, url, ip } = request;

//     return next.handle().pipe(
//       tap({
//         next: () => {
//           const duration = Date.now() - startTime;
//           const { statusCode } = response;
//           this.logger.log(
//             `${method} ${url} ${statusCode} ${duration}ms - ${ip} [${requestId}]`,
//           );
//         },
//         error: () => {
//           const duration = Date.now() - startTime;
//           this.logger.warn(
//             `${method} ${url} ERR ${duration}ms - ${ip} [${requestId}]`,
//           );
//         },
//       }),
//     );
//   }
// }
