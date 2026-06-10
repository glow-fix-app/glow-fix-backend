import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportFindingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  report_id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ['CRITICAL', 'WARNING', 'INFO'] })
  priority: string;

  @ApiProperty()
  created_at: Date;
}