import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AvailableServiceEntity {
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
