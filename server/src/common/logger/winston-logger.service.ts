import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService?: ConfigService) {
    const logLevel = this.configService?.get<string>('logging.level') || 'debug';
    const logFormat = this.configService?.get<string>('logging.format') || 'pretty';
    const nodeEnv = this.configService?.get<string>('app.nodeEnv') || 'development';

    const formats: winston.Logform.Format[] = [
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
    ];

    if (logFormat === 'json' || nodeEnv === 'production') {
      formats.push(winston.format.json());
    } else {
      formats.push(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, correlationId, ...meta }) => {
          const ctx = context ? `[${context as string}]` : '';
          const corrId = correlationId ? `[${correlationId as string}]` : '';
          const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp as string} ${level} ${corrId}${ctx} ${message as string}${metaStr}`;
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(...formats),
      defaultMeta: { service: 'glow-fix-api' },
      transports: [
        new winston.transports.Console(),
      ],
    });

    // File transports for production
    if (nodeEnv === 'production') {
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
        }),
      );
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 10,
        }),
      );
    }
  }

  log(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, { context, trace, ...meta });
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: Record<string, unknown>): void {
    this.logger.verbose(message, { context, ...meta });
  }

  /**
   * Log with correlation ID (for request tracing)
   */
  logWithCorrelation(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: string,
    correlationId: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): void {
    this.logger.log(level, message, { correlationId, context, ...meta });
  }
}