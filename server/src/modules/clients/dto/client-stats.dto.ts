import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientStatsDto {
  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  completed_bookings: number;

  @ApiProperty()
  cancelled_bookings: number;

  @ApiProperty()
  pending_bookings: number;

  @ApiProperty()
  in_progress_bookings: number;

  @ApiProperty()
  total_spent: number;

  @ApiPropertyOptional()
  total_refunded?: number;

  @ApiProperty()
  loyalty_points: number;

  @ApiProperty()
  vehicles_count: number;

  @ApiProperty()
  member_since: Date;

  @ApiProperty()
  last_active: Date;
}

export class LoyaltyTransactionDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['EARNED', 'REDEEMED'] })
  type: string;

  @ApiProperty()
  points: number;

  @ApiProperty()
  reason: string;

  @ApiPropertyOptional()
  booking_code?: string;

  @ApiPropertyOptional()
  business_name?: string;

  @ApiProperty()
  created_at: Date;
}

export class LoyaltySummaryDto {
  @ApiProperty()
  points_balance: number;

  @ApiProperty()
  points_value_egp: number;

  @ApiProperty({ type: [LoyaltyTransactionDto] })
  recent_transactions: LoyaltyTransactionDto[];
}

// import { ApiProperty } from '@nestjs/swagger';

// export class ClientStatsDto {
//   @ApiProperty()
//   total_bookings: number;

//   @ApiProperty()
//   completed_bookings: number;

//   @ApiProperty()
//   cancelled_bookings: number;

//   @ApiProperty()
//   pending_bookings: number;

//   @ApiProperty()
//   in_progress_bookings: number;

//   @ApiProperty()
//   total_spent: number;

//   @ApiProperty()
//   average_booking_value: number;

//   @ApiProperty()
//   loyalty_points: number;

//   @ApiProperty()
//   vehicles_count: number;

//   @ApiProperty()
//   member_since: Date;

//   @ApiProperty()
//   last_active: Date;
// }