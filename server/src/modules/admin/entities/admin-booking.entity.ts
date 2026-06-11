import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminBookingItemEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  service_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration_minutes: number;
}

export class AdminBookingPaymentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  provider?: string;

  @ApiPropertyOptional()
  provider_ref?: string;

  @ApiPropertyOptional()
  paid_at?: Date;
}

export class AdminBookingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  customer_name: string;

  @ApiProperty()
  customer_email: string;

  @ApiPropertyOptional()
  customer_phone?: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  business_address: string;

  @ApiProperty()
  vehicle_license_plate: string;

  @ApiPropertyOptional()
  vehicle_model?: string;

  @ApiPropertyOptional()
  vehicle_color?: string;

  @ApiProperty()
  scheduled_at: Date;

  @ApiPropertyOptional()
  expected_delivery_at?: Date;

  @ApiProperty()
  sub_total: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  commission: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [AdminBookingItemEntity] })
  items: AdminBookingItemEntity[];

  @ApiPropertyOptional({ type: AdminBookingPaymentEntity })
  payment?: AdminBookingPaymentEntity;

  @ApiPropertyOptional()
  cancellation_reason?: string;

  @ApiPropertyOptional()
  cancelled_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BookingStatsEntity {
  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  average_booking_value: number;

  @ApiProperty()
  completion_rate: number;

  @ApiProperty()
  cancellation_rate: number;

  @ApiProperty()
  bookings_by_status: Record<string, number>;

  @ApiProperty({ type: [Object] })
  revenue_by_month: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
}

export class BookingListMetaEntity {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class BookingListResponseEntity {
  @ApiProperty({ type: [AdminBookingEntity] })
  data: AdminBookingEntity[];

  @ApiProperty({ type: BookingListMetaEntity })
  meta: BookingListMetaEntity;
}