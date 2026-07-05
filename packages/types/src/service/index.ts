import { BaseEntity, Coordinates } from '../common/index';

export interface Category extends BaseEntity {
  name: string;
  isActive: boolean;
}

export interface Service extends BaseEntity {
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface BusinessService extends BaseEntity {
  businessId: string;
  serviceId: string;
  price: number;
  durationMinutes: number | null;
  isActive: boolean;
}

export interface Business extends BaseEntity {
  managerId: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  location: Coordinates | null;
  operatingHours: OperatingHours[];
}

export interface OperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface NearbyBusinessQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  categoryId?: string;
  openNow?: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}