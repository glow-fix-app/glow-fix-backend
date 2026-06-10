import { ApiProperty } from '@nestjs/swagger';
import { PublicBusinessServiceEntity } from './public-business-service.entity';

export class PublicBusinessServiceCategoryEntity {
  @ApiProperty()
  category_id: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  services_count: number;

  @ApiProperty({ type: [PublicBusinessServiceEntity] })
  services: PublicBusinessServiceEntity[];
}
