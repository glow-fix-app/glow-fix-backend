import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminBusinessEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  manager_name: string;

  @ApiProperty()
  manager_email: string;

  @ApiPropertyOptional()
  manager_phone?: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  current_status: string;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  created_at: Date;
}

export class AdminBusinessDetailsEntity extends AdminBusinessEntity {
  @ApiProperty({ type: [Object] })
  operating_hours: any[];

  @ApiProperty({ type: [Object] })
  documents: any[];

  @ApiProperty({ type: [Object] })
  status_history: any[];

  @ApiProperty()
  total_services: number;

  @ApiProperty()
  active_services: number;
}

export class BusinessDocumentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiProperty()
  created_at: Date;
}

export class BusinessStatusHistoryEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: Date;
}

export class BusinessListMetaEntity {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class BusinessListResponseEntity {
  @ApiProperty({ type: [AdminBusinessEntity] })
  data: AdminBusinessEntity[];

  @ApiProperty({ type: BusinessListMetaEntity })
  meta: BusinessListMetaEntity;
}