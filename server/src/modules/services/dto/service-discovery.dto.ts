// modules/services/dto/service-discovery.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsArray, IsBoolean, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortBy {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DISTANCE_ASC = 'distance_asc',
  RATING_DESC = 'rating_desc',
  POPULARITY = 'popularity',
}

export class FilterOptionsDto {
  @ApiPropertyOptional({ description: 'Service categories', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Locations', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @ApiPropertyOptional({ description: 'Minimum price', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_price?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_price?: number;

  @ApiPropertyOptional({ description: 'Minimum rating', example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  min_rating?: number;

  @ApiPropertyOptional({ description: 'Only show open now' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  open_now?: boolean;

  @ApiPropertyOptional({ description: 'Only verified providers' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  verified_only?: boolean;

  @ApiPropertyOptional({ description: 'Radius in km', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  radius?: number;
}

export class SearchServicesDto {
  @ApiPropertyOptional({ description: 'Search query (service name)' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Category filter' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Location latitude' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Location longitude' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ description: 'Filter options' })
  @IsOptional()
  @Type(() => FilterOptionsDto)
  filters?: FilterOptionsDto;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.PRICE_ASC })
  @IsOptional()
  @IsEnum(SortBy)
  sort_by?: SortBy = SortBy.PRICE_ASC;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 20;
}

export class FilterOptionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  selected: boolean;
}

export class FilterCategoriesResponseDto {
  @ApiProperty({ type: [FilterOptionDto] })
  categories: FilterOptionDto[];

  @ApiProperty({ type: [FilterOptionDto] })
  locations: FilterOptionDto[];

  @ApiProperty({ type: [FilterOptionDto] })
  price_ranges: FilterOptionDto[];
}

export class ServiceOfferDto {
  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  business_address: string;

  @ApiPropertyOptional()
  business_phone?: string;

  @ApiProperty()
  distance_km: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration_minutes: number;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty()
  is_open: boolean;

  @ApiProperty()
  is_verified: boolean;

  @ApiPropertyOptional()
  operating_hours_today?: string;
}

export class ServiceDiscoveryResponseDto {
  @ApiProperty()
  service_id: string;

  @ApiProperty()
  service_name: string;

  @ApiPropertyOptional()
  service_description?: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  total_offers: number;

  @ApiProperty()
  provider_count: number;

  @ApiProperty()
  from_price: number;

  @ApiProperty()
  price_range: {
    min: number;
    max: number;
  };

  @ApiProperty({ type: [ServiceOfferDto] })
  offers: ServiceOfferDto[];
}

export class SearchSuggestionsDto {
  @ApiProperty()
  query: string;

  @ApiProperty({ type: [String] })
  service_suggestions: string[];

  @ApiProperty({ type: [String] })
  category_suggestions: string[];
}

export class PopularServiceDto {
  @ApiProperty()
  service_id: string;

  @ApiProperty()
  service_name: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  provider_count: number;

  @ApiProperty()
  min_price: number;

  @ApiProperty()
  average_rating: number;
}

export class SearchMetaDto {
  @ApiProperty()
  total_services: number;

  @ApiProperty()
  total_offers: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  location_used: boolean;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;
}

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsOptional, IsString, IsNumber, Min, Max, IsEnum } from 'class-validator';
// import { Type } from 'class-transformer';

// export enum SortBy {
//   PRICE_ASC = 'price_asc',
//   PRICE_DESC = 'price_desc',
//   DISTANCE_ASC = 'distance_asc',
//   RATING_DESC = 'rating_desc',
//   POPULARITY = 'popularity',
// }

// export class SearchServicesDto {
//   @ApiPropertyOptional({ description: 'Search query (service name)', example: 'Express Wash' })
//   @IsOptional()
//   @IsString()
//   query?: string;

//   @ApiPropertyOptional({ description: 'Category filter', example: 'Wash' })
//   @IsOptional()
//   @IsString()
//   category?: string;

//   @ApiPropertyOptional({ description: 'Location latitude', example: 30.0444 })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   latitude?: number;

//   @ApiPropertyOptional({ description: 'Location longitude', example: 31.2357 })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   longitude?: number;

//   @ApiPropertyOptional({ description: 'Search radius in km', example: 10, default: 20 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Max(100)
//   @Type(() => Number)
//   radius?: number = 20;

//   @ApiPropertyOptional({ description: 'Minimum price', example: 50 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   min_price?: number;

//   @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   max_price?: number;

//   @ApiPropertyOptional({ description: 'Minimum rating', example: 4, minimum: 0, maximum: 5 })
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   @Type(() => Number)
//   min_rating?: number;

//   @ApiPropertyOptional({ enum: SortBy, description: 'Sort by', default: SortBy.PRICE_ASC })
//   @IsOptional()
//   @IsEnum(SortBy)
//   sort_by?: SortBy = SortBy.PRICE_ASC;

//   @ApiPropertyOptional({ description: 'Page number', default: 1 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   page?: number = 1;

//   @ApiPropertyOptional({ description: 'Items per page', default: 20, maximum: 50 })
//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Max(50)
//   @Type(() => Number)
//   limit?: number = 20;
// }

// export class ServiceOfferDto {
//   @ApiProperty()
//   business_service_id: string;

//   @ApiProperty()
//   business_id: string;

//   @ApiProperty()
//   business_name: string;

//   @ApiProperty()
//   business_address: string;

//   @ApiPropertyOptional()
//   business_phone?: string;

//   @ApiProperty()
//   distance_km: number;

//   @ApiProperty()
//   price: number;

//   @ApiProperty()
//   duration_minutes: number;

//   @ApiProperty()
//   average_rating: number;

//   @ApiProperty()
//   total_reviews: number;

//   @ApiProperty()
//   is_open: boolean;

//   @ApiPropertyOptional()
//   operating_hours_today?: string;
// }

// export class ServiceDiscoveryResponseDto {
//   @ApiProperty()
//   service_id: string;

//   @ApiProperty()
//   service_name: string;

//   @ApiPropertyOptional()
//   service_description?: string;

//   @ApiProperty()
//   category_id: string;

//   @ApiProperty()
//   category_name: string;

//   @ApiProperty()
//   total_offers: number;

//   @ApiProperty()
//   price_range: {
//     min: number;
//     max: number;
//   };

//   @ApiProperty({ type: [ServiceOfferDto] })
//   offers: ServiceOfferDto[];
// }

// export class SearchSuggestionsDto {
//   @ApiProperty()
//   query: string;

//   @ApiProperty({ type: [String] })
//   service_suggestions: string[];

//   @ApiProperty({ type: [String] })
//   category_suggestions: string[];
// }

// export class PopularServiceDto {
//   @ApiProperty()
//   service_id: string;

//   @ApiProperty()
//   service_name: string;

//   @ApiProperty()
//   category_name: string;

//   @ApiProperty()
//   provider_count: number;

//   @ApiProperty()
//   min_price: number;

//   @ApiProperty()
//   average_rating: number;
// }
