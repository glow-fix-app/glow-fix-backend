import { BaseEntity } from '../common/index';

export interface Vehicle extends BaseEntity {
  customerId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  nickname: string | null;
  isDefault: boolean;
  photoUrl: string | null;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  nickname?: string;
  isDefault?: boolean;
}

export interface UpdateVehicleRequest {
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  nickname?: string;
  isDefault?: boolean;
}