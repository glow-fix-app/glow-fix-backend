const fs = require('fs');
const { Project, SyntaxKind } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/vehicles/vehicles.service.ts');

const serviceClass = sourceFile.getClass('VehiclesService');

// Change constructor
const constructor = serviceClass.getConstructors()[0];
const prismaParam = constructor.getParameters().find(p => p.getName() === 'prisma');
if (prismaParam) {
  prismaParam.remove();
  constructor.insertParameter(0, {
    name: 'repository',
    isReadonly: true,
    scope: 'private',
    type: 'VehiclesRepository'
  });
}

// getClientIdFromUserId
serviceClass.getMethod('getClientIdFromUserId').setBodyText(`
    const clientId = await this.repository.getClientIdFromUserId(userId);
    if (!clientId) {
      throw new NotFoundException('Client profile not found');
    }
    return clientId;
`);

// createVehicle
serviceClass.getMethod('createVehicle').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);

    const existingVehicle = await this.repository.findVehicleByLicensePlate(clientId, dto.license_plate);

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this license plate already exists');
    }

    const vehicle = await this.repository.createVehicle({
      clientId,
      licensePlate: dto.license_plate.toUpperCase(),
      model: dto.model,
      year: dto.year,
      color: dto.color,
    });

    this.logger.log(\`Vehicle created for client \${clientId}: \${dto.license_plate}\`);

    this.eventEmitter.emit('vehicle.created', {
      userId,
      clientId,
      vehicleId: vehicle.id,
      licensePlate: dto.license_plate,
    });

    return this.mapToResponseDto(vehicle);
`);

// getUserVehicles
serviceClass.getMethod('getUserVehicles').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const vehicles = await this.repository.findVehiclesByClient(clientId);
    return vehicles.map(v => this.mapToResponseDto(v));
`);

// getVehicle
serviceClass.getMethod('getVehicle').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const stats = await this.getVehicleStats(vehicleId);

    return {
      ...this.mapToResponseDto(vehicle),
      ...stats,
    };
`);

// updateVehicle
serviceClass.getMethod('updateVehicle').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const existingVehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);

    if (!existingVehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.license_plate && dto.license_plate !== existingVehicle.licensePlate) {
      const duplicate = await this.repository.findVehicleByLicensePlate(clientId, dto.license_plate, vehicleId);
      if (duplicate) {
        throw new ConflictException('Vehicle with this license plate already exists');
      }
    }

    const updatedVehicle = await this.repository.updateVehicle(vehicleId, {
      licensePlate: dto.license_plate?.toUpperCase(),
      model: dto.model,
      year: dto.year,
      color: dto.color,
    });

    this.logger.log(\`Vehicle updated: \${vehicleId} for client \${clientId}\`);

    this.eventEmitter.emit('vehicle.updated', {
      userId,
      clientId,
      vehicleId,
      updates: Object.keys(dto),
    });

    return this.mapToResponseDto(updatedVehicle);
`);

