import { BaseEntity } from '../common/index';
import { LoyaltyTransactionType } from '../enums';

export interface LoyaltyTransaction extends BaseEntity {
  clientId: string;
  bookingId: string | null;
  points: number;
  type: LoyaltyTransactionType;
  description: string;
  expiryDate: Date | null;
}

export interface LoyaltyBalance {
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number;
  expiringPoints: number;
  expiringDate: Date | null;
  dollarValue: number;
}

export interface LoyaltyConfig {
  pointsPerDollar: number;
  pointsPerRedemptionDollar: number;
  reviewBonusPoints: number;
  offPeakMultiplier: number;
  offPeakStartHour: number;
  offPeakEndHour: number;
  expiryMonths: number;
}