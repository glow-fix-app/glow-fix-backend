import { BaseEntity } from '../common/index';

export interface Staff extends BaseEntity {
  fullName: string;
  mobileNumber: string;
  email: string;
  passwordHash: string;
  licenseNumber: string;
  specialties: string[];
  profilePhotoUrl: string | null;
  hourlyRate: number;
  isActive: boolean;
  averageRating: number;
  totalJobsCompleted: number;
  lastLoginAt: Date | null;
}

export interface CreateStaffRequest {
  fullName: string;
  mobileNumber: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
  hourlyRate: number;
}

export interface StaffPerformance {
  staffId: string;
  period: string;
  jobsCompleted: number;
  averageServiceTime: number;
  averageRating: number;
  earnings: number;
}

export interface StaffAvailability extends BaseEntity {
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeOffRequest extends BaseEntity {
  staffId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  processedBy: string | null;
  processedAt: Date | null;
}