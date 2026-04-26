import { UUID, Timestamp } from './common';

export interface Vehicle {
  id: UUID;
  customerId: UUID;
  licensePlate: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  bodyType?: string;
  nickname?: string;
  photoUrl?: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}