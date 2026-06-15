import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty()
  total_users: number;

  @ApiProperty()
  total_clients: number;

  @ApiProperty()
  total_managers: number;

  @ApiProperty()
  total_admins: number;

  @ApiProperty()
  new_users_today: number;

  @ApiProperty()
  new_users_this_week: number;

  @ApiProperty()
  total_businesses: number;

  @ApiProperty()
  pending_businesses: number;

  @ApiProperty()
  approved_businesses: number;

  @ApiProperty()
  rejected_businesses: number;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  completed_bookings: number;

  @ApiProperty()
  pending_bookings: number;

  @ApiProperty()
  cancelled_bookings: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  platform_fees: number;

  @ApiProperty()
  net_revenue: number;

  @ApiProperty()
  total_payouts: number;

  @ApiProperty()
  pending_payouts: number;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;
}

export class RevenueStatsDto {
  @ApiProperty()
  daily: Array<{
    date: string;
    revenue: number;
    fees: number;
    bookings: number;
  }>;

  @ApiProperty()
  weekly: Array<{
    week: string;
    revenue: number;
    fees: number;
    bookings: number;
  }>;

  @ApiProperty()
  monthly: Array<{
    month: string;
    revenue: number;
    fees: number;
    bookings: number;
  }>;

  @ApiProperty()
  yearly: Array<{
    year: number;
    revenue: number;
    fees: number;
    bookings: number;
  }>;
}

export class TopPerformersDto {
  @ApiProperty({ type: [Object] })
  top_businesses: Array<{
    id: string;
    business_name: string;
    total_bookings: number;
    total_revenue: number;
    average_rating: number;
  }>;

  @ApiProperty({ type: [Object] })
  top_clients: Array<{
    id: string;
    full_name: string;
    email: string;
    total_bookings: number;
    total_spent: number;
  }>;
}

export class PlatformHealthDto {
  @ApiProperty()
  database_status: 'ok' | 'error';

  @ApiProperty()
  database_latency_ms: number;

  @ApiProperty()
  redis_status: 'ok' | 'error';

  @ApiProperty()
  redis_latency_ms: number;

  @ApiProperty()
  storage_status: 'ok' | 'error';

  @ApiProperty()
  uptime_seconds: number;

  @ApiProperty()
  memory_usage_mb: number;

  @ApiProperty()
  cpu_usage_percent: number;
}