import { BaseEntity } from '../common/index';
export interface FleetAccount extends BaseEntity {
    companyName: string;
    billingEmail: string;
    paymentTerms: 'net-15' | 'net-30' | 'net-60';
    creditLimit: number;
    vehicleIds: string[];
    managerIds: string[];
    isActive: boolean;
}
export interface FleetDriver {
    userId: string;
    assignedVehicleIds: string[];
    spendingLimit: number;
}
export interface FleetInvoice extends BaseEntity {
    fleetAccountId: string;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    bookingIds: string[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
    dueDate: Date;
    pdfUrl: string | null;
    paidAt: Date | null;
}
