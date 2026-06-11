import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemSettingsEntity {
  @ApiProperty({ description: 'Platform fee percentage (0-100)' })
  business_fee_pct: number;

  @ApiProperty({ description: 'Maximum cancellation time in minutes' })
  max_cancel_minutes: number;

  @ApiProperty({ description: 'Maximum days in advance for booking' })
  max_booking_advance_days: number;

  @ApiProperty({ description: 'Minimum hours before booking to cancel' })
  min_booking_cancel_hours: number;

  @ApiProperty({ description: 'Whether maintenance mode is active' })
  maintenance_mode: boolean;

  @ApiPropertyOptional({ description: 'Maintenance mode message' })
  maintenance_message?: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}

export class LoyaltyConfigEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Points earned per 100 EGP spent' })
  points_per_100_egp: number;

  @ApiProperty({ description: 'EGP value per point for redemption' })
  egp_per_point: number;

  @ApiProperty({ description: 'Maximum percentage of booking total that can be covered by points' })
  max_redeem_pct: number;

  @ApiProperty({ description: 'Whether loyalty program is active' })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}