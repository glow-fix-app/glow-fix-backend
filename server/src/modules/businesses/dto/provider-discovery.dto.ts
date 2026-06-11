// modules/businesses/dto/provider-discovery.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum ProviderSortBy {
  HIGHEST_RATED = 'highest_rated',
  NEAREST = 'nearest',
  MOST_REVIEWS = 'most_reviews',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export enum ServiceType {
  WASH = 'Wash',
  REPAIR = 'Repair',
  BOTH = 'both',
}

// ==================== REQUEST DTOS ====================

export class ProviderFiltersDto {
  @ApiPropertyOptional({ enum: ServiceType, description: 'Service type filter', example: 'Wash' })
  @IsOptional()
  @IsEnum(ServiceType)
  service?: ServiceType;

  @ApiPropertyOptional({ description: 'Maximum distance in km', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  @Type(() => Number)
  max_distance?: number;

  @ApiPropertyOptional({ description: 'Minimum rating', example: 4, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  min_rating?: number;

  @ApiPropertyOptional({ description: 'Only show open now', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  open_now?: boolean;

  @ApiPropertyOptional({ description: 'Only show verified providers', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  verified_only?: boolean;
}

export class SearchProvidersDto {
  @ApiPropertyOptional({ description: 'Search by business name', example: 'GlowFix' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'User latitude', example: 30.0444 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ description: 'User longitude', example: 31.2357 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ description: 'Filter options', type: ProviderFiltersDto })
  @IsOptional()
  @Type(() => ProviderFiltersDto)
  filters?: ProviderFiltersDto;

  @ApiPropertyOptional({ enum: ProviderSortBy, default: ProviderSortBy.HIGHEST_RATED, description: 'Sort by' })
  @IsOptional()
  @IsEnum(ProviderSortBy)
  sort_by?: ProviderSortBy = ProviderSortBy.HIGHEST_RATED;

  @ApiPropertyOptional({ description: 'Page number', default: 1, example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20, maximum: 50, example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 20;
}

// ==================== RESPONSE DTOS ====================

export class ProviderOfferDto {
  @ApiProperty({ description: 'Business service ID' })
  business_service_id: string;

  @ApiProperty({ description: 'Service ID' })
  service_id: string;

  @ApiProperty({ description: 'Service name', example: 'Express Wash' })
  service_name: string;

  @ApiProperty({ description: 'Price in EGP', example: 120 })
  price: number;

  @ApiProperty({ description: 'Duration in minutes', example: 30 })
  duration_minutes: number;
}

export class ProviderResponseDto {
  @ApiProperty({ description: 'Business ID' })
  id: string;

  @ApiProperty({ description: 'Business name', example: 'GlowFix Zamalek Detailing' })
  business_name: string;

  @ApiProperty({ description: 'Business address', example: '22 26th of July St, Zamalek, Cairo' })
  address: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+20123456789' })
  contact_phone?: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'contact@glowfix.com' })
  contact_email?: string;

  @ApiProperty({ description: 'Distance from user in km', example: 10.5 })
  distance_km: number;

  @ApiProperty({ description: 'Average rating', example: 4.7 })
  average_rating: number;

  @ApiProperty({ description: 'Total number of reviews', example: 3 })
  total_reviews: number;

  @ApiProperty({ description: 'Is business open now' })
  is_open: boolean;

  @ApiProperty({ description: 'Is business verified' })
  is_verified: boolean;

  @ApiProperty({ enum: ['Wash', 'Repair', 'both'], description: 'Service type' })
  service_type: string;

  @ApiProperty({ type: [ProviderOfferDto], description: 'Available services/offers' })
  offers: ProviderOfferDto[];

  @ApiPropertyOptional({ description: 'Operating hours for today', example: '09:00 - 22:00' })
  operating_hours_today?: string;

  @ApiProperty({ description: 'Business latitude' })
  latitude: number;

  @ApiProperty({ description: 'Business longitude' })
  longitude: number;

  @ApiProperty({ description: 'Created at timestamp' })
  created_at: Date;
}

// ==================== FILTER OPTIONS DTOS ====================

export class ServiceTypeFilterOptionDto {
  @ApiProperty({ description: 'Filter name', example: 'Wash' })
  name: string;

  @ApiProperty({ description: 'Number of providers matching this filter', example: 8 })
  count: number;

  @ApiProperty({ description: 'Whether this filter is currently selected' })
  selected: boolean;
}

export class RatingRangeFilterOptionDto {
  @ApiProperty({ description: 'Filter name', example: '4.5+' })
  name: string;

  @ApiProperty({ description: 'Minimum rating', example: 4.5 })
  min: number;

  @ApiProperty({ description: 'Maximum rating', example: 5 })
  max: number;

  @ApiProperty({ description: 'Number of providers matching this filter', example: 5 })
  count: number;

  @ApiProperty({ description: 'Whether this filter is currently selected' })
  selected: boolean;
}

export class DistanceRangeFilterOptionDto {
  @ApiProperty({ description: 'Filter name', example: '≤ 10 km' })
  name: string;

  @ApiProperty({ description: 'Maximum distance in km', example: 10 })
  max_km: number;

  @ApiProperty({ description: 'Number of providers matching this filter', example: 3 })
  count: number;

  @ApiProperty({ description: 'Whether this filter is currently selected' })
  selected: boolean;
}

export class ProviderFilterOptionsDto {
  @ApiProperty({ type: [ServiceTypeFilterOptionDto], description: 'Service type filter options' })
  service_types: ServiceTypeFilterOptionDto[];

  @ApiProperty({ type: [RatingRangeFilterOptionDto], description: 'Rating range filter options' })
  rating_ranges: RatingRangeFilterOptionDto[];

  @ApiProperty({ type: [DistanceRangeFilterOptionDto], description: 'Distance range filter options' })
  distance_ranges: DistanceRangeFilterOptionDto[];
}

// ==================== MAIN RESPONSE DTO ====================

export class ProviderDiscoveryMetaDto {
  @ApiProperty({ description: 'Total number of providers' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  total_pages: number;

  @ApiProperty({ description: 'Whether location was used for distance calculation' })
  location_used: boolean;

  @ApiPropertyOptional({ description: 'Latitude used for distance calculation' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude used for distance calculation' })
  longitude?: number;
}

export class ProviderDiscoveryResponseDto {
  @ApiProperty({ type: [ProviderResponseDto], description: 'List of providers' })
  data: ProviderResponseDto[];

  @ApiProperty({ type: ProviderDiscoveryMetaDto, description: 'Pagination metadata' })
  meta: ProviderDiscoveryMetaDto;

  @ApiProperty({ type: ProviderFilterOptionsDto, description: 'Available filter options' })
  filters: ProviderFilterOptionsDto;
}