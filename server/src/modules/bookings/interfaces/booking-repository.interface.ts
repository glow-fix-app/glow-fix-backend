import { Prisma } from '@prisma/client';
import { BookingQueryDto } from '../dto/booking-query.dto';

export interface IBookingRepository {
  findClientBookings(clientId: string, query: BookingQueryDto): Promise<[any[], number]>;
  findClientBooking(clientId: string, bookingId: string): Promise<any>;
  findManagerBookings(managerId: string, query: BookingQueryDto): Promise<[any[], number]>;
  findManagerBooking(managerId: string, bookingId: string): Promise<any>;
  findAdminBookings(query: BookingQueryDto): Promise<[any[], number]>;
  findAdminBooking(bookingId: string): Promise<any>;
  
  createBooking(data: {
    userId: string;
    clientId: string;
    vehicleId: string;
    businessId: string;
    scheduledAt: Date;
    expectedDeliveryAt?: Date;
    note?: string;
    images?: { url: string; storageKey?: string }[];
    businessServices: any[];
    subTotal: number;
    platformFee: number;
    commission: number;
    totalPrice: number;
  }): Promise<any>;

  transitionStatus(
    bookingId: string,
    targetContext: string,
    additionalOperations?: (tx: Prisma.TransactionClient, statusRow: any) => Promise<void>
  ): Promise<any>;

  updateBookingData(bookingId: string, data: Prisma.BookingUpdateInput): Promise<any>;
  
  getBookingIdsByLatestStatus(statusContext: string): Promise<string[]>;
  getBookingImages(bookingId: string): Promise<string[]>;
  getUserAvatarByVehicleId(vehicleId: string | undefined): Promise<string | null>;
  resolveBusinessLocation(businessId: string): Promise<{ latitude: number; longitude: number } | null>;
}
