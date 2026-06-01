import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperatingHoursEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty({ description: '0=Sunday, 1=Monday, ..., 6=Saturday' })
  day_of_week: number;

  @ApiPropertyOptional({ example: '09:00' })
  open_time?: string;

  @ApiPropertyOptional({ example: '18:00' })
  close_time?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class DayScheduleDto {
  @ApiProperty({ enum: [0, 1, 2, 3, 4, 5, 6] })
  day_of_week: number;

  @ApiPropertyOptional({ example: '09:00' })
  open_time?: string;

  @ApiPropertyOptional({ example: '18:00' })
  close_time?: string;

  @ApiPropertyOptional({ default: false })
  is_closed?: boolean;
}