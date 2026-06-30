import { ApiProperty } from '@nestjs/swagger';

export class AdminLoyaltyStatsResponseDto {
  @ApiProperty()
  total_points_issued: number;

  @ApiProperty()
  total_points_redeemed: number;

  @ApiProperty()
  active_clients_with_points: number;

  @ApiProperty()
  average_points_per_client: number;

  @ApiProperty()
  total_redemptions: number;

  @ApiProperty()
  total_discount_value: number;
}
