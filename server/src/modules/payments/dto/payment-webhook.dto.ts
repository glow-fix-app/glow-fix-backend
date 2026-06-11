import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum WebhookEventType {
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_SUCCEEDED = 'refund.succeeded',
}

export class PaymentWebhookDto {
  @ApiProperty({ enum: WebhookEventType })
  @IsEnum(WebhookEventType)
  event: WebhookEventType;

  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  provider_ref: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  failure_reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  raw_payload?: any;
}