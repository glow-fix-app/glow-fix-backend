import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, Length, Matches } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'License plate number', example: 'ABC 1234' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Z0-9\s-]+$/i, {
    message: 'License plate can only contain letters, numbers, spaces, and hyphens',
  })
  license_plate: string;

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