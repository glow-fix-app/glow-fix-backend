import { BaseEntity } from '../common/index';
import { WarrantyStatus, WarrantyClaimStatus } from '../enums/index';

export interface Warranty extends BaseEntity {
  bookingId: string;
  customerId: string;
  serviceType: string;
  coverageDescription: string;
  durationDays: number;
  expiresAt: Date;
  status: WarrantyStatus;
}

export interface WarrantyClaim extends BaseEntity {
  warrantyId: string;
  bookingId: string;
  customerId: string;
  description: string;
  photos: string[];
  status: WarrantyClaimStatus;
  resolution: string | null;
  processedBy: string | null;
  processedAt: Date | null;
}

export interface CreateWarrantyClaimRequest {
  warrantyId: string;
  description: string;
  photos?: string[];
}