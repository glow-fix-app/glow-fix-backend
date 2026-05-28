// This integrates with the loyalty module for points calculation

export interface LoyaltyCalculation {
  eligible: boolean;
  pointsAvailable: number;
  pointsToUse: number;
  discountAmount: number;
  remainingPoints: number;
}

export function calculateLoyaltyDiscount(
  pointsBalance: number,
  totalAmount: number,
  pointsToRedeem?: number,
  config?: { pointsPerEGP?: number; maxRedemptionPercent?: number }
): LoyaltyCalculation {
  const maxRedemptionPercent = config?.maxRedemptionPercent || 50;
  const pointsPerEGP = config?.pointsPerEGP || 10; // 10 points = 1 EGP
  
  const maxDiscountAmount = (totalAmount * maxRedemptionPercent) / 100;
  const maxPointsForDiscount = maxDiscountAmount * pointsPerEGP;
  
  let pointsToUse = pointsToRedeem || pointsBalance;
  pointsToUse = Math.min(pointsToUse, pointsBalance);
  pointsToUse = Math.min(pointsToUse, maxPointsForDiscount);
  
  const discountAmount = pointsToUse / pointsPerEGP;
  
  return {
    eligible: pointsBalance > 0 && discountAmount > 0,
    pointsAvailable: pointsBalance,
    pointsToUse,
    discountAmount,
    remainingPoints: pointsBalance - pointsToUse,
  };
}