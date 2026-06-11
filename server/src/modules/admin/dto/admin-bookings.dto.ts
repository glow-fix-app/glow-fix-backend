import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, IsDateString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  VEHICLE_RECEIVED = 'VEHICLE_RECEIVED',
  DIAGNOSIS_SENT = 'DIAGNOSIS_SENT',
  DIAGNOSIS_ACCEPTED = 'DIAGNOSIS_ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export class GetBookingsAdminDto {
  @ApiPropertyOptional({ enum: BookingStatus, description: 'Filter by booking status' })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Search by booking code or customer name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by business ID' })
  @IsOptional()
  @IsString()
  business_id?: string;

  @ApiPropertyOptional({ description: 'Filter by customer ID' })
  @IsOptional()
  @IsString()
  customer_id?: string;

  @ApiPropertyOptional({ description: 'Start date for filtering' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date for filtering' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Minimum booking amount' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_amount?: number;

  @ApiPropertyOptional({ description: 'Maximum booking amount' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_amount?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class UpdateBookingStatusAdminDto {
  @ApiProperty({ enum: BookingStatus, description: 'New booking status' })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiPropertyOptional({ description: 'Cancellation reason (required for CANCELLED status)' })
  @IsOptional()
  @IsString()
  cancellation_reason?: string;
}

export class RefundBookingDto {
  @ApiProperty({ description: 'Refund amount in EGP' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Refund reason' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BookingItemAdminDto {
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

export class BookingPaymentAdminDto {
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

export class BookingResponseAdminDto {
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

  @ApiProperty({ type: [BookingItemAdminDto] })
  items: BookingItemAdminDto[];

  @ApiPropertyOptional({ type: BookingPaymentAdminDto })
  payment?: BookingPaymentAdminDto;

  @ApiPropertyOptional()
  cancellation_reason?: string;

  @ApiPropertyOptional()
  cancelled_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BookingStatsDto {
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

  @ApiProperty()
  revenue_by_month: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
}