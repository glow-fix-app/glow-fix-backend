import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicBusinessOperatingHourEntity } from './public-business-operating-hour.entity';
import { PublicBusinessServiceCategoryEntity } from './public-business-service-category.entity';

export class PublicBusinessAboutEntity {
  @ApiProperty({ type: [PublicBusinessOperatingHourEntity] })
  operating_hours: PublicBusinessOperatingHourEntity[];
}

export class PublicBusinessProfileEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  address: string;

  @ApiPropertyOptional({ nullable: true })
  contact_phone?: string | null;

  @ApiPropertyOptional({ nullable: true })
  contact_email?: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude?: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude?: number | null;

  @ApiPropertyOptional({ nullable: true })
  latest_status?: string | null;

  @ApiPropertyOptional({ nullable: true })
  rating: number | null;

  @ApiProperty()
  reviews_count: number;

  @ApiProperty()
  is_open: boolean;

  @ApiPropertyOptional({ type: PublicBusinessOperatingHourEntity, nullable: true })
  today_hours?: PublicBusinessOperatingHourEntity | null;

  @ApiProperty({ type: [PublicBusinessServiceCategoryEntity] })
  categories: PublicBusinessServiceCategoryEntity[];

  @ApiProperty({ type: PublicBusinessAboutEntity })
  about: PublicBusinessAboutEntity;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
