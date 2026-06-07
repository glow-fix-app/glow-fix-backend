import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;
}

// Admin view - service catalog (no price/duration)
export class ServiceCatalogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

// Manager view - assigned service with price
export class AssignedBusinessServiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  service_id: string;

  @ApiProperty()
  service_title: string;

  @ApiPropertyOptional()
  service_description?: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty({ description: 'Price set by manager (in EGP)' })
  price: number;

  @ApiProperty({ description: 'Duration set by manager (in minutes)' })
  average_duration: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

// For clients viewing available services
export class AvailableServiceDto {
  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  service_id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration_minutes: number;
}

export class BulkAssignResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  assigned_count: number;

  @ApiProperty()
  skipped_count: number;

  @ApiProperty({ type: [AssignedBusinessServiceResponseDto] })
  assigned_services: AssignedBusinessServiceResponseDto[];

  @ApiProperty({ type: [String] })
  skipped_services: string[];
}