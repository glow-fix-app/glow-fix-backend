import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessServiceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  service_id: string;

  @ApiProperty({ example: 120 })
  price: number;

  @ApiProperty({ example: 30 })
  average_duration: number;

  @ApiProperty({ default: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class AssignedBusinessServiceEntity extends BusinessServiceEntity {
  @ApiProperty()
  service_title: string;

  @ApiPropertyOptional()
  service_description?: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  business_name: string;
}