// deleteVehicle
serviceClass.getMethod('deleteVehicle').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const bookingsCount = await this.repository.countBookingsByVehicle(vehicleId);

    if (bookingsCount > 0) {
      throw new BadRequestException(
        \`Cannot delete vehicle with \${bookingsCount} existing booking(s). Archive it instead.\`,
      );
    }

    await this.repository.deleteVehicle(vehicleId);

    this.logger.log(\`Vehicle deleted: \${vehicleId} for client \${clientId}\`);

    this.eventEmitter.emit('vehicle.deleted', {
      userId,
      clientId,
      vehicleId,
      licensePlate: vehicle.licensePlate,
    });

    return {
      success: true,
      message: 'Vehicle deleted successfully',
    };
`);

// getVehicleStats
serviceClass.getMethod('getVehicleStats').setBodyText(`
    return this.repository.getVehicleStats(vehicleId);
`);

// getVehicleBookingHistory
serviceClass.getMethod('getVehicleBookingHistory').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [bookings, total] = await this.repository.getVehicleBookingHistory(vehicleId, skip, take, status);

    const formattedBookings = bookings.map(booking => {
      const latestStatus = booking.statusHistory[0];
      const payment = booking.payment;
      const review = booking.review;

      return {
        id: booking.id,
        booking_code: \`BK-\${booking.id.slice(0, 8).toUpperCase()}\`,
        business_name: booking.business.businessName,
        scheduled_at: booking.scheduledAt,
        total_price: Number(booking.totalPrice),
        status: latestStatus?.status?.context || 'PENDING',
        payment_status: payment?.status?.context || 'PENDING',
        rating: review?.rating,
        created_at: booking.createdAt,
      };
    });

    return {
      data: formattedBookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        vehicle: {
          id: vehicle.id,
          license_plate: vehicle.licensePlate,
          model: vehicle.model,
        },
      },
    };
`);

// getUpcomingBookings
serviceClass.getMethod('getUpcomingBookings').setBodyText(`
    const clientId = await this.getClientIdFromUserId(userId);
    const vehicle = await this.repository.findVehicleByIdAndClient(vehicleId, clientId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const bookings = await this.repository.getUpcomingBookings(vehicleId, limit);

    return bookings.map(booking => {
      const latestStatus = booking.statusHistory[0];
      const payment = booking.payment;

      return {
        id: booking.id,
        booking_code: \`BK-\${booking.id.slice(0, 8).toUpperCase()}\`,
        business_name: booking.business.businessName,
        scheduled_at: booking.scheduledAt,
        total_price: Number(booking.totalPrice),
        status: latestStatus?.status?.context || 'PENDING',
        payment_status: payment?.status?.context || 'PENDING',
        created_at: booking.createdAt,
      };
    });
`);

// getAllVehicles
serviceClass.getMethod('getAllVehicles').setBodyText(`
    const {
      page = 1,
      limit = 20,
      search,
      year,
      color,
      sort_by = 'created_at',
      sort_order = 'desc',
      include_deleted = false,
    } = query;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const where: any = {};

    if (!include_deleted) {
      where.client = { user: { deletedAt: null, isActive: true } };
    }

    if (search) {
      where.OR = [
        { licensePlate: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { client: { user: { fullName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (year) {
      where.year = year;
    }

    if (color) {
      where.color = { contains: color, mode: 'insensitive' };
    }

    // Notice we import or handle SORT_FIELD_MAP internally here if needed. 
    // We can assume it is available in the module scope.
    const orderField = SORT_FIELD_MAP[sort_by] || sort_by;

    const [vehicles, total] = await this.repository.getAllVehicles(where, { [orderField]: sort_order }, skip, take);

    const vehiclesWithStats = await Promise.all(
      vehicles.map(async (vehicle) => {
        const stats = await this.getVehicleStats(vehicle.id);
        return {
          id: vehicle.id,
          client_id: vehicle.clientId,
          client_name: vehicle.client.user.fullName,
          client_email: vehicle.client.user.email,
          license_plate: vehicle.licensePlate,
          model: vehicle.model ?? undefined,
          year: vehicle.year ?? undefined,
          color: vehicle.color ?? undefined,
          created_at: vehicle.createdAt,
          updated_at: vehicle.updatedAt,
          ...stats,
        };
      }),
    );

    return {
      data: vehiclesWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
`);

// getVehicleByIdAdmin
serviceClass.getMethod('getVehicleByIdAdmin').setBodyText(`
    const vehicle = await this.repository.getVehicleByIdAdmin(vehicleId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const stats = await this.getVehicleStats(vehicleId);

    return {
      ...vehicle,
      client_name: vehicle.client.user.fullName,
      client_email: vehicle.client.user.email,
      ...stats,
    };
`);

// getVehiclesByClient
serviceClass.getMethod('getVehiclesByClient').setBodyText(`
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [vehicles, total] = await this.repository.getVehiclesByClientPaginated(clientId, skip, take);

    return {
      data: vehicles.map(v => this.mapToResponseDto(v)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
`);

// getMostUsedVehicles
serviceClass.getMethod('getMostUsedVehicles').setBodyText(`
    return this.repository.getMostUsedVehicles(limit);
`);

// archiveVehicle
serviceClass.getMethod('archiveVehicle').setBodyText(`
    const vehicle = await this.repository.findVehicleById(vehicleId);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const futureBookings = await this.repository.countFutureBookings(vehicleId);

    if (futureBookings > 0) {
      throw new BadRequestException(
        \`Cannot archive vehicle with \${futureBookings} future booking(s)\`,
      );
    }

    await this.repository.deleteVehicle(vehicleId);

    this.logger.log(\`Vehicle archived: \${vehicleId}\`);

    return {
      success: true,
      message: 'Vehicle archived successfully',
    };
`);

// Imports
sourceFile.addImportDeclaration({
  namedImports: ['VehiclesRepository'],
  moduleSpecifier: './vehicles.repository'
});

const prismaImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue().includes('prisma.service'));
if (prismaImport) {
  prismaImport.remove();
}

sourceFile.saveSync();
