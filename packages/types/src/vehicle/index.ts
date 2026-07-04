import { BaseEntity } from '../common/index';

export interface ClientVehicle extends BaseEntity {
  clientId: string;
  licensePlate: string;
  model: string | null;
  year: number | null;
  color: string | null;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  model?: string;
  year?: number;
  color?: string;
}

export interface UpdateVehicleRequest {
  licensePlate?: string;
  model?: string;
  year?: number;
  color?: string;
}