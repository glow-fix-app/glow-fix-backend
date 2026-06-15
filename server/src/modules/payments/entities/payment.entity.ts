import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  payment_method_id: string;

  @ApiProperty()
  payment_method_name: string;

  @ApiPropertyOptional()
  provider?: string;

  @ApiPropertyOptional()
  provider_ref?: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] })
  status: string;

  @ApiPropertyOptional()
  paid_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class PaymentReceiptEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  receipt_number: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  from: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };

  @ApiProperty()
  billed_to: {
    name: string;
    email: string;
    phone?: string;
  };

  @ApiProperty({ type: [Object] })
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  tax: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  payment_method: string;

  @ApiPropertyOptional()
  provider_ref?: string;

  @ApiProperty()
  status: string;
}