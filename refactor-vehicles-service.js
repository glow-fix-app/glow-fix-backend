const fs = require('fs');

let service = fs.readFileSync('server/src/modules/vehicles/vehicles.service.ts', 'utf-8');

// Replace constructor and imports
service = service.replace(
  "import { PrismaService } from '../../core/prisma/prisma.service';",
  "import { VehiclesRepository } from './vehicles.repository';"
);

service = service.replace(
  "private readonly prisma: PrismaService,",
  "private readonly repository: VehiclesRepository,"
);

// Method getClientIdFromUserId
service = service.replace(
  /const client = await this\.prisma\.client\.findUnique\(\{\s+where: \{ userId \},\s+select: \{ id: true \},\s+\}\);/s,
  "const clientId = await this.repository.getClientIdFromUserId(userId);\n    const client = clientId ? { id: clientId } : null;"
);

// Method createVehicle
service = service.replace(
  /const existingVehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+clientId,\s+licensePlate: dto\.license_plate\.toUpperCase\(\),\s+\},\s+\}\);/s,
  "const existingVehicle = await this.repository.findVehicleByLicensePlate(clientId, dto.license_plate);"
);
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.create\(\{\s+data: \{\s+clientId,\s+licensePlate: dto\.license_plate\.toUpperCase\(\),\s+model: dto\.model,\s+year: dto\.year,\s+color: dto\.color,\s+\},\s+\}\);/s,
  "const vehicle = await this.repository.createVehicle({\n      clientId,\n      licensePlate: dto.license_plate.toUpperCase(),\n      model: dto.model,\n      year: dto.year,\n      color: dto.color,\n    });"
);

// Method getUserVehicles
service = service.replace(
  /const vehicles = await this\.prisma\.clientVehicle\.findMany\(\{\s+where: \{ clientId \},\s+orderBy: \{ createdAt: 'desc' \},\s+\}\);/s,
  "const vehicles = await this.repository.findVehiclesByClient(clientId);"
);

// Method getVehicle
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+id: vehicleId,\s+clientId,\s+\},\s+\}\);/s,
  "const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);"
);

// Method updateVehicle
service = service.replace(
  /const existingVehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+id: vehicleId,\s+clientId,\s+\},\s+\}\);/s,
  "const existingVehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);"
);
service = service.replace(
  /const duplicate = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+clientId,\s+licensePlate: dto\.license_plate\.toUpperCase\(\),\s+id: \{ not: vehicleId \},\s+\},\s+\}\);/s,
  "const duplicate = await this.repository.findVehicleByLicensePlate(clientId, dto.license_plate, vehicleId);"
);
service = service.replace(
  /const updatedVehicle = await this\.prisma\.clientVehicle\.update\(\{\s+where: \{ id: vehicleId \},\s+data: \{\s+licensePlate: dto\.license_plate\?\.toUpperCase\(\),\s+model: dto\.model,\s+year: dto\.year,\s+color: dto\.color,\s+\},\s+\}\);/s,
  "const updatedVehicle = await this.repository.updateVehicle(vehicleId, {\n      licensePlate: dto.license_plate?.toUpperCase(),\n      model: dto.model,\n      year: dto.year,\n      color: dto.color,\n    });"
);

// Method deleteVehicle
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+id: vehicleId,\s+clientId,\s+\},\s+\}\);/s,
  "const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);"
);
service = service.replace(
  /const bookingsCount = await this\.prisma\.booking\.count\(\{\s+where: \{ vehicleId \},\s+\}\);/s,
  "const bookingsCount = await this.repository.countBookingsByVehicle(vehicleId);"
);
service = service.replace(
  /await this\.prisma\.clientVehicle\.delete\(\{\s+where: \{ id: vehicleId \},\s+\}\);/s,
  "await this.repository.deleteVehicle(vehicleId);"
);

// Method getVehicleStats
service = service.replace(
  /const bookings = await this\.prisma\.booking\.findMany\(.*?\);/s,
  "// Removed raw prisma query and replaced with repository call\n    // This method gets bypassed as we move getVehicleStats logic to repository"
);

// Replace the ENTIRE getVehicleStats method implementation to just call repo:
service = service.replace(
  /async getVehicleStats\(vehicleId: string\): Promise<\{.*?\}> \{.*?\n  \}/s,
  "async getVehicleStats(vehicleId: string) {\n    return this.repository.getVehicleStats(vehicleId);\n  }"
);


// Method getVehicleBookingHistory
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+id: vehicleId,\s+clientId,\s+\},\s+\}\);/s,
  "const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);"
);
service = service.replace(
  /const \[(bookings, total|total, bookings)\] = await Promise\.all\(\[\n\s+this\.prisma\.booking\.findMany\(.*?take,\n\s+\}\),\n\s+this\.prisma\.booking\.count\(\{ where \}\),\n\s+\]\);/s,
  "const [bookings, total] = await this.repository.getVehicleBookingHistory(vehicleId, skip, take, status);"
);

// Method getUpcomingBookings
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findFirst\(\{\s+where: \{\s+id: vehicleId,\s+clientId,\s+\},\s+\}\);/s,
  "const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);"
);
service = service.replace(
  /const bookings = await this\.prisma\.booking\.findMany\(\{.*?\n\s+take: limit,\n\s+\}\);/s,
  "const bookings = await this.repository.getUpcomingBookings(vehicleId, limit);"
);

// Method getAllVehicles
service = service.replace(
  /const \[(vehicles, total)\] = await Promise\.all\(\[\n\s+this\.prisma\.clientVehicle\.findMany\(\{.*?\n\s+take,\n\s+\}\),\n\s+this\.prisma\.clientVehicle\.count\(\{ where \}\),\n\s+\]\);/s,
  "const [vehicles, total] = await this.repository.getAllVehicles(where, { [orderField]: sort_order }, skip, take);"
);

// Method getVehicleByIdAdmin
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findUnique\(\{.*?\} \}\},\n\s+\}\);/s,
  "const vehicle = await this.repository.getVehicleByIdAdmin(vehicleId);"
);

// Method getVehiclesByClient
service = service.replace(
  /const \[(vehicles, total)\] = await Promise\.all\(\[\n\s+this\.prisma\.clientVehicle\.findMany\(\{.*?\n\s+take,\n\s+\}\),\n\s+this\.prisma\.clientVehicle\.count\(\{ where: \{ clientId \} \}\),\n\s+\]\);/s,
  "const [vehicles, total] = await this.repository.getVehiclesByClientPaginated(clientId, skip, take);"
);

// Method getMostUsedVehicles
service = service.replace(
  /const results = await this\.prisma\.\$queryRaw<any\[\]>`.*?`;\n\n    return results;/s,
  "return this.repository.getMostUsedVehicles(limit);"
);

// Method archiveVehicle
service = service.replace(
  /const vehicle = await this\.prisma\.clientVehicle\.findUnique\(\{\s+where: \{ id: vehicleId \},\s+\}\);/s,
  "const vehicle = await this.repository.findVehicleById(vehicleId);"
);
service = service.replace(
  /const futureBookings = await this\.prisma\.booking\.count\(\{.*?\}\);/s,
  "const futureBookings = await this.repository.countFutureBookings(vehicleId);"
);
service = service.replace(
  /await this\.prisma\.clientVehicle\.delete\(\{\s+where: \{ id: vehicleId \},\s+\}\);/s,
  "await this.repository.deleteVehicle(vehicleId);"
);

fs.writeFileSync('server/src/modules/vehicles/vehicles.service.ts', service);
