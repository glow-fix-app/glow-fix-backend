import { AccountStatus, ServiceType, UUID, Timestamp } from './';

export interface Staff {
  id: UUID;
  fullName: string;
  mobileNumber: string;
  email: string;
  licenseNumber?: string;
  specialty: ServiceType[];
  employeeId?: string;
  hourlyRate: number;
  status: AccountStatus;
  isAvailable: boolean;
  carWashId?: UUID;
  averageRating: number;
  totalJobsCompleted: number;
  mustChangePassword: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}