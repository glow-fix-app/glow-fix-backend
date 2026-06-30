import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IBusinessRepository } from '../interfaces/business-repository.interface';

const BUSINESS_FULL_INCLUDE = {
  manager: {
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
    },
  },
  operatingHours: true,
  statusHistory: {
    include: { status: true },
    orderBy: { createdAt: 'asc' as const },
    take: 1,
  },
};

@Injectable()
export class BusinessesRepository implements IBusinessRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(businessId: string): Promise<any> {
    return this.prisma.business.findUnique({
      where: { id: businessId },
      include: BUSINESS_FULL_INCLUDE,
    });
  }

  async findByManagerId(managerId: string): Promise<any> {
    return this.prisma.business.findFirst({
      where: { managerId },
      include: BUSINESS_FULL_INCLUDE,
    });
  }

  async findWithDetails(businessId: string): Promise<any> {
    return this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        ...BUSINESS_FULL_INCLUDE,
        documents: true,
      },
    });
  }

  async findAllApproved(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[any[], number]> {
    const where: any = {};
    if (search) {
      where.businessName = { contains: search, mode: 'insensitive' };
    }
    const skip = (page - 1) * limit;

    return Promise.all([
      this.prisma.business.findMany({
        where,
        include: BUSINESS_FULL_INCLUDE,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);
  }

  async findAll(
    status?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<[any[], number]> {
    const skip = (page - 1) * limit;
    const where: any = status ? { statusHistory: { some: { status: { context: status } } } } : {};

    return Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          ...BUSINESS_FULL_INCLUDE,
          documents: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.business.count({ where }),
    ]);
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm: number,
    page: number,
    limit: number,
  ): Promise<[any[], number]> {
    const offset = (page - 1) * limit;
    const radiusMeters = radiusKm * 1000;

    const rows: any[] = await this.prisma.$queryRaw`
      SELECT b.id, b.business_name, b.address, b.city,
             ST_X(b.location::geometry) AS longitude,
             ST_Y(b.location::geometry) AS latitude,
             ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) AS distance_meters
      FROM businesses b
      WHERE ST_DWithin(
        b.location,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusMeters}
      )
      ORDER BY distance_meters ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult: any[] = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total
      FROM businesses b
      WHERE ST_DWithin(
        b.location,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusMeters}
      )
    `;

    return [rows, Number(countResult[0]?.total || 0)];
  }

  async update(businessId: string, data: any): Promise<any> {
    return this.prisma.business.update({
      where: { id: businessId },
      data,
      include: BUSINESS_FULL_INCLUDE,
    });
  }

  async delete(businessId: string): Promise<void> {
    await this.prisma.business.delete({ where: { id: businessId } });
  }

  async findOperatingHours(businessId: string): Promise<any[]> {
    return this.prisma.operatingHour.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async upsertOperatingHours(businessId: string, hours: any[]): Promise<void> {
    await this.prisma.$transaction(
      hours.map((h) =>
        this.prisma.operatingHour.upsert({
          where: { businessId_dayOfWeek: { businessId, dayOfWeek: h.dayOfWeek } },
          create: { businessId, dayOfWeek: h.dayOfWeek, openTime: h.openTime, closeTime: h.closeTime },
          update: { openTime: h.openTime, closeTime: h.closeTime },
        }),
      ),
    );
  }

  async findDocuments(businessId: string): Promise<any[]> {
    return this.prisma.businessDocument.findMany({ where: { businessId } });
  }

  async findDocument(documentId: string): Promise<any> {
    return this.prisma.businessDocument.findUnique({ where: { id: documentId } });
  }

  async createDocument(businessId: string, data: any): Promise<any> {
    return this.prisma.businessDocument.create({ data: { businessId, ...data } });
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.prisma.businessDocument.delete({ where: { id: documentId } });
  }

  async updateDocumentStatus(documentId: string, statusContext: string): Promise<any> {
    // status is a relation — find the Status row first then connect by ID
    const statusRow = await this.prisma.status.findFirstOrThrow({
      where: { context: statusContext },
    });
    return this.prisma.businessDocument.update({
      where: { id: documentId },
      data: { statusId: statusRow.id },
    });
  }
}
