import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsString, Min, Max, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OperatingHourDto {
  @ApiProperty({
    description: 'Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)',
    example: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(6)
  @Type(() => Number)
  dayOfWeek: number;

  @ApiPropertyOptional({
    description: 'Opening time in HH:mm format (null means closed)',
    example: '09:00',
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openTime must be in HH:mm format',
  })
  openTime?: string | null;

  @ApiPropertyOptional({
    description: 'Closing time in HH:mm format (null means closed)',
    example: '17:00',
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closeTime must be in HH:mm format',
  })
  closeTime?: string | null;
}

export class CreateOperatingHoursDto {
  @ApiProperty({
    description: 'Weekly operating hours (7 days, one per day)',
    type: [OperatingHourDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHourDto)
  hours: OperatingHourDto[];
}
