import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingNoteEntity } from './booking-note.entity';
import { DiagnosticReportEntity } from './diagnostic-report.entity';

export class BookingStatusHistoryEntry {
  @ApiProperty({ description: 'Status name' })
  status: string;

  @ApiProperty({ description: 'Created at timestamp' })
  created_at: Date;
}

export class BookingVehicleSummary {
  @ApiProperty({ description: 'Vehicle ID' })
  id: string;

  @ApiProperty({ description: 'Vehicle model' })
  model: string;

  @ApiProperty({ description: 'License plate' })
  license_plate: string;

  @ApiProperty({ description: 'Vehicle color' })
  color: string;

  @ApiProperty({ description: 'Vehicle year' })
  year: number;
}

export class BookingClientSummary {
  @ApiProperty({ description: 'Client ID' })
  id: string;

  @ApiProperty({ description: 'Client user ID' })
  user_id: string;

  @ApiProperty({ description: 'Client full name' })
  name: string;

  @ApiProperty({ description: 'Client email' })
  email: string;

  @ApiProperty({ description: 'Client phone number' })
  phone: string;
}

export class BookingBusinessSummary {
  @ApiProperty({ description: 'Business ID' })
  id: string;

  @ApiProperty({ description: 'Business name' })
  business_name: string;

  @ApiProperty({ description: 'Business address' })
  address: string;
}

export class BookingItemSummary {
  @ApiProperty({ description: 'Booking item ID' })
  id: string;

  @ApiProperty({ description: 'Business service ID' })
  business_service_id: string;

  @ApiProperty({ description: 'Service catalog title' })
  service_title: string;

  @ApiProperty({ description: 'Category name' })
  category_name: string;

  @ApiProperty({ description: 'Service price (in EGP/piastres as mapped)' })
  price: number;
}

export class BookingPaymentSummary {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ description: 'Payment amount' })
  amount: number;

  @ApiProperty({ description: 'Payment currency' })
  currency: string;

  @ApiProperty({ description: 'Payment status name' })
  status: string;

  @ApiProperty({ description: 'Payment method name' })
  payment_method: string;
}

export class BookingReviewSummary {
  @ApiProperty({ description: 'Review ID' })
  id: string;

  @ApiProperty({ description: 'Rating (0-5)' })
  rating: number;

  @ApiPropertyOptional({ description: 'Review comment' })
  comment?: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}

export class BookingEntity {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Vehicle ID' })
  vehicle_id: string;

  @ApiProperty({ description: 'Business ID' })
  business_id: string;

  @ApiProperty({ description: 'Scheduled appointment timestamp' })
  scheduled_at: Date;

  @ApiPropertyOptional({ description: 'Expected completion delivery timestamp' })
  expected_delivery_at?: Date | null;

  @ApiProperty({ description: 'Subtotal price' })
  sub_total: number;

  @ApiProperty({ description: 'Discount applied' })
  discount: number;

  @ApiProperty({ description: 'Platform commission' })
  commission: number;

  @ApiProperty({ description: 'Total price' })
  total_price: number;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiProperty({ description: 'Current latest booking status name' })
  status: string;

  @ApiProperty({ description: 'Status transitions history list', type: [BookingStatusHistoryEntry] })
  status_history: BookingStatusHistoryEntry[];

  @ApiProperty({ description: 'Client vehicle summary' })
  vehicle: BookingVehicleSummary | null;

  @ApiProperty({ description: 'Client user summary' })
  client: BookingClientSummary | null;

  @ApiProperty({ description: 'Business summary' })
  business: BookingBusinessSummary | null;

  @ApiProperty({ description: 'Booking service line items list', type: [BookingItemSummary] })
  items: BookingItemSummary[];

  @ApiProperty({ description: 'Internal booking notes list', type: [BookingNoteEntity] })
  notes: BookingNoteEntity[];

  @ApiPropertyOptional({ description: 'Diagnostic inspection report details' })
  diagnostic_report?: DiagnosticReportEntity | null;

  @ApiPropertyOptional({ description: 'Read-only payment summary details' })
  payment?: BookingPaymentSummary | null;

  @ApiPropertyOptional({ description: 'Read-only review summary details' })
  review?: BookingReviewSummary | null;
}
