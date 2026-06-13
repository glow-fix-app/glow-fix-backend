import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RevenuePointEntity {
  @ApiProperty({ description: 'Date (YYYY-MM-DD), week (YYYY-Www), or month (YYYY-MM)' })
  date: string;

  @ApiProperty({ description: 'Total revenue (EGP)' })
  revenue: number;

  @ApiProperty({ description: 'Platform fees (EGP)' })
  fees: number;

  @ApiProperty({ description: 'Net revenue after fees (EGP)' })
  net_revenue: number;

  @ApiProperty({ description: 'Number of bookings' })
  bookings_count: number;
}

export class RevenueStatsEntity {
  @ApiProperty({ type: [RevenuePointEntity], description: 'Daily revenue breakdown' })
  daily: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity], description: 'Weekly revenue breakdown' })
  weekly: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity], description: 'Monthly revenue breakdown' })
  monthly: RevenuePointEntity[];

  @ApiProperty({ type: [RevenuePointEntity], description: 'Yearly revenue breakdown' })
  yearly: RevenuePointEntity[];
}

export class RevenueSummaryEntity {
  @ApiProperty({ description: 'Total revenue (EGP)' })
  total_revenue: number;

  @ApiProperty({ description: 'Platform fees (EGP)' })
  platform_fees: number;

  @ApiProperty({ description: 'Net revenue (EGP)' })
  net_revenue: number;

  @ApiProperty({ description: 'Average daily revenue (EGP)' })
  average_daily_revenue: number;

  @ApiProperty({ description: 'Projected monthly revenue (EGP)' })
  projected_monthly_revenue: number;

  @ApiProperty({ description: 'Revenue growth percentage' })
  revenue_growth_percent: number;
}

export class PaymentMethodStatEntity {
  @ApiProperty({ description: 'Payment method name', example: 'CARD' })
  method: string;

  @ApiProperty({ description: 'Total amount collected via this method (EGP)' })
  total_amount: number;

  @ApiProperty({ description: 'Number of transactions' })
  count: number;

  @ApiProperty({ description: 'Percentage of total revenue (%)' })
  percentage: number;
}