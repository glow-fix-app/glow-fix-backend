import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty({ example: 'Express Hand Wash' })
  title: string;

  @ApiPropertyOptional({ example: 'Exterior wash, tire shine, quick interior vacuum' })
  description?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ServiceWithCategoryEntity extends ServiceEntity {
  @ApiProperty()
  category_name: string;
}