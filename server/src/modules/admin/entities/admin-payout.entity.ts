import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminPayoutEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  manager_name: string;

  @ApiProperty()
  manager_email: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ['PENDING', 'PROCESSED', 'FAILED'] })
  status: string;

  @ApiPropertyOptional()
  processed_at?: Date;

  @ApiProperty()
  created_at: Date;
}

export class PayoutListMetaEntity {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class PayoutListResponseEntity {
  @ApiProperty({ type: [AdminPayoutEntity] })
  data: AdminPayoutEntity[];

  @ApiProperty({ type: PayoutListMetaEntity })
  meta: PayoutListMetaEntity;
}