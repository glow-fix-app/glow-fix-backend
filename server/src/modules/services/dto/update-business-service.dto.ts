// (Manager updates price/duration)
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBusinessServiceDto {
  @ApiPropertyOptional({ description: 'Price in EGP', example: 150 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ description: 'Average duration in minutes', example: 45 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  average_duration?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}