export interface IAdminRepository {
  getDashboardStats(): Promise<any>;
  getRevenueStats(period?: "daily" | "weekly" | "monthly" | "yearly", months?: number): Promise<any>;
  getTopPerformers(limit: number): Promise<any>;
  getPlatformHealth(): Promise<any>;
  
  // Users
  getAllUsers(params: any): Promise<any>;
  getUserById(userId: string): Promise<any>;
  createUser(data: any): Promise<any>;
  updateUser(userId: string, data: any): Promise<any>;
  deleteUser(userId: string): Promise<any>;
  
  // Businesses
  getAllBusinesses(params: any): Promise<any>;
  getBusinessById(businessId: string): Promise<any>;
  updateBusiness(businessId: string, data: any): Promise<any>;
  getBusinessBookings(businessId: string, page: number, limit: number): Promise<any>;
  getBusinessReviews(businessId: string, page: number, limit: number): Promise<any>;
  approveBusiness(businessId: string, dto: any): Promise<any>;
  rejectBusiness(businessId: string, dto: any): Promise<any>;
  
  // Settings
  getSettings(): Promise<any>;
  updateSettings(data: any): Promise<any>;
  
  // Documents
  approveDocument(businessId: string, documentId: string): Promise<any>;
  rejectDocument(businessId: string, documentId: string, reason?: string): Promise<any>;
  
  // Payments & Payouts
  getAllPayments(query: any): Promise<any>;
  getAllPayouts(query: any): Promise<any>;
  processPayout(payoutId: string, dto: any): Promise<any>;
  
  // Reviews
  getAllReviews(query: any): Promise<any>;
}
