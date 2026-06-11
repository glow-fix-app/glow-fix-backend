import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardStatsEntity {
  @ApiProperty({ description: 'Total number of users' })
  total_users: number;

  @ApiProperty({ description: 'Total number of clients' })
  total_clients: number;

  @ApiProperty({ description: 'Total number of managers' })
  total_managers: number;

  @ApiProperty({ description: 'Total number of admins' })
  total_admins: number;

  @ApiProperty({ description: 'New users registered today' })
  new_users_today: number;

  @ApiProperty({ description: 'New users registered this week' })
  new_users_this_week: number;

  @ApiProperty({ description: 'Total number of businesses' })
  total_businesses: number;

  @ApiProperty({ description: 'Businesses pending review' })
  pending_businesses: number;

  @ApiProperty({ description: 'Approved businesses' })
  approved_businesses: number;

  @ApiProperty({ description: 'Rejected businesses' })
  rejected_businesses: number;

  @ApiProperty({ description: 'Total number of bookings' })
  total_bookings: number;

  @ApiProperty({ description: 'Completed bookings' })
  completed_bookings: number;

  @ApiProperty({ description: 'Pending bookings' })
  pending_bookings: number;

  @ApiProperty({ description: 'Cancelled bookings' })
  cancelled_bookings: number;

  @ApiProperty({ description: 'Total revenue in EGP' })
  total_revenue: number;

  @ApiProperty({ description: 'Platform fees collected' })
  platform_fees: number;

  @ApiProperty({ description: 'Net revenue after fees' })
  net_revenue: number;

  @ApiProperty({ description: 'Total payouts processed' })
  total_payouts: number;

  @ApiProperty({ description: 'Pending payouts' })
  pending_payouts: number;

  @ApiProperty({ description: 'Average rating across all reviews' })
  average_rating: number;

  @ApiProperty({ description: 'Total number of reviews' })
  total_reviews: number;
}

export class RevenuePointEntity {
  @ApiProperty()
  date?: string;

  @ApiProperty()
  week?: string;

  @ApiProperty()
  month?: string;

  @ApiProperty()
  year?: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  bookings: number;
}

export class RevenueStatsEntity {
  @ApiProperty({ type: [RevenuePointEntity] })
  daily: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity] })
  weekly: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity] })
  monthly: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity] })
  yearly: RevenuePointEntity[];
}

export class TopBusinessEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  average_rating: number;
}

export class TopClientEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  total_bookings: number;

  @ApiProperty()
  total_spent: number;
}

export class TopPerformersEntity {
  @ApiProperty({ type: [TopBusinessEntity] })
  top_businesses: TopBusinessEntity[];

  @ApiProperty({ type: [TopClientEntity] })
  top_clients: TopClientEntity[];
}

export class PlatformHealthEntity {
  @ApiProperty({ enum: ['ok', 'error'] })
  database_status: string;

  @ApiProperty()
  database_latency_ms: number;

  @ApiProperty({ enum: ['ok', 'error'] })
  redis_status: string;

  @ApiProperty()
  redis_latency_ms: number;

  @ApiProperty({ enum: ['ok', 'error'] })
  storage_status: string;

  @ApiProperty()
  uptime_seconds: number;

  @ApiProperty()
  memory_usage_mb: number;

  @ApiProperty()
  cpu_usage_percent: number;
}