import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  manager_id: string;

  @ApiProperty()
  manager_name: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiPropertyOptional()
  contact_phone?: string;

  @ApiPropertyOptional()
  contact_email?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  current_status: string;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiProperty({ type: [Object] })
  operating_hours: any[];

  @ApiProperty({ type: [Object] })
  documents: any[];

  @ApiPropertyOptional()
  logo_url?: string;

  @ApiPropertyOptional()
  cover_url?: string;

  @ApiPropertyOptional({ type: [String] })
  gallery?: string[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BusinessStatsDto {
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
}

export class NearbyBusinessDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  distance_km: number;

  @ApiPropertyOptional()
  contact_phone?: string;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty()
  is_open: boolean;
}