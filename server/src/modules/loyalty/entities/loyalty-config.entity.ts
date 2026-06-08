import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyConfigEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Points earned per 100 EGP spent', example: 100 })
  points_per_100_egp: number;

  @ApiProperty({ description: 'EGP value per point for redemption', example: 0.1 })
  egp_per_point: number;

  @ApiProperty({ description: 'Maximum percentage of booking total that can be covered by points', example: 50 })
  max_redeem_pct: number;

  @ApiPropertyOptional({ description: 'Minimum points required for redemption', example: 100 })
  min_points_to_redeem: number;

  @ApiProperty({ default: true })
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}