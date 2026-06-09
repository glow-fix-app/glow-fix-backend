import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendedRepairEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  report_id: string;

  @ApiProperty()
  business_service_id: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  price?: number;

  @ApiPropertyOptional()
  duration_minutes?: number;

  @ApiPropertyOptional()
  is_selected?: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}