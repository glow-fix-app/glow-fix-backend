import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLoyaltyConfigDto {
  @ApiPropertyOptional({ description: 'Points earned per 100 EGP spent', example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  points_per_100_egp?: number;

  @ApiPropertyOptional({ description: 'EGP value per point (for redemption)', example: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  egp_per_point?: number;

  @ApiPropertyOptional({ description: 'Maximum percentage of booking total that can be covered by points', example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  max_redeem_pct?: number;

  @ApiPropertyOptional({ description: 'Minimum points required for redemption', example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  min_points_to_redeem?: number;

  @ApiPropertyOptional({ description: 'Points expiry in days (null = never expire)', example: 365 })
  @IsOptional()
  @IsInt()
  @Min(0)
  points_expiry_days?: number | null;

  @ApiPropertyOptional({ description: 'Is loyalty program active' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

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