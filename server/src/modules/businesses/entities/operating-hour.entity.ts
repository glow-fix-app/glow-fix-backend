import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperatingHourEntity {
  @ApiProperty()
  dayOfWeek: number;

  @ApiPropertyOptional({ nullable: true })
  openTime: string | null;

  @ApiPropertyOptional({ nullable: true })
  closeTime: string | null;
}
