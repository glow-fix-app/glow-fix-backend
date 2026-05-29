import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientLocationResponseDto {
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}

export class ClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  avatar_url?: string;

  @ApiProperty()
  email_verified: boolean;

  @ApiProperty()
  phone_verified: boolean;

  @ApiPropertyOptional({ type: ClientLocationResponseDto })
  location?: ClientLocationResponseDto;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  total_spent: number;

  @ApiProperty()
  loyalty_points: number;

  @ApiProperty()
  vehicles_count: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class NearbyClientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  avatar_url?: string;

  @ApiProperty()
  distance_km: number;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  average_rating: number;
}