import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoyaltyConfigResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  points_per_100_egp: number;

  @ApiProperty()
  egp_per_point: number;

  @ApiProperty()
  max_redeem_pct: number;

  @ApiProperty()
  min_points_to_redeem: number;

  @ApiPropertyOptional()
  points_expiry_days?: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
