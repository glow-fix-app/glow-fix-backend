import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: 'Target booking status context',
    example: 'IN_PROGRESS',
    enum: ['CONFIRMED', 'VEHICLE_RECEIVED', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED', 'REJECTED']
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
