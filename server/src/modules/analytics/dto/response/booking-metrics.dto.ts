import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingStatusCountDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class BookingMetricsDto {
  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  completed_bookings: number;

  @ApiProperty()
  cancelled_bookings: number;

  @ApiProperty()
  no_show_bookings: number;

  @ApiProperty()
  average_completion_time_hours: number;

  @ApiProperty()
  average_cancellation_time_hours: number;

  @ApiProperty({ type: [BookingStatusCountDto] })
  bookings_by_status: BookingStatusCountDto[];

  @ApiProperty({ type: [Object] })
  bookings_by_hour: Array<{
    hour: number;
    count: number;
  }>;

  @ApiProperty({ type: [Object] })
  bookings_by_day_of_week: Array<{
    day: string;
    count: number;
  }>;
}

export class TopServiceDto {
  @ApiProperty()
  service_id: string;

  @ApiProperty()
  service_name: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  booking_count: number;

  @ApiProperty()
  total_revenue: number;
}

export class TopServicesDto {
  @ApiProperty({ type: [TopServiceDto] })
  top_services: TopServiceDto[];
}