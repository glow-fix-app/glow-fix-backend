import { BaseEntity, PaginationQuery } from '../common/index';

export interface Booking extends BaseEntity {
  vehicleId: string;
  businessId: string;
  scheduledAt: Date;
  expectedDeliveryAt: Date | null;
  subTotal: number;
  discount: number;
  platformFee: number;
  commission: number;
  totalPrice: number;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  businessServiceId: string;
  price: number;
}

export interface CreateBookingRequest {
  vehicleId: string;
  businessId: string;
  scheduledAt: string;
  serviceIds: string[];
}

export interface BookingFilterQuery extends PaginationQuery {
  statusId?: string;
  businessId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface BookingSummary {
  id: string;
  businessName: string;
  vehicleName: string;
  totalPrice: number;
  scheduledAt: Date;
}