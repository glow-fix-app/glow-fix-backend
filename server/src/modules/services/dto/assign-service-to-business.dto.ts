// (Manager assigns price & duration)
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignServiceToBusinessDto {
  @ApiProperty({ description: 'Service ID from catalog' })
  @IsString()
  service_id: string;

  @ApiProperty({ description: 'Price in EGP (e.g., 120 for 120 EGP)', example: 120 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: 'Average duration in minutes', example: 30 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  average_duration: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class BulkAssignServicesDto {
  @ApiProperty({ type: [AssignServiceToBusinessDto] })
  services: AssignServiceToBusinessDto[];
}