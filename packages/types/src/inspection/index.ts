import { BaseEntity } from '../common/index';

export interface Inspection extends BaseEntity {
  bookingId: string;
  staffId: string;
  customerId: string;
  vehicleId: string;
  inspectionTime: Date;
  issues: InspectionIssue[];
  customerAcknowledged: boolean;
  customerSignature: string | null;
  pdfUrl: string | null;
}

export interface InspectionIssue {
  type: string;
  location: string;
  description: string;
  photoUrl: string;
  severity: 'minor' | 'moderate' | 'severe';
}

export interface CreateInspectionRequest {
  bookingId: string;
  issues: Omit<InspectionIssue, 'photoUrl'>[];
}