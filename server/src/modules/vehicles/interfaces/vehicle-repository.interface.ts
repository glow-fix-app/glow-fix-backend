export interface IVehicleRepository {
  getClientIdFromUserId(userId: string): Promise<string | null>;
  findVehicleByLicensePlate(clientId: string, licensePlate: string, excludeVehicleId?: string): Promise<any>;
  createVehicle(data: any): Promise<any>;
  findVehiclesByClient(clientId: string): Promise<any[]>;
  findVehicleByIdAndClient(vehicleId: string, clientId: string): Promise<any>;
  findVehicleById(vehicleId: string): Promise<any>;
  updateVehicle(vehicleId: string, data: any): Promise<any>;
  deleteVehicle(vehicleId: string): Promise<void>;
  countBookingsByVehicle(vehicleId: string): Promise<number>;
  getVehicleStats(vehicleId: string): Promise<any>;
  getVehicleBookingHistory(vehicleId: string, skip: number, take: number, status?: string): Promise<[any[], number]>;
  getUpcomingBookings(vehicleId: string, limit: number): Promise<any[]>;
  getAllVehicles(where: any, orderBy: any, skip: number, take: number): Promise<[any[], number]>;
  getVehicleByIdAdmin(vehicleId: string): Promise<any>;
  getVehiclesByClientPaginated(clientId: string, skip: number, take: number): Promise<[any[], number]>;
  getMostUsedVehicles(limit: number): Promise<any[]>;
  countFutureBookings(vehicleId: string): Promise<number>;
}
