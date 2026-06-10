import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateExpectedDeliveryDto {
  @ApiProperty({ description: 'Expected delivery timestamp (ISO format)' })
  @IsNotEmpty()
  @IsDateString()
  expectedDeliveryAt: string;
}
