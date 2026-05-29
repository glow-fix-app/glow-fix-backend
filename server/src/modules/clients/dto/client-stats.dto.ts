import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  average_booking_value: number;

  @ApiProperty()
  loyalty_points: number;

  @ApiProperty()
  vehicles_count: number;

  @ApiProperty()
  member_since: Date;

  @ApiProperty()
  last_active: Date;
}