const fs = require('fs');
const { Project, SyntaxKind } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/vehicles/vehicles.service.ts');
const serviceClass = sourceFile.getClass('VehiclesService');

let repoCode = `import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IVehicleRepository } from './interfaces/vehicle-repository.interface';

@Injectable()
export class VehiclesRepository implements IVehicleRepository {
  private readonly logger = new Logger(VehiclesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async getClientIdFromUserId(userId: string): Promise<string | null> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      select: { id: true },
    });
    return client ? client.id : null;
  }

  async findVehicleByLicensePlate(clientId: string, licensePlate: string, excludeVehicleId?: string): Promise<any> {
    const where: any = { clientId, licensePlate: licensePlate.toUpperCase() };
    if (excludeVehicleId) {
      where.id = { not: excludeVehicleId };
    }
    return this.prisma.clientVehicle.findFirst({ where });
  }

  async createVehicle(data: any): Promise<any> {
    return this.prisma.clientVehicle.create({ data });
  }

  async findVehiclesByClient(clientId: string): Promise<any[]> {
    return this.prisma.clientVehicle.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findVehicleByIdAndClient(vehicleId: string, clientId: string): Promise<any> {
    return this.prisma.clientVehicle.findFirst({
      where: { id: vehicleId, clientId },
    });
  }

  async findVehicleById(vehicleId: string): Promise<any> {
    return this.prisma.clientVehicle.findUnique({
      where: { id: vehicleId },
      include: {
        client: {
          include: {
            user: { select: { fullName: true, email: true, phone: true } }
          }
        }
      }
    });
  }

  async updateVehicle(vehicleId: string, data: any): Promise<any> {
    return this.prisma.clientVehicle.update({
      where: { id: vehicleId },
      data,
    });
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    await this.prisma.clientVehicle.delete({
      where: { id: vehicleId },
    });
  }

  async countBookingsByVehicle(vehicleId: string): Promise<number> {
    return this.prisma.booking.count({
      where: { vehicleId },
    });
  }

  // Extracts getVehicleStats logic
  ${serviceClass.getMethod('getVehicleStats').getText()}

  async getVehicleBookingHistory(vehicleId: string, skip: number, take: number, status?: string): Promise<[any[], number]> {
    const where: any = { vehicleId };
    if (status) {
      where.statusHistory = {
        some: { status: { context: status } },
      };
    }

    return Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          business: { select: { businessName: true } },
          statusHistory: { include: { status: true }, orderBy: { createdAt: 'desc' }, take: 1 },
          payment: { include: { status: true } },
          review: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.booking.count({ where }),
    ]);
  }

  async getUpcomingBookings(vehicleId: string, limit: number): Promise<any[]> {
    const now = new Date();
    return this.prisma.booking.findMany({
      where: { vehicleId, scheduledAt: { gt: now } },
      include: {
        business: { select: { businessName: true } },
        statusHistory: { include: { status: true }, orderBy: { createdAt: 'desc' }, take: 1 },
        payment: { include: { status: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: limit,
    });
  }

  async getAllVehicles(where: any, orderBy: any, skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
      this.prisma.clientVehicle.findMany({
        where,
        include: {
          client: {
            include: { user: { select: { fullName: true, email: true, phone: true } } }
          }
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.clientVehicle.count({ where }),
    ]);
  }

  async getVehicleByIdAdmin(vehicleId: string): Promise<any> {
    return this.findVehicleById(vehicleId);
  }

  async getVehiclesByClientPaginated(clientId: string, skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
      this.prisma.clientVehicle.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.clientVehicle.count({ where: { clientId } }),
    ]);
  }

  // Extracts getMostUsedVehicles
  ${serviceClass.getMethod('getMostUsedVehicles').getText()}

  async countFutureBookings(vehicleId: string): Promise<number> {
    return this.prisma.booking.count({
      where: {
        vehicleId,
        scheduledAt: { gt: new Date() },
        statusHistory: {
          none: { status: { context: 'CANCELLED' } },
        },
      },
    });
  }
}
`;

fs.writeFileSync('server/src/modules/vehicles/vehicles.repository.ts', repoCode);
