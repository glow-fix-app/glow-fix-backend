import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../logger/winston-logger.service';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    correlationId: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const correlationId = (request as any).correlationId || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || message;
        code = (resp.error as string) || this.getErrorCode(status);
        details = resp.errors as Record<string, string[]>;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        'HttpExceptionFilter',
        {
          correlationId,
          statusCode: status,
          method: request.method,
          url: request.url,
          ip: request.ip,
          userAgent: request.get('user-agent'),
        },
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
        'HttpExceptionFilter',
        {
          correlationId,
          statusCode: status,
        },
      );
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        correlationId,
        ...(details && { details }),
      },
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(GlobalExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest<Request>();
//     const response = ctx.getResponse<Response>();

//     const requestId = (request.headers['x-request-id'] as string) || uuidv4();
//     const timestamp = new Date().toISOString();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let code = 'INTERNAL_SERVER_ERROR';
//     let message = 'An unexpected error occurred';
//     let details: { field: string; message: string }[] | undefined;

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const exceptionResponse = exception.getResponse();

//       if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
//         const resp = exceptionResponse as Record<string, unknown>;
//         code = (resp.code as string) || this.statusToCode(status);
//         message = (resp.message as string) || message;

//         // Handle class-validator errors
//         if (Array.isArray(resp.message)) {
//           code = 'VALIDATION_ERROR';
//           message = 'Request validation failed';
//           details = (resp.message as string[]).map((msg) => {
//             const [field, ...rest] = msg.split(' ');
//             return { field, message: rest.join(' ') };
//           });
//         }
//       }
//     }

//     // Log server errors (5xx) with full details
//     if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
//       this.logger.error(
//         `[${requestId}] ${request.method} ${request.url} - ${status} ${message}`,
//         exception instanceof Error ? exception.stack : String(exception),
//       );
//     }

//     response.status(status).json({
//       success: false,
//       error: {
//         code,
//         message,
//         ...(details && { details }),
//         requestId,
//         timestamp,
//       },
//     });
//   }

//   private statusToCode(status: number): string {
//     const codes: Record<number, string> = {
//       400: 'BAD_REQUEST',
//       401: 'UNAUTHORIZED',
//       403: 'FORBIDDEN',
//       404: 'NOT_FOUND',
//       409: 'CONFLICT',
//       422: 'UNPROCESSABLE_ENTITY',
//       429: 'TOO_MANY_REQUESTS',
//       500: 'INTERNAL_SERVER_ERROR',
//       503: 'SERVICE_UNAVAILABLE',
//     };
//     return codes[status] || 'UNKNOWN_ERROR';
//   }
// }
