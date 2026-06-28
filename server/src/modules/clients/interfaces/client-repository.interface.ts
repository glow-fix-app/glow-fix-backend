import { Prisma, Client, User, Booking, LoyaltyTransaction, ClientVehicle, OperatingHour, Status } from '@prisma/client';

export type ClientWithUser = Client & {
    user: {
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
};

export type BookingWithPaymentAndStatus = Booking & {
    statusHistory: Array<{
        status: Status;
    }>;
    payment: {
        status: Status | null;
    } | null;
};

export type LoyaltyTransactionWithBooking = LoyaltyTransaction & {
    booking: {
        id: string;
        business: {
            businessName: string;
        } | null;
    } | null;
};

export interface INearbyBusinessRaw {
    id: string;
    business_name: string;
    address: string;
    contact_phone: string | null;
    distance_km: string;
    average_rating: string;
    total_reviews: string;
}

export interface IClientRepository {
    findClientByUserId(userId: string): Promise<Client | null>;
    findClientByUserIdWithUser(userId: string): Promise<ClientWithUser | null>;
    findUserById(userId: string): Promise<{ createdAt: Date; updatedAt: Date } | null>;
    
    updateClientLocation(userId: string, latitude: number, longitude: number, city: string | null): Promise<void>;
    getClientLocation(userId: string): Promise<{ latitude: number | null; longitude: number | null } | null>;
    
    getClientBookingsWithPaymentAndStatus(clientId: string): Promise<BookingWithPaymentAndStatus[]>;
    
    getLoyaltyPointsBalance(clientId: string): Promise<number>;
    getRecentLoyaltyTransactions(clientId: string, take: number): Promise<LoyaltyTransactionWithBooking[]>;
    
    countClientVehicles(clientId: string): Promise<number>;
    getClientVehicles(clientId: string): Promise<ClientVehicle[]>;
    
    getApprovedBusinessStatusId(): Promise<string | null>;
    getNearbyBusinesses(latitude: number, longitude: number, radiusMeters: number, limit: number, skip: number, approvedStatusId: string): Promise<INearbyBusinessRaw[]>;
    countNearbyBusinesses(latitude: number, longitude: number, radiusMeters: number, approvedStatusId: string): Promise<number>;
    
    getBusinessOperatingHours(businessId: string, dayOfWeek: number): Promise<OperatingHour | null>;
}
