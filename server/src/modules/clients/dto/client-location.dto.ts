import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsLatitude, IsLongitude } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClientLocationDto {
  @ApiProperty({ description: 'Latitude', example: 30.0444 })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: 31.2357 })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}
