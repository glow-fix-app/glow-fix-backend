import { AccountStatus, UUID, Timestamp, Cents } from './';

export interface Customer {
  id: UUID;
  fullName: string;
  mobileNumber: string;
  email: string;
  birthdate?: Date;
  profilePhotoUrl?: string;
  homeLocationLat?: number;
  homeLocationLng?: number;
  status: AccountStatus;
  emailVerified: boolean;
  mobileVerified: boolean;
  twoFactorEnabled: boolean;
  loyaltyPoints: number;
  totalSpent: Cents;
  totalBookings: number;
  referralCode: string;
  marketingConsent: boolean;
  preferredLanguage: string;
  timezone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt?: Timestamp;
  deletedAt?: Timestamp;
}