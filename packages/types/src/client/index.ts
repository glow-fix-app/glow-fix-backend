import { BaseEntity, SoftDeletable, Coordinates } from '../common/index';

export interface Client extends BaseEntity {
  userId: string;
  city: string | null;
  location: Coordinates | null;
}

export interface ClientProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string | null;
  email: string;
  city: string | null;
  location: Coordinates | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  memberSince: Date;
}

export interface UpdateClientProfileRequest {
  fullName?: string;
  city?: string;
  location?: Coordinates;
}