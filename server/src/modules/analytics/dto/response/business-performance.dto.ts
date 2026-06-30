import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessPerformanceDto {
  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  completed_bookings: number;

  @ApiProperty()
  cancelled_bookings: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  platform_fees: number;

  @ApiProperty()
  net_revenue: number;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty()
  active_services: number;

  @ApiProperty()
  response_rate: number;

  @ApiProperty()
  growth_percent: number;
}

export class BusinessPerformanceListDto {
  @ApiProperty({ type: [BusinessPerformanceDto] })
  data: BusinessPerformanceDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}