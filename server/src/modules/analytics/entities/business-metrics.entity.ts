import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessPerformanceEntity {
  @ApiProperty({ description: 'Business ID' })
  business_id: string;

  @ApiProperty({ description: 'Business name' })
  business_name: string;

  @ApiProperty({ description: 'Total number of bookings' })
  total_bookings: number;

  @ApiProperty({ description: 'Completed bookings count' })
  completed_bookings: number;

  @ApiProperty({ description: 'Cancelled bookings count' })
  cancelled_bookings: number;

  @ApiProperty({ description: 'Total revenue (EGP)' })
  total_revenue: number;

  @ApiProperty({ description: 'Platform fees paid (EGP)' })
  platform_fees: number;

  @ApiProperty({ description: 'Net revenue after fees (EGP)' })
  net_revenue: number;

  @ApiProperty({ description: 'Average customer rating' })
  average_rating: number;

  @ApiProperty({ description: 'Total number of reviews' })
  total_reviews: number;

  @ApiProperty({ description: 'Number of active services' })
  active_services: number;

  @ApiProperty({ description: 'Response rate (%)' })
  response_rate: number;

  @ApiProperty({ description: 'Growth percentage compared to previous period' })
  growth_percent: number;
}

export class BusinessPerformanceListEntity {
  @ApiProperty({ type: [BusinessPerformanceEntity] })
  data: BusinessPerformanceEntity[];

  @ApiProperty({ description: 'Total number of businesses' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  total_pages: number;
}

export class BusinessDetailMetricsEntity extends BusinessPerformanceEntity {
  @ApiProperty({ description: 'Manager name' })
  manager_name: string;

  @ApiProperty({ description: 'Manager email' })
  manager_email: string;

  @ApiProperty({ description: 'Business address' })
  address: string;

  @ApiProperty({ description: 'Business status' })
  status: string;

  @ApiProperty({ description: 'Date business was created' })
  created_at: Date;

  @ApiProperty({ description: 'Monthly revenue breakdown' })
  monthly_revenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;

  @ApiProperty({ description: 'Top services for this business' })
  top_services: Array<{
    service_name: string;
    booking_count: number;
    revenue: number;
  }>;
}