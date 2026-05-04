import { BaseEntity } from '../common/index';
import { ServiceType } from '../enums';

export interface Service extends BaseEntity {
  carWashId: string;
  name: string;
  description: string;
  type: ServiceType;
  durationMinutes: number;
  basePrice: number;
  peakPrice: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface AddOn extends BaseEntity {
  carWashId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface CarWash extends BaseEntity {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  description: string | null;
  photos: string[];
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  operatingHours: OperatingHours[];
}

export interface OperatingHours {
  dayOfWeek: number; // 0 = Sunday
  openTime: string;  // "08:00"
  closeTime: string; // "18:00"
  isClosed: boolean;
}

export interface NearbyCarWashQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  serviceType?: ServiceType;
  minRating?: number;
  openNow?: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  staffCount: number;
}