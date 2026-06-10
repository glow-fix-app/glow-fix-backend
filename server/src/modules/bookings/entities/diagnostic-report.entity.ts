import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportFindingEntity } from './report-finding.entity';
import { RecommendedRepairEntity } from './recommended-repair.entity';

export class DiagnosticReportEntity {
  @ApiProperty({ description: 'Diagnostic report ID' })
  id: string;

  @ApiProperty({ description: 'Booking ID' })
  booking_id: string;

  @ApiProperty({ description: 'Summary of the diagnostics' })
  summary: string;

  @ApiPropertyOptional({ description: 'Diagnostics validity expiration timestamp' })
  valid_until?: Date | null;

  @ApiPropertyOptional({ description: 'Estimated repair duration in minutes' })
  estimated_duration?: number | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiProperty({ description: 'Findings list', type: [ReportFindingEntity] })
  findings: ReportFindingEntity[];

  @ApiProperty({ description: 'Recommended repairs list', type: [RecommendedRepairEntity] })
  recommended_repairs: RecommendedRepairEntity[];
}
