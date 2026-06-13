import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class StripeWebhookPayloadDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  data: {
    object: any;
  };
}