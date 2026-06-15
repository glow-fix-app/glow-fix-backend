import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ['PENDING', 'PROCESSED', 'FAILED'] })
  status: string;

  @ApiPropertyOptional()
  processed_at?: Date;

  @ApiPropertyOptional()
  failure_reason?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class PayoutBookingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payout_id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  commission: number;

  @ApiProperty()
  net_amount: number;

  @ApiProperty()
  created_at: Date;
}