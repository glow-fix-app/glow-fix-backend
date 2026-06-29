export interface IBusinessRepository {
  findById(businessId: string): Promise<any>;
  findByManagerId(managerId: string): Promise<any>;
  findAllApproved(page: number, limit: number, search?: string): Promise<[any[], number]>;
  findAll(status?: string, page?: number, limit?: number): Promise<[any[], number]>;
  findNearby(lat: number, lng: number, radiusKm: number, page: number, limit: number): Promise<[any[], number]>;
  findWithDetails(businessId: string): Promise<any>;
  update(businessId: string, data: any): Promise<any>;
  delete(businessId: string): Promise<void>;
  findOperatingHours(businessId: string): Promise<any[]>;
  upsertOperatingHours(businessId: string, hours: any[]): Promise<void>;
  findDocuments(businessId: string): Promise<any[]>;
  createDocument(businessId: string, data: any): Promise<any>;
  deleteDocument(documentId: string): Promise<void>;
  findDocument(documentId: string): Promise<any>;
  updateDocumentStatus(documentId: string, statusContext: string): Promise<any>;
}
