import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingStatusCountEntity {
  @ApiProperty({ description: 'Booking status name' })
  status: string;

  @ApiProperty({ description: 'Number of bookings with this status' })
  count: number;

  @ApiProperty({ description: 'Percentage of total bookings (%)' })
  percentage: number;
}

export class BookingByHourEntity {
  @ApiProperty({ description: 'Hour of day (0-23)' })
  hour: number;

  @ApiProperty({ description: 'Number of bookings at this hour' })
  count: number;
}

export class BookingByDayEntity {
  @ApiProperty({ description: 'Day name', example: 'Monday' })
  day: string;

  @ApiProperty({ description: 'Number of bookings on this day' })
  count: number;
}

export class BookingMetricsEntity {
  @ApiProperty({ description: 'Total number of bookings' })
  total_bookings: number;

  @ApiProperty({ description: 'Completed bookings count' })
  completed_bookings: number;

  @ApiProperty({ description: 'Cancelled bookings count' })
  cancelled_bookings: number;

  @ApiProperty({ description: 'No-show bookings count' })
  no_show_bookings: number;

  @ApiProperty({ description: 'Average time to complete booking (hours)' })
  average_completion_time_hours: number;

  @ApiProperty({ description: 'Average time to cancel booking (hours)' })
  average_cancellation_time_hours: number;

  @ApiProperty({ type: [BookingStatusCountEntity], description: 'Bookings grouped by status' })
  bookings_by_status: BookingStatusCountEntity[];

  @ApiProperty({ type: [BookingByHourEntity], description: 'Bookings by hour of day' })
  bookings_by_hour: BookingByHourEntity[];

  @ApiProperty({ type: [BookingByDayEntity], description: 'Bookings by day of week' })
  bookings_by_day_of_week: BookingByDayEntity[];
}

export class TopServiceEntity {
  @ApiProperty({ description: 'Service ID' })
  service_id: string;

  @ApiProperty({ description: 'Service name' })
  service_name: string;

  @ApiProperty({ description: 'Category name' })
  category_name: string;

  @ApiProperty({ description: 'Number of bookings for this service' })
  booking_count: number;

  @ApiProperty({ description: 'Total revenue from this service (EGP)' })
  total_revenue: number;
}

export class TopServicesEntity {
  @ApiProperty({ type: [TopServiceEntity], description: 'Top performing services' })
  top_services: TopServiceEntity[];
}