import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardStatsEntity {
  @ApiProperty({ description: 'Total revenue for the period (EGP)' })
  total_revenue: number;

  @ApiProperty({ description: 'Total platform fees collected (EGP)' })
  total_fees: number;

  @ApiProperty({ description: 'Net revenue after fees (EGP)' })
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

  @ApiProperty({ description: 'Active businesses (approved)' })
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

export class DashboardTrendsEntity {
  @ApiProperty({ description: 'Revenue trend percentage change' })
  revenue_trend: number;

  @ApiProperty({ description: 'Bookings trend percentage change' })
  bookings_trend: number;

  @ApiProperty({ description: 'Users trend percentage change' })
  users_trend: number;

  @ApiProperty({ description: 'Businesses trend percentage change' })
  businesses_trend: number;
}

export class DashboardSummaryResponseEntity {
  @ApiProperty({ type: DashboardStatsEntity })
  stats: DashboardStatsEntity;

  @ApiProperty({ type: DashboardTrendsEntity })
  trends: DashboardTrendsEntity;

  @ApiProperty({ description: 'Period label', example: 'This Month' })
  period: string;
}