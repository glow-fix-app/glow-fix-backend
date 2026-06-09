import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AddBusinessServiceDto {
  @ApiProperty({ description: 'Service ID from catalog' })
  @IsUUID()
  service_id: string;

  @ApiProperty({ description: 'Price in EGP (smallest unit)', example: 12000 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Average duration in minutes', example: 30 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  average_duration: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class BulkAddServicesDto {
  @ApiProperty({ type: [AddBusinessServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddBusinessServiceDto)
  services: AddBusinessServiceDto[];
}