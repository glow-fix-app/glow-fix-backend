import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RevenuePointDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  net_revenue: number;

  @ApiProperty()
  bookings_count: number;
}

export class RevenueStatsDto {
  @ApiProperty({ type: [RevenuePointDto] })
  daily: RevenuePointDto[];

  @ApiProperty({ type: [RevenuePointDto] })
  weekly: RevenuePointDto[];

  @ApiProperty({ type: [RevenuePointDto] })
  monthly: RevenuePointDto[];

  @ApiProperty({ type: [RevenuePointDto] })
  yearly: RevenuePointDto[];
}

export class RevenueSummaryDto {
  @ApiProperty()
  total_revenue: number;

  @ApiProperty()
  platform_fees: number;

  @ApiProperty()
  net_revenue: number;

  @ApiProperty()
  average_daily_revenue: number;

  @ApiProperty()
  projected_monthly_revenue: number;

  @ApiProperty()
  revenue_growth_percent: number;
}

export class PaymentMethodStatsDto {
  @ApiProperty()
  method: string;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}