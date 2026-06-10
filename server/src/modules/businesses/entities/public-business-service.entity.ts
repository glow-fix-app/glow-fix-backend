import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicBusinessServiceEntity {
  @ApiProperty()
  business_service_id: string;

  @ApiProperty()
  service_id: string;

  @ApiProperty()
  service_title: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  average_duration: number;

  @ApiProperty()
  is_active: boolean;
}
