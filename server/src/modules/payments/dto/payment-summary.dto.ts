import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentSummaryDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  booking_id: string;
  
  @ApiProperty()
  amount: number;
  
  @ApiProperty()
  currency: string;
  
  @ApiProperty({ enum: ['PENDING', 'PAID', 'FAILED'] })
  status: string;
  
  @ApiPropertyOptional()
  provider_ref?: string;
  
  @ApiPropertyOptional()
  paid_at?: Date;
  
  @ApiProperty()
  created_at: Date;
}

export class PaymentReceiptDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  booking_code: string;
  
  @ApiProperty()
  date: Date;
  
  @ApiProperty()
  from: { name: string; address: string };
  
  @ApiProperty()
  billed_to: { name: string; email: string; phone?: string };
  
  @ApiProperty()
  subtotal: number;
  
  @ApiProperty()
  loyalty_discount: number;
  
  @ApiProperty()
  total: number;
  
  @ApiProperty()
  payment_method: string;
  
  @ApiPropertyOptional()
  provider_ref?: string;
  
  @ApiProperty()
  receipt_number: string;
}