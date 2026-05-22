import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum WebhookEventType {
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_SUCCEEDED = 'refund.succeeded',
}

export class PaymentWebhookDto {
  @ApiProperty({ description: 'Webhook event type' })
  @IsEnum(WebhookEventType)
  event: WebhookEventType;

  @ApiProperty({ description: 'Payment provider' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'Provider reference ID' })
  @IsString()
  provider_ref: string;

  @ApiPropertyOptional({ description: 'Payment amount' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ description: 'Payment status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Failure reason' })
  @IsOptional()
  @IsString()
  failure_reason?: string;

  @ApiPropertyOptional({ description: 'Raw webhook payload' })
  @IsOptional()
  raw_payload?: any;
}