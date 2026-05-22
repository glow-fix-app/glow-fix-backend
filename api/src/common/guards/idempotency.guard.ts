import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RedisService } from '../../core/redis/redis.service';
import { RedisKeys } from '../../core/redis/redis-keys';
import { IDEMPOTENCY_KEY } from '../decorators/idempotency.decorator';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  private static readonly TTL_SECONDS = 86400; // 24 hours

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIdempotencyRequired = this.reflector.getAllAndOverride<boolean>(
      IDEMPOTENCY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isIdempotencyRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const idempotencyKey = request.headers['x-idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException(
        'X-Idempotency-Key header is required for this request',
      );
    }

    const redisKey = RedisKeys.idempotency(idempotencyKey);
    const existingResult = await this.redisService.get(redisKey);

    if (existingResult) {
      throw new ConflictException({
        message: 'Duplicate request detected',
        code: 'IDEMPOTENCY_CONFLICT',
        existingResult: JSON.parse(existingResult),
      });
    }

    // Store a placeholder (will be updated with actual result by interceptor)
    await this.redisService.set(
      redisKey,
      JSON.stringify({ status: 'processing', timestamp: new Date().toISOString() }),
      IdempotencyGuard.TTL_SECONDS,
    );

    return true;
  }
}