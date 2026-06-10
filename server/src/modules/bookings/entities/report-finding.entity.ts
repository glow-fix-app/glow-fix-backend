import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportFindingEntity {
  @ApiProperty({ description: 'Finding ID' })
  id: string;

  @ApiProperty({ description: 'Diagnostic report ID' })
  report_id: string;

  @ApiProperty({ description: 'Finding title' })
  title: string;

  @ApiPropertyOptional({ description: 'Finding detailed description' })
  description?: string | null;

  @ApiProperty({ description: 'Priority level of the finding', enum: ['CRITICAL', 'WARNING', 'INFO'] })
  priority: 'CRITICAL' | 'WARNING' | 'INFO';

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
