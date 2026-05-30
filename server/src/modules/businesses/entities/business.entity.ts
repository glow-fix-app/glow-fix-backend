import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessLocation {
  @ApiProperty({ example: 30.0444 })
  latitude: number;

  @ApiProperty({ example: 31.2357 })
  longitude: number;
}

export class BusinessEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  manager_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: BusinessLocation })
  location: BusinessLocation;

  @ApiPropertyOptional()
  contact_phone?: string;

  @ApiPropertyOptional()
  contact_email?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class BusinessWithStatusEntity extends BusinessEntity {
  @ApiProperty()
  current_status: string;

  @ApiPropertyOptional()
  status_changed_at?: Date;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiPropertyOptional({ type: [Object] })
  operating_hours?: any[];

  @ApiPropertyOptional({ type: [Object] })
  documents?: any[];
}