import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  priority: string;
}

export class RepairResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration_minutes: number;

  @ApiProperty()
  is_selected: boolean;
}

export class DiagnosticReportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  summary: string;

  @ApiPropertyOptional()
  valid_until?: Date;

  @ApiPropertyOptional()
  estimated_duration?: number;

  @ApiPropertyOptional()
  client_action?: string;

  @ApiPropertyOptional()
  client_action_at?: Date;

  @ApiProperty({ type: [FindingResponseDto] })
  findings: FindingResponseDto[];

  @ApiProperty({ type: [RepairResponseDto] })
  recommended_repairs: RepairResponseDto[];

  @ApiProperty()
  total_repair_cost: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ReportSummaryDto {
  @ApiProperty()
  report_id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  critical_count: number;

  @ApiProperty()
  warning_count: number;

  @ApiProperty()
  info_count: number;

  @ApiProperty()
  total_repairs: number;

  @ApiProperty()
  total_cost: number;

  @ApiProperty()
  client_action?: string;

  @ApiProperty()
  created_at: Date;
}
