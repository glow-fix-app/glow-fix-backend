import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageService } from '../../core/storage/storage.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateBusinessStatusDto, BusinessStatus } from './dto/business-status.dto';
import { UploadBusinessDocumentDto, UpdateDocumentStatusDto, DocumentStatus } from './dto/business-document.dto';
import { BusinessResponseDto, BusinessStatsDto, NearbyBusinessDto } from './dto/business-response.dto';

@Injectable()
export class BusinessesService {
  private readonly logger = new Logger(BusinessesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storage: StorageService,
  ) {}

  // ==================== BUSINESS CRUD ====================

  async createBusiness(
    managerId: string,
    dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const existingBusiness = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (existingBusiness) {
      throw new ConflictException('You already have a registered business');
    }

    const businesses = await this.prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${managerId}::uuid,
        ${dto.business_name},
        ${dto.address},
        ST_SetSRID(ST_MakePoint(${dto.location.longitude}, ${dto.location.latitude}), 4326)::geography,
        ${dto.contact_phone},
        ${dto.contact_email},
        NOW(),
        NOW()
      )
      RETURNING id
    `;

    const businessId = businesses[0]?.id;
    if (!businessId) {
      throw new Error('Failed to create business');
    }

    if (dto.operating_hours && dto.operating_hours.length > 0) {
      await this.createOperatingHours(businessId, dto.operating_hours);
    }

    let pendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PENDING_REVIEW' },
    });

    if (!pendingStatus) {
      pendingStatus = await this.prisma.status.create({
        data: { context: 'PENDING_REVIEW' },
      });
    }

    await this.prisma.businessStatus.create({
      data: {
        businessId,
        statusId: pendingStatus.id,
      },
    });

    this.logger.log(`Business created: ${businessId} by manager ${managerId}`);

    this.eventEmitter.emit('business.created', {
      businessId,
      managerId,
      businessName: dto.business_name,
    });

    return this.getBusinessWithDetails(businessId);
  }

  async getBusinessWithDetails(businessId: string): Promise<BusinessResponseDto> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
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
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        documents: {
          include: { status: true },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const coords = await this.getBusinessLocation(businessId);
    const currentStatus = business.statusHistory[0]?.status?.context || 'PENDING_REVIEW';

    return {
      id: business.id,
      manager_id: business.managerId,
      manager_name: business.manager.fullName,
      business_name: business.businessName,
      address: business.address,
      latitude: coords.latitude,
      longitude: coords.longitude,
      contact_phone: business.contactPhone || undefined,
      contact_email: business.contactEmail || undefined,
      current_status: currentStatus,
      operating_hours: business.operatingHours,
      documents: business.documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        url: doc.url,
        status: doc.status?.context || 'PENDING',
        created_at: doc.createdAt,
      })),
      created_at: business.createdAt,
      updated_at: business.updatedAt,
    };
  }

  async getMyBusiness(managerId: string): Promise<BusinessResponseDto> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (!business) {
      throw new NotFoundException('You do not have a registered business');
    }

    return this.getBusinessWithDetails(business.id);
  }

  async updateBusiness(
    managerId: string,
    businessId: string,
    dto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const sets: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (dto.business_name) {
      sets.push(`business_name = $${paramIndex++}`);
      params.push(dto.business_name);
    }
    if (dto.address) {
      sets.push(`address = $${paramIndex++}`);
      params.push(dto.address);
    }
    if (dto.contact_phone) {
      sets.push(`contact_phone = $${paramIndex++}`);
      params.push(dto.contact_phone);
    }
    if (dto.contact_email) {
      sets.push(`contact_email = $${paramIndex++}`);
      params.push(dto.contact_email);
    }
    if (dto.location) {
      sets.push(`location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)::geography`);
      params.push(dto.location.longitude, dto.location.latitude);
    }

    if (sets.length > 0) {
      sets.push(`updated_at = NOW()`);
      params.push(businessId);
      await this.prisma.$executeRawUnsafe(
        `UPDATE businesses SET ${sets.join(', ')} WHERE id = $${paramIndex}`,
        ...params,
      );
    }

    if (dto.operating_hours) {
      await this.updateOperatingHours(businessId, dto.operating_hours);
    }

    this.logger.log(`Business updated: ${businessId} by manager ${managerId}`);

    this.eventEmitter.emit('business.updated', {
      businessId,
      managerId,
      updates: Object.keys(dto),
    });

    return this.getBusinessWithDetails(businessId);
  }

  async deleteBusiness(managerId: string, businessId: string): Promise<{ success: boolean; message: string }> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const bookingsCount = await this.prisma.booking.count({
      where: { businessId },
    });

    if (bookingsCount > 0) {
      throw new BadRequestException(
        `Cannot delete business with ${bookingsCount} existing booking(s). Contact support to close your business.`,
      );
    }

    await this.updateBusinessStatus(businessId, {
      status: BusinessStatus.SUSPENDED,
      rejection_reason: 'Business closed by owner',
    });

    this.logger.log(`Business deleted (suspended): ${businessId} by manager ${managerId}`);

    this.eventEmitter.emit('business.deleted', {
      businessId,
      managerId,
    });

    return {
      success: true,
      message: 'Business closed successfully',
    };
  }

  // ==================== BUSINESS STATUS ====================

  async updateBusinessStatus(
    businessId: string,
    dto: UpdateBusinessStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    let status = await this.prisma.status.findFirst({
      where: { context: dto.status },
    });

    if (!status) {
      status = await this.prisma.status.create({
        data: { context: dto.status },
      });
    }

    await this.prisma.businessStatus.create({
      data: {
        businessId,
        statusId: status.id,
      },
    });

    if (dto.rejection_reason && dto.status === BusinessStatus.REJECTED) {
      await this.prisma.rejectionReason.create({
        data: {
          entityType: 'BUSINESS',
          entityId: businessId,
          reasonText: dto.rejection_reason,
        },
      });
    }

    this.logger.log(`Business status updated: ${businessId} -> ${dto.status}`);

    this.eventEmitter.emit('business.status_changed', {
      businessId,
      newStatus: dto.status,
      reason: dto.rejection_reason,
    });

    return {
      success: true,
      message: `Business status updated to ${dto.status}`,
    };
  }

  // ==================== OPERATING HOURS ====================

  private async createOperatingHours(businessId: string, hours: any[]): Promise<void> {
    for (const hour of hours) {
      await this.prisma.operatingHour.create({
        data: {
          businessId,
          dayOfWeek: hour.day_of_week,
          openTime: hour.is_closed ? null : hour.open_time,
          closeTime: hour.is_closed ? null : hour.close_time,
        },
      });
    }
  }

  async updateOperatingHours(
    businessId: string,
    hours: any[],
  ): Promise<{ success: boolean; message: string }> {
    await this.prisma.operatingHour.deleteMany({
      where: { businessId },
    });

    for (const hour of hours) {
      await this.prisma.operatingHour.create({
        data: {
          businessId,
          dayOfWeek: hour.day_of_week,
          openTime: hour.is_closed ? null : hour.open_time,
          closeTime: hour.is_closed ? null : hour.close_time,
        },
      });
    }

    this.logger.log(`Operating hours updated for business ${businessId}`);

    return {
      success: true,
      message: 'Operating hours updated successfully',
    };
  }

  async getOperatingHours(businessId: string): Promise<any[]> {
    return this.prisma.operatingHour.findMany({
      where: { businessId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async isBusinessOpen(businessId: string, dateTime: Date): Promise<boolean> {
    const dayOfWeek = dateTime.getDay();
    const timeStr = dateTime.toTimeString().slice(0, 5);

    const hours = await this.prisma.operatingHour.findFirst({
      where: {
        businessId,
        dayOfWeek,
      },
    });

    if (!hours || !hours.openTime || !hours.closeTime) {
      return false;
    }

    return timeStr >= hours.openTime && timeStr <= hours.closeTime;
  }

  // ==================== BUSINESS DOCUMENTS ====================

  async uploadDocument(
    managerId: string,
    businessId: string,
    file: { buffer: Buffer; mimetype: string; originalname: string },
    dto: UploadBusinessDocumentDto,
  ): Promise<any> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const existingDoc = await this.prisma.businessDocument.findFirst({
      where: {
        businessId,
        type: dto.type,
      },
    });

    if (existingDoc) {
      throw new ConflictException(`Document of type ${dto.type} already exists. Delete it first to upload a new one.`);
    }

    let pendingStatus = await this.prisma.status.findFirst({
      where: { context: 'PENDING' },
    });

    if (!pendingStatus) {
      pendingStatus = await this.prisma.status.create({
        data: { context: 'PENDING' },
      });
    }

    // Upload file to S3/Storage and get URL
    const { url: fileUrl } = await this.storage.uploadFile(
      file.buffer,
      `businesses/${businessId}/documents`,
      file.mimetype,
      file.originalname,
    );

    const document = await this.prisma.businessDocument.create({
      data: {
        businessId,
        type: dto.type,
        url: fileUrl,
        statusId: pendingStatus.id,
      },
      include: { status: true },
    });

    this.logger.log(`Document uploaded for business ${businessId}: ${dto.type}`);

    this.eventEmitter.emit('business.document_uploaded', {
      businessId,
      managerId,
      documentType: dto.type,
    });

    return {
      id: document.id,
      business_id: document.businessId,
      type: document.type,
      url: document.url,
      status: document.status.context,
      created_at: document.createdAt,
    };
  }

  async updateDocumentStatus(
    documentId: string,
    dto: UpdateDocumentStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    const document = await this.prisma.businessDocument.findUnique({
      where: { id: documentId },
      include: { business: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    let status = await this.prisma.status.findFirst({
      where: { context: dto.status },
    });

    if (!status) {
      status = await this.prisma.status.create({
        data: { context: dto.status },
      });
    }

    await this.prisma.businessDocument.update({
      where: { id: documentId },
      data: {
        statusId: status.id,
        updatedAt: new Date(),
      },
    });

    if (dto.rejection_reason && dto.status === DocumentStatus.REJECTED) {
      await this.prisma.rejectionReason.create({
        data: {
          entityType: 'BUSINESS_DOCUMENT',
          entityId: documentId,
          reasonText: dto.rejection_reason,
        },
      });
    }

    this.logger.log(`Document status updated: ${documentId} -> ${dto.status}`);

    return {
      success: true,
      message: `Document status updated to ${dto.status}`,
    };
  }

  async deleteDocument(
    managerId: string,
    businessId: string,
    documentId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const document = await this.prisma.businessDocument.findFirst({
      where: {
        id: documentId,
        businessId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.businessDocument.delete({
      where: { id: documentId },
    });

    this.logger.log(`Document deleted: ${documentId} from business ${businessId}`);

    return {
      success: true,
      message: 'Document deleted successfully',
    };
  }

  // ==================== BUSINESS STATISTICS ====================

  async getBusinessStats(businessId: string): Promise<BusinessStatsDto> {
    const bookings = await this.prisma.booking.findMany({
      where: { businessId },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        payment: true,
      },
    });

    let completedBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;
    let totalPlatformFees = 0;

    for (const booking of bookings) {
      const latestStatus = booking.statusHistory[0]?.status?.context || 'PENDING';

      if (latestStatus === 'COMPLETED') {
        completedBookings++;
        totalRevenue += Number(booking.totalPrice);
        totalPlatformFees += Number(booking.commission);
      } else if (latestStatus === 'CANCELLED') {
        cancelledBookings++;
      }
    }

    const reviews = await this.prisma.review.findMany({
      where: { booking: { businessId } },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const activeServices = await this.prisma.businessService.count({
      where: {
        businessId,
        isActive: true,
      },
    });

    return {
      total_bookings: bookings.length,
      completed_bookings: completedBookings,
      cancelled_bookings: cancelledBookings,
      total_revenue: totalRevenue,
      platform_fees: totalPlatformFees,
      net_revenue: totalRevenue - totalPlatformFees,
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length,
      active_services: activeServices,
    };
  }

  // ==================== PUBLIC DISCOVERY ENDPOINTS ====================

  async getApprovedBusinesses(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<{ data: any[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const where: any = {
      statusHistory: {
        some: {
          statusId: approvedStatus.id,
        },
      },
    };

    if (search) {
      where.businessName = { contains: search, mode: 'insensitive' };
    }

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          operatingHours: true,
          manager: {
            select: { fullName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.business.count({ where }),
    ]);

    const ids = businesses.map(b => b.id);
    const coordsMap = await this.getBusinessLocationsBatch(ids);

    return {
      data: businesses.map(b => {
        const coords = coordsMap.get(b.id) || { latitude: 0, longitude: 0 };
        return {
          id: b.id,
          business_name: b.businessName,
          address: b.address,
          latitude: coords.latitude,
          longitude: coords.longitude,
          contact_phone: b.contactPhone,
          manager_name: b.manager.fullName,
          operating_hours: b.operatingHours,
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNearbyBusinesses(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: NearbyBusinessDto[]; meta: any }> {
    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 50);
    const radiusMeters = radiusKm * 1000;

    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const results = await this.prisma.$queryRaw<Array<any>>`
      SELECT 
        b.id,
        b.business_name,
        b.address,
        b.contact_phone,
        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000)::numeric, 2) as distance_km,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_reviews
      FROM businesses b
      LEFT JOIN bookings bk ON b.id = bk.business_id
      LEFT JOIN reviews r ON bk.id = r.booking_id
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatus.id}
      )
      AND ST_DWithin(
        b.location, 
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${radiusMeters}
      )
      GROUP BY b.id
      ORDER BY distance_km
      LIMIT ${limitNum}
      OFFSET ${skip}
    `;

    const totalResult = await this.prisma.$queryRaw<Array<{ count: number }>>`
      SELECT COUNT(*)::int as count
      FROM businesses b
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatus.id}
      )
      AND ST_DWithin(
        b.location, 
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${radiusMeters}
      )
    `;

    const total = totalResult[0]?.count || 0;

    const now = new Date();
    const businessesWithOpenStatus = await Promise.all(
      results.map(async (b: any) => ({
        id: b.id,
        business_name: b.business_name,
        address: b.address,
        distance_km: parseFloat(b.distance_km),
        contact_phone: b.contact_phone,
        average_rating: Math.round(parseFloat(b.average_rating) * 10) / 10,
        total_reviews: parseInt(b.total_reviews, 10),
        is_open: await this.isBusinessOpen(b.id, now),
      })),
    );

    return {
      data: businessesWithOpenStatus,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== ADMIN ENDPOINTS ====================

  async getAllBusinesses(
    status?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    let where: any = {};

    if (status) {
      const statusRecord = await this.prisma.status.findFirst({
        where: { context: status },
      });

      if (statusRecord) {
        where.statusHistory = {
          some: { statusId: statusRecord.id },
        };
      }
    }

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          manager: {
            select: {
              fullName: true,
              email: true,
              phone: true,
            },
          },
          operatingHours: true,
          statusHistory: {
            include: { status: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      data: businesses.map(b => ({
        id: b.id,
        business_name: b.businessName,
        manager_name: b.manager.fullName,
        manager_email: b.manager.email,
        address: b.address,
        contact_phone: b.contactPhone,
        current_status: b.statusHistory[0]?.status?.context || 'PENDING_REVIEW',
        created_at: b.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ==================== PRIVATE HELPERS ====================

  private async verifyBusinessOwnership(managerId: string, businessId: string): Promise<void> {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        managerId,
      },
    });

    if (!business) {
      throw new ForbiddenException('You do not own this business');
    }
  }

  private async getBusinessLocation(businessId: string): Promise<{ latitude: number; longitude: number }> {
    const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number }>>`
      SELECT 
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM businesses
      WHERE id = ${businessId}
    `;
    return result[0] || { latitude: 0, longitude: 0 };
  }

  private async getBusinessLocationsBatch(ids: string[]): Promise<Map<string, { latitude: number; longitude: number }>> {
    if (ids.length === 0) return new Map();
    const results = await this.prisma.$queryRaw<Array<{ id: string; latitude: number; longitude: number }>>`
      SELECT 
        id,
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM businesses
      WHERE id = ANY(${ids})
    `;
    const map = new Map<string, { latitude: number; longitude: number }>();
    for (const row of results) {
      map.set(row.id, { latitude: row.latitude, longitude: row.longitude });
    }
    return map;
  }
}
