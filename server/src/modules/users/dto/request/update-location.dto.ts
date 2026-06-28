import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLocationDto {
    @ApiProperty({ example: 30.0444 })
    @IsNumber()
    @IsLatitude()
    @Type(() => Number)
    latitude: number;

    @ApiProperty({ example: 31.2357 })
    @IsNumber()
    @IsLongitude()
    @Type(() => Number)
    longitude: number;

    @ApiPropertyOptional({ example: 'Cairo' })
    @IsOptional()
    @IsString()
    city?: string;
}