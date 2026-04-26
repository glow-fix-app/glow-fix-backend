import {
  BookingStatus,
  ServiceType,
  PaymentMethod,
  PaymentStatus,
  UUID,
  Timestamp,
  Cents,
} from './';

export interface Booking {
  id: UUID;
  customerId: UUID;
  vehicleId: UUID;
  carWashId: UUID;
  assignedStaffId?: UUID;
  serviceType: ServiceType;
  scheduledTime: Timestamp;
  estimatedDuration: number;
  actualDuration?: number;
  queuePosition?: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotalAmount: Cents;
  discountAmount: Cents;
  taxAmount: Cents;
  totalAmount: Cents;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned?: number;
  beforePhotos: string[];
  afterPhotos: string[];
  cancellationReason?: string;
  cancelledAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}