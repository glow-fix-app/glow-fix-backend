import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleBookingDto {
  @ApiProperty({ description: 'New scheduled date & time', example: '2026-06-16T11:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;
}
