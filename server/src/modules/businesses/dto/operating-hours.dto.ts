import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SingleOperatingHourDto {
  @ApiProperty({ enum: [0, 1, 2, 3, 4, 5, 6] })
  @IsNumber()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  open_time?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  close_time?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  is_closed?: boolean;
}

export class UpdateOperatingHoursDto {
  @ApiProperty({ type: [SingleOperatingHourDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleOperatingHourDto)
  hours: SingleOperatingHourDto[];
}