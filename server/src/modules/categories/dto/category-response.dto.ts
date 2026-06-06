// modules/categories/dto/category-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration_minutes: number;

  @ApiProperty()
  is_active: boolean;
}

export class CategoryWithServicesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ServiceDto] })
  services: ServiceDto[];
}

export class BusinessCategoriesResponseDto {
  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty({ type: [CategoryWithServicesDto] })
  categories: CategoryWithServicesDto[];
}