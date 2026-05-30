import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ description: 'License plate number', example: 'ABC 1234' })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  license_plate?: string;

  @ApiPropertyOptional({ description: 'Vehicle model', example: 'Toyota Corolla' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  model?: string;

  @ApiPropertyOptional({ description: 'Manufacturing year', example: 2021 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiPropertyOptional({ description: 'Vehicle color', example: 'Pearl White' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  color?: string;
}