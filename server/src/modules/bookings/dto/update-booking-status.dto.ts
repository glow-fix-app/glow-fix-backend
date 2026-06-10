import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: 'Target booking status name',
    enum: [
      'CONFIRMED',
      'VEHICLE_RECEIVED',
      'INSPECTION_IN_PROGRESS',
      'WAITING_CLIENT_APPROVAL',
      'REPAIR_IN_PROGRESS',
      'READY_FOR_PICKUP',
      'COMPLETED',
      'CANCELLED',
    ],
  })
  @IsNotEmpty()
  @IsEnum([
    'CONFIRMED',
    'VEHICLE_RECEIVED',
    'INSPECTION_IN_PROGRESS',
    'WAITING_CLIENT_APPROVAL',
    'REPAIR_IN_PROGRESS',
    'READY_FOR_PICKUP',
    'COMPLETED',
    'CANCELLED',
  ])
  status:
    | 'CONFIRMED'
    | 'VEHICLE_RECEIVED'
    | 'INSPECTION_IN_PROGRESS'
    | 'WAITING_CLIENT_APPROVAL'
    | 'REPAIR_IN_PROGRESS'
    | 'READY_FOR_PICKUP'
    | 'COMPLETED'
    | 'CANCELLED';

  @ApiPropertyOptional({ description: 'Reason for cancellation or transition change' })
  @IsOptional()
  @IsString()
  reason?: string;
}
