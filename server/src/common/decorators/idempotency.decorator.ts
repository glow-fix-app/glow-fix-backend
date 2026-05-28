import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENCY_KEY = 'idempotencyRequired';
export const IdempotencyRequired = () => SetMetadata(IDEMPOTENCY_KEY, true);