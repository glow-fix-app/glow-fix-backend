import { BaseEntity, SoftDeletable, Coordinates } from '../common/index';
export interface Customer extends BaseEntity, SoftDeletable {
    fullName: string;
    mobileNumber: string;
    email: string;
    passwordHash: string;
    birthdate: Date | null;
    profilePhotoUrl: string | null;
    homeLocation: Coordinates | null;
    loyaltyPoints: number;
    totalSpent: number;
    marketingConsent: boolean;
    emailVerified: boolean;
    mobileVerified: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    referralCode: string;
    referredBy: string | null;
    lastActiveAt: Date;
}
export interface CustomerProfile {
    id: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    birthdate: Date | null;
    profilePhotoUrl: string | null;
    loyaltyPoints: number;
    totalSpent: number;
    emailVerified: boolean;
    mobileVerified: boolean;
    twoFactorEnabled: boolean;
    referralCode: string;
    memberSince: Date;
}
export interface UpdateCustomerProfileRequest {
    fullName?: string;
    birthdate?: Date;
    profilePhotoUrl?: string;
    homeLocation?: Coordinates;
}
export interface NotificationPreferences {
    channels: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
        push: boolean;
        inApp: boolean;
    };
    frequency: {
        marketing: 'immediate' | 'daily' | 'weekly' | 'never';
        transactional: 'immediate';
    };
    quietHours: {
        enabled: boolean;
        start: string;
        end: string;
    };
}
