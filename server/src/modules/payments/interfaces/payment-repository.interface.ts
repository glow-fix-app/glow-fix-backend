import {
  Booking,
  Payment,
  Status,
  Payout,
  PayoutBooking,
  LoyaltyConfig,
  PaymentMethod,
  Business,
  Client,
  User,
  Setting,
  NotificationType,
  LoyaltyTransaction,
  BookingStatus,
} from '@prisma/client';

export type BookingWithRelations = Booking & {
  business: Business & { manager: User | null };
  vehicle: any; // We'll keep complex relations as any for now to simplify, or define them explicitly
  payment: (Payment & { status: Status | null }) | null;
  items: any[];
};

export type PaymentWithBooking = Payment & {
  booking: Booking & {
    vehicle: { client: { user: User; id: string; userId: string } };
    business: Business;
  };
};

export type PaymentWithFullBooking = Payment & {
  booking: Booking & {
    business: Business;
    vehicle: { client: { id: string; userId: string; user: User } };
    items: any[];
  };
};

export type PayoutWithRelations = Payout & {
  status: Status;
  payoutBookings: (PayoutBooking & { booking: Booking })[];
};

export interface IPaymentRepository {
  // Booking
  findBookingWithRelations(bookingId: string): Promise<BookingWithRelations | null>;
  getBookingStatus(bookingId: string): Promise<string>;
  createBookingStatus(bookingId: string, statusId: string): Promise<BookingStatus>;

  // Payment
  findPaymentById(paymentId: string): Promise<any | null>;
  findPaymentByProviderRef(providerRef: string): Promise<(Payment & { status: Status | null }) | null>;
  findPaymentByBookingId(bookingId: string): Promise<any | null>;
  upsertPayment(bookingId: string, data: any): Promise<Payment>;
  updatePayment(paymentId: string, data: any): Promise<Payment>;
  lockPaymentRow(paymentId: string): Promise<{ id: string; status_id: string } | null>;
  findPaymentsByClientId(clientId: string, skip: number, take: number): Promise<any[]>;
  countPaymentsByClientId(clientId: string): Promise<number>;

  // Status
  findStatusByContext(context: string): Promise<Status | null>;
  findOrCreateStatus(context: string): Promise<Status>;

  // Payout
  findPayoutBookingByBookingId(bookingId: string): Promise<PayoutBooking | null>;
  createPayoutWithBooking(data: { businessId: string; amount: number; statusId: string; bookingId: string }): Promise<void>;
  findBusinessPayouts(businessId: string, skip: number, take: number): Promise<PayoutWithRelations[]>;
  countBusinessPayouts(businessId: string): Promise<number>;

  // Notification
  findOrCreateNotificationType(code: string, label: string): Promise<NotificationType>;
  createNotification(data: any): Promise<void>;

  // Loyalty
  getClientPointsBalance(clientId: string): Promise<number>;
  getLoyaltyConfig(): Promise<LoyaltyConfig | null>;
  createLoyaltyTransaction(data: any): Promise<LoyaltyTransaction>;

  // Settings
  getSettings(): Promise<Setting | null>;
  findPaymentMethod(name: string): Promise<PaymentMethod | null>;
  findOrCreatePaymentMethod(name: string): Promise<PaymentMethod>;

  // Business & Client
  findBusinessByIdAndManager(businessId: string, managerId: string): Promise<Business | null>;
  findClientByUserId(userId: string): Promise<Client | null>;
  
  // Dispute
  createDispute(data: any): Promise<any>;
}
