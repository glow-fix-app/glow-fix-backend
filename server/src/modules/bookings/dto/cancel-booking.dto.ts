import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CancelBookingDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation', example: 'Plan changed' })
  @IsOptional()
  @IsString()
  reason?: string;
}
