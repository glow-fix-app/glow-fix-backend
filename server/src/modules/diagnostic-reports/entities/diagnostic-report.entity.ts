import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiagnosticReportEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

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

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class DiagnosticReportWithDetailsEntity extends DiagnosticReportEntity {
  @ApiProperty({ type: [Object] })
  findings: any[];

  @ApiProperty({ type: [Object] })
  recommended_repairs: any[];

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  customer_name: string;

  @ApiProperty()
  customer_phone?: string;

  @ApiProperty()
  vehicle_info: string;
}