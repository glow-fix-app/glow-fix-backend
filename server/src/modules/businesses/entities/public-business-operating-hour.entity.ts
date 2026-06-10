import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicBusinessOperatingHourEntity {
  @ApiProperty()
  day_of_week: number;

  @ApiPropertyOptional({ nullable: true })
  open_time: string | null;

  @ApiPropertyOptional({ nullable: true })
  close_time: string | null;

  @ApiProperty()
  is_closed: boolean;
}
