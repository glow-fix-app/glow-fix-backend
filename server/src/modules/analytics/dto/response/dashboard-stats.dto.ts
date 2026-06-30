import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total revenue for the period' })
  total_revenue: number;

  @ApiProperty({ description: 'Total platform fees collected' })
  total_fees: number;

  @ApiProperty({ description: 'Net revenue after fees' })
  net_revenue: number;

  @ApiProperty({ description: 'Total number of bookings' })
  total_bookings: number;

  @ApiProperty({ description: 'Completed bookings count' })
  completed_bookings: number;

  @ApiProperty({ description: 'Cancelled bookings count' })
  cancelled_bookings: number;

  @ApiProperty({ description: 'Pending bookings count' })
  pending_bookings: number;

  @ApiProperty({ description: 'Booking completion rate (%)' })
  completion_rate: number;

  @ApiProperty({ description: 'Total number of users' })
  total_users: number;

  @ApiProperty({ description: 'New users this period' })
  new_users: number;

  @ApiProperty({ description: 'Total number of businesses' })
  total_businesses: number;

  @ApiProperty({ description: 'New businesses this period' })
  new_businesses: number;

  @ApiProperty({ description: 'Active businesses' })
  active_businesses: number;

  @ApiProperty({ description: 'Pending businesses awaiting approval' })
  pending_businesses: number;

  @ApiProperty({ description: 'Average order value (EGP)' })
  average_order_value: number;

  @ApiProperty({ description: 'Total loyalty points issued' })
  total_points_issued: number;

  @ApiProperty({ description: 'Total loyalty points redeemed' })
  total_points_redeemed: number;
}

export class DashboardTrendsDto {
  @ApiProperty()
  revenue_trend: number;

  @ApiProperty()
  bookings_trend: number;

  @ApiProperty()
  users_trend: number;

  @ApiProperty()
  businesses_trend: number;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;

  @ApiProperty({ type: DashboardTrendsDto })
  trends: DashboardTrendsDto;

  @ApiProperty()
  period: string;
}