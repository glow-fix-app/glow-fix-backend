import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] })
  status: string;

  @ApiPropertyOptional()
  provider_ref?: string;

  @ApiPropertyOptional()
  paid_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiPropertyOptional()
  booking?: any;
}

export class ReceiptResponseDto {
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

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  payment_method: string;

  @ApiPropertyOptional()
  provider_ref?: string;

  @ApiProperty()
  status: string;
}