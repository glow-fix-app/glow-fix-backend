import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookingItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  businessServiceId: string;

  @ApiProperty()
  serviceTitle: string;

  @ApiPropertyOptional()
  serviceDescription?: string;

  @ApiProperty()
  price: number;
}

export class BookingStatusHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}

export class BookingPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  method: string;
}

export class BookingClientUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  email: string;
}

export class BookingClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ type: BookingClientUserResponseDto })
  user?: BookingClientUserResponseDto;
}

export class BookingVehicleResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  make?: string;

  @ApiPropertyOptional()
  model?: string;

  @ApiProperty()
  licensePlate: string;

  @ApiPropertyOptional()
  vin?: string;

  @ApiPropertyOptional()
  year?: number;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional({ type: BookingClientResponseDto })
  client?: BookingClientResponseDto;
}

export class BookingBusinessResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  managerId: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;
}

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  client_name?: string | null;

  @ApiPropertyOptional()
  client_avatar?: string | null;

  @ApiProperty()
  vehicle_id: string;

  @ApiProperty()
  business_id: string;

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

  @ApiPropertyOptional()
  cancellation_reason?: string | null;

  @ApiPropertyOptional()
  rejection_reason?: string | null;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [BookingItemResponseDto] })
  items: BookingItemResponseDto[];

  @ApiProperty({ type: [BookingStatusHistoryResponseDto] })
  status_history: BookingStatusHistoryResponseDto[];

  @ApiPropertyOptional({ type: BookingPaymentResponseDto })
  payment?: BookingPaymentResponseDto;

  @ApiProperty({ type: BookingVehicleResponseDto })
  vehicle: BookingVehicleResponseDto;

  @ApiProperty({ type: BookingBusinessResponseDto })
  business: BookingBusinessResponseDto;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiPropertyOptional({ description: 'Latest diagnostic report for this booking' })
  diagnostic_report?: any;
}
