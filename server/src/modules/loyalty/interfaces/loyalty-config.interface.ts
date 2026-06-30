export interface LoyaltyConfig {
  id: string;
  points_per_100_egp: number;
  egp_per_point: number;
  max_redeem_pct: number;
  min_points_to_redeem: number;
  points_expiry_days: number | null;
  is_active: boolean;
}
