import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  client_id: string;

  @ApiProperty()
  license_plate: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiPropertyOptional()
  year?: number;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class VehicleWithStatsResponseDto extends VehicleResponseDto {
  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  completed_bookings: number;

  @ApiProperty()
  cancelled_bookings: number;

  @ApiProperty()
  total_spent: number;

  @ApiPropertyOptional()
  last_booking_at?: Date;

  @ApiPropertyOptional()
  next_booking_at?: Date;
}

export class VehicleBookingHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  scheduled_at: Date;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  payment_status: string;

  @ApiPropertyOptional()
  rating?: number;

  @ApiProperty()
  created_at: Date;
}