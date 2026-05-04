import { BookingStatus, PaymentMethod, PaymentStatus, ServiceType, ServiceStage } from '../enums/index';
import { BaseEntity, PaginationQuery } from '../common/index';
export interface Booking extends BaseEntity {
    customerId: string;
    vehicleId: string;
    carWashId: string;
    staffId: string | null;
    serviceType: ServiceType;
    addOns: BookingAddOn[];
    scheduledTime: Date;
    estimatedDuration: number;
    actualDuration: number | null;
    queuePosition: number | null;
    currentStage: ServiceStage | null;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    loyaltyPointsUsed: number;
    loyaltyPointsEarned: number | null;
    beforePhotos: string[];
    afterPhotos: string[];
    cancellationReason: string | null;
    cancelledAt: Date | null;
    completedAt: Date | null;
    idempotencyKey: string;
}
export interface BookingAddOn {
    id: string;
    name: string;
    price: number;
}
export interface CreateBookingRequest {
    vehicleId: string;
    carWashId: string;
    serviceType: ServiceType;
    scheduledTime: string;
    addOns?: string[];
    paymentMethod: PaymentMethod;
    loyaltyPointsToUse?: number;
    promoCode?: string;
    idempotencyKey: string;
}
export interface UpdateBookingStatusRequest {
    status: BookingStatus;
    stage?: ServiceStage;
    notes?: string;
}
export interface BookingFilterQuery extends PaginationQuery {
    status?: BookingStatus;
    serviceType?: ServiceType;
    startDate?: string;
    endDate?: string;
    carWashId?: string;
    staffId?: string;
    customerId?: string;
}
export interface QueuePosition {
    bookingId: string;
    position: number;
    estimatedWaitMinutes: number;
    updatedAt: Date;
}
export interface BookingSummary {
    id: string;
    serviceType: ServiceType;
    status: BookingStatus;
    scheduledTime: Date;
    carWashName: string;
    vehicleName: string;
    totalAmount: number;
    queuePosition: number | null;
}
