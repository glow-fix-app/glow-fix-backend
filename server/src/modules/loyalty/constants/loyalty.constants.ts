export const LoyaltyTier = [
  { name: 'Bronze', minPoints: 0, discount: 0 },
  { name: 'Silver', minPoints: 1000, discount: 5 },
  { name: 'Gold', minPoints: 5000, discount: 10 },
  { name: 'Platinum', minPoints: 10000, discount: 15 },
] as const;

export const SIGNUP_BONUS_POINTS = 500;
export const DEFAULT_POINTS_PER_100_EGP = 100;
export const DEFAULT_EGP_PER_POINT = 0.1;
export const DEFAULT_MAX_REDEEM_PCT = 50;
export const DEFAULT_MIN_POINTS_TO_REDEEM = 100;
export const CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;
export const MAX_PAGE_SIZE = 50;

export const DEFAULT_QUICK_REDEEM_OPTIONS = [100, 250, 500, 1000];

export const LOYALTY_EVENTS = {
  POINTS_EARNED: 'loyalty.points_earned',
  POINTS_REDEEMED: 'loyalty.points_redeemed',
} as const;
