import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { StorageService } from '../../core/storage/storage.service';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';

import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateOperatingHoursDto,
  UploadDocumentDto,
  AdminSetBusinessStatusDto,
  AdminSetDocumentStatusDto,
} from './dto';

// =====================================================================
// Constants
// =====================================================================

const REQUIRED_DOCUMENT_TYPES = [
  'BUSINESS_REGISTRATION',
  'INSURANCE_CERTIFICATE',
  'TAX_CARD',
];

const VALID_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// =====================================================================
// Interfaces
// =====================================================================

export interface OnboardingStatus {
  hasBusiness: boolean;
  businessStatus: string | null;
  requiredDocuments: string[];
  uploadedDocuments: string[];
  missingDocuments: string[];
  rejectedDocuments: string[];
  allRequiredDocumentsUploaded: boolean;
  allRequiredDocumentsApproved: boolean;
  hasOperatingHours: boolean;
  isReadyForReview: boolean;
  canGoLive: boolean;
}

export interface BusinessResponse {
  id: string;
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPhone: string | null;
  contactEmail: string | null;
  latestStatus: string | null;
  latestRejectionReason: string | null;
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
  }>;
  documents: Array<{
    id: string;
    type: string;
    url: string;
    status: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================================
// Service
// =====================================================================

@Injectable()
export class BusinessesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // ─── Status Helpers ────────────────────────────────────────────────────────

  /**
   * Get or create a status by context and name.
   * Used to reliably find the correct status ID for business/document operations.
   */
  async getStatusId(context: string, name: string): Promise<string> {
    const status = await this.prisma.status.findFirst({
      where: {
        context,
        name,
      },
    });

    if (!status) {
      throw new InternalServerErrorException(
        `Status not found: ${context}/${name}`,
      );
    }

    return status.id;
  }

  /**
   * Get the latest business status by querying business_status table,
   * ordered by createdAt DESC, and return the status name.
   */
  private async getLatestBusinessStatus(businessId: string): Promise<string | null> {
    const latest = await this.prisma.businessStatus.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      include: { status: true },
    });

    return latest?.status?.name ?? null;
  }

  private async loadBusinessCoordinates(
    businessId: string,
    tx?: any,
  ): Promise<{ latitude: number; longitude: number }> {
    const records = await (tx ?? this.prisma).$queryRaw<
      Array<{ latitude: number; longitude: number }>
    >`
      SELECT ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude
      FROM businesses
      WHERE id = ${businessId}::uuid
    `;

    const record = records[0];
    return {
      latitude: record?.latitude ?? 0,
      longitude: record?.longitude ?? 0,
    };
  }

  private async loadBusinessCoordinatesMap(
    businessIds: string[],
    tx?: any,
  ): Promise<Record<string, { latitude: number; longitude: number }>> {
    if (businessIds.length === 0) {
      return {};
    }

    const records = await (tx ?? this.prisma).$queryRaw<
      Array<{ id: string; latitude: number; longitude: number }>
    >`
      SELECT id, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude
      FROM businesses
      WHERE id = ANY(ARRAY[${Prisma.join(businessIds)}]::uuid[])
    `;

    return Object.fromEntries(
      records.map((record: { id: string; latitude: number; longitude: number }) => [record.id, {
        latitude: record.latitude,
        longitude: record.longitude,
      }]),
    );
  }

  private async attachCoordinatesToBusiness(business: Record<string, any>): Promise<Record<string, any>> {
    const coordinates = await this.loadBusinessCoordinates(business.id);
    return {
      ...business,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
  }

  private async attachCoordinatesToBusinesses(businesses: Record<string, any>[]): Promise<Record<string, any>[]> {
    const ids = businesses.map((business) => business.id);
    const coordinates = await this.loadBusinessCoordinatesMap(ids);

    return businesses.map((business) => ({
      ...business,
      latitude: coordinates[business.id]?.latitude ?? business.latitude,
      longitude: coordinates[business.id]?.longitude ?? business.longitude,
    }));
  }

  /**
   * Get the latest document status by businessId and type,
   * ordered by createdAt DESC.
   */
  private async getLatestDocumentStatus(businessId: string, type: string): Promise<string | null> {
    const latest = await this.prisma.businessDocument.findFirst({
      where: {
        businessId,
        type,
      },
      orderBy: { createdAt: 'desc' },
      include: { status: true },
    });

    return latest?.status?.name ?? null;
  }

  // ─── Business Management ───────────────────────────────────────────────────

  /**
   * Create a new business for a manager.
   * - Manager can only have one business
   * - Uses transaction for consistency
   * - Initializes with PENDING_REVIEW status
   */
  async createBusiness(
    managerId: string,
    dto: CreateBusinessDto,
  ): Promise<BusinessResponse> {
    // Check if manager already has a business
    const existingBusiness = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (existingBusiness) {
      throw new ConflictException(
        'This manager already has a business. Please update the existing business instead.',
      );
    }

    // Validate operating hours if provided
    if (dto.operatingHours && dto.operatingHours.length > 0) {
      this.validateOperatingHours(dto.operatingHours);
    }

    // Start transaction
    try {
      const business = await this.prisma.$transaction(async (tx: any) => {
        const { latitude, longitude, operatingHours, ...businessData } = dto;

        // Insert business with location at creation time using safe parameterized raw SQL
        const [inserted] = await tx.$queryRaw<Array<{ id: string }>>`
          INSERT INTO businesses (manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)
          VALUES (
            ${managerId}::uuid,
            ${businessData.businessName},
            ${businessData.address},
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
            ${businessData.contactPhone ?? null},
            ${businessData.contactEmail ?? null},
            NOW(),
            NOW()
          )
          RETURNING id
        `;

        const pendingReviewStatusId = await this.getStatusId(
          'BUSINESS',
          'PENDING_REVIEW',
        );

        await tx.businessStatus.create({
          data: {
            businessId: inserted.id,
            statusId: pendingReviewStatusId,
          },
        });

        if (operatingHours && operatingHours.length > 0) {
          await this.createOperatingHours(tx, inserted.id, operatingHours);
        }

        return { id: inserted.id, businessName: businessData.businessName };
      });

      const fullBusiness = await this.prisma.business.findUnique({
        where: { id: business.id },
        include: {
          operatingHours: {
            orderBy: { dayOfWeek: 'asc' },
          },
          documents: {
            orderBy: { createdAt: 'desc' },
            include: { status: true },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            include: { status: true },
            take: 1,
          },
        },
      });

      if (!fullBusiness) {
        throw new InternalServerErrorException('Failed to retrieve created business');
      }

      const businessWithCoordinates = await this.attachCoordinatesToBusiness(fullBusiness);

      this.logger.log('Business created', 'BusinessesService', {
        businessId: business.id,
        managerId,
        businessName: business.businessName,
      });

      return await this.formatBusinessResponseWithReason(businessWithCoordinates);
    } catch (error) {
      const trace = error instanceof Error ? error.stack || error.message : String(error);
      this.logger.error(
        'Failed to create business',
        trace,
        'BusinessesService',
        { managerId },
      );

      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create business');
    }
  }

  /**
   * Get the current manager's business profile.
   */
  async getMyBusiness(managerId: string): Promise<BusinessResponse> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
      include: {
        operatingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    const businessWithCoordinates = await this.attachCoordinatesToBusiness(business);
    return await this.formatBusinessResponseWithReason(businessWithCoordinates);
  }

  /**
   * Update manager's own business profile.
   * Does not change the business status — only updates business data.
   */
  async updateMyBusiness(
    managerId: string,
    dto: UpdateBusinessDto,
  ): Promise<BusinessResponse> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    const updatedBusiness = await this.prisma.$transaction(async (tx: any) => {
      const updateData: Prisma.BusinessUpdateInput = {};
      if (dto.businessName !== undefined) {
        updateData.businessName = dto.businessName;
      }
      if (dto.address !== undefined) {
        updateData.address = dto.address;
      }
      if (dto.contactPhone !== undefined) {
        updateData.contactPhone = dto.contactPhone;
      }
      if (dto.contactEmail !== undefined) {
        updateData.contactEmail = dto.contactEmail;
      }

      const updated = await tx.business.update({
        where: { id: business.id },
        data: updateData,
      });

      if (dto.latitude !== undefined || dto.longitude !== undefined) {
        let lat = dto.latitude;
        let lng = dto.longitude;

        // Load existing coordinates if not provided in DTO
        if (lat === undefined || lng === undefined) {
          const result = await tx.$queryRaw<
            { latitude: number; longitude: number }[]
          >`
            SELECT
              ST_Y(location::geometry) AS latitude,
              ST_X(location::geometry) AS longitude
            FROM businesses
            WHERE id = ${business.id}
          `;

          const existing = result[0];
          if (existing) {
            lat = lat ?? existing.latitude;
            lng = lng ?? existing.longitude;
          }
        }

        // Only update location if we have both coordinates
        if (lat !== undefined && lng !== undefined) {
          await tx.$queryRaw`
            UPDATE businesses
            SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
            WHERE id = ${business.id}
          `;
        }
      }

      return updated;
    });

    const fullBusiness = await this.prisma.business.findUnique({
      where: { id: business.id },
      include: {
        operatingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    if (!fullBusiness) {
      throw new NotFoundException('Business not found after update');
    }

    const businessWithCoordinates = await this.attachCoordinatesToBusiness(fullBusiness);

    this.logger.log('Business updated', 'BusinessesService', {
      businessId: updatedBusiness.id,
      managerId,
    });

    return await this.formatBusinessResponseWithReason(businessWithCoordinates);
  }

  /**
   * Verify that the given businessId belongs to the given managerId.
   * Useful for authorization checks.
   */
  async assertBusinessOwner(businessId: string, managerId: string): Promise<void> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { managerId: true },
    });

    if (!business || business.managerId !== managerId) {
      throw new ForbiddenException('You do not have access to this business.');
    }
  }

  // ─── Operating Hours ──────────────────────────────────────────────────────

  /**
   * Update manager's business operating hours.
   * Replaces the entire week's schedule.
   */
  async updateOperatingHours(
    managerId: string,
    dto: CreateOperatingHoursDto,
  ): Promise<Array<{ dayOfWeek: number; openTime: string | null; closeTime: string | null }>> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    // Validate input
    this.validateOperatingHours(dto.hours);

    // Replace operating hours in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Delete all existing hours
      await tx.operatingHour.deleteMany({
        where: { businessId: business.id },
      });

      // Create new hours
      const created = await Promise.all(
        dto.hours.map((hour) =>
          tx.operatingHour.create({
            data: {
              businessId: business.id,
              dayOfWeek: hour.dayOfWeek,
              openTime: hour.openTime ?? null,
              closeTime: hour.closeTime ?? null,
            },
          }),
        ),
      );

      return created.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    });

    this.logger.log('Operating hours updated', 'BusinessesService', {
      businessId: business.id,
      managerId,
    });

    return result;
  }

  /**
   * Get manager's business operating hours.
   */
  async getOperatingHours(managerId: string): Promise<Array<{
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
  }>> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
      include: {
        operatingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    return business.operatingHours;
  }

  // ─── Documents ────────────────────────────────────────────────────────────

  /**
   * Upload a document for manager's business.
   * File must be validated, stored, and entry created in DB.
   */
  async uploadDocument(
    managerId: string,
    file: Express.Multer.File,
    dto: UploadDocumentDto,
  ): Promise<{ id: string; type: string; url: string; status: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Get manager's business
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    // Validate file
    this.validateFile(file);

    // Check if document already exists for this type
    const existing = await this.prisma.businessDocument.findFirst({
      where: {
        businessId: business.id,
        type: dto.type,
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (existing) {
      throw new ConflictException(
        `A document of type ${dto.type} already exists. Please update the existing document or contact support for replacement.`,
      );
    }

    // Upload file to storage
    let uploadResult;
    try {
      uploadResult = await this.storage.uploadFile(
        file.buffer,
        'documents',
        file.mimetype,
        undefined,
      );
    } catch (error) {
      this.logger.error('File upload failed', String(error), 'BusinessesService', {
        businessId: business.id,
      });
      throw new InternalServerErrorException('Failed to upload document');
    }

    // Create document entry with PENDING status
    const pendingStatusId = await this.getStatusId('DOCUMENT', 'PENDING');

    const document = await this.prisma.businessDocument.create({
      data: {
        businessId: business.id,
        type: dto.type,
        url: uploadResult.url,
        statusId: pendingStatusId,
      },
      include: { status: true },
    });

    this.logger.log('Document uploaded', 'BusinessesService', {
      documentId: document.id,
      businessId: business.id,
      type: dto.type,
    });

    return {
      id: document.id,
      type: document.type,
      url: document.url,
      status: document.status.name,
    };
  }

  /**
   * Get documents for manager's business.
   */
  async getMyDocuments(managerId: string): Promise<Array<{
    id: string;
    type: string;
    url: string;
    status: string;
    createdAt: Date;
  }>> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
    });

    if (!business) {
      throw new NotFoundException('You do not have a business profile yet.');
    }

    const documents = await this.prisma.businessDocument.findMany({
      where: { businessId: business.id },
      include: { status: true },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      type: doc.type,
      url: doc.url,
      status: doc.status.name,
      createdAt: doc.createdAt,
    }));
  }

  /**
   * Delete a document (manager can only delete their own documents).
   */
  async deleteDocument(managerId: string, documentId: string): Promise<void> {
    const document = await this.prisma.businessDocument.findUnique({
      where: { id: documentId },
      include: { business: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.business.managerId !== managerId) {
      throw new ForbiddenException('You do not have access to this document');
    }

    await this.prisma.businessDocument.delete({
      where: { id: documentId },
    });

    // Attempt to delete from storage (non-blocking if fails)
    try {
      // TODO: storage cleanup is not possible without a dedicated storageKey field.
      // We only have a URL today, so we do not delete storage objects here.
      this.logger.log('Document deleted', 'BusinessesService', {
        documentId,
        businessId: document.businessId,
        storageCleanup: 'SKIPPED_NO_STORAGE_KEY',
      });
    } catch (error) {
      this.logger.error('Failed to delete from storage', String(error), 'BusinessesService', {
        documentId,
      });
    }
  }

  // ─── Onboarding Status ────────────────────────────────────────────────────

  /**
   * Get comprehensive onboarding status for a manager.
   */
  async getOnboardingStatus(managerId: string): Promise<OnboardingStatus> {
    const business = await this.prisma.business.findFirst({
      where: { managerId },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
        documents: {
          include: { status: true },
        },
        operatingHours: true,
      },
    });

    if (!business) {
      return {
        hasBusiness: false,
        businessStatus: null,
        requiredDocuments: REQUIRED_DOCUMENT_TYPES,
        uploadedDocuments: [],
        missingDocuments: REQUIRED_DOCUMENT_TYPES,
        rejectedDocuments: [],
        allRequiredDocumentsUploaded: false,
        allRequiredDocumentsApproved: false,
        hasOperatingHours: false,
        isReadyForReview: false,
        canGoLive: false,
      };
    }

    const businessStatus = business.statusHistory[0]?.status?.name ?? null;

    // Get latest document status per type
    const documentsByType = new Map<string, { status: string; createdAt: Date }>();
    for (const doc of business.documents) {
      const existing = documentsByType.get(doc.type);
      if (!existing || doc.createdAt > existing.createdAt) {
        documentsByType.set(doc.type, {
          status: doc.status.name,
          createdAt: doc.createdAt,
        });
      }
    }

    const uploadedDocuments = Array.from(documentsByType.keys());
    const missingDocuments = REQUIRED_DOCUMENT_TYPES.filter(
      (type) => !uploadedDocuments.includes(type),
    );

    const rejectedDocuments = Array.from(documentsByType.entries())
      .filter(([_, { status }]) => status === 'REJECTED')
      .map(([type]) => type);

    const approvedDocuments = Array.from(documentsByType.entries())
      .filter(([_, { status }]) => status === 'APPROVED')
      .map(([type]) => type);

    const hasOperatingHours = business.operatingHours.length > 0;
    const allRequiredDocumentsUploaded = missingDocuments.length === 0;
    const allRequiredDocumentsApproved =
      approvedDocuments.length === REQUIRED_DOCUMENT_TYPES.length;
    const isReadyForReview =
      allRequiredDocumentsUploaded && hasOperatingHours && businessStatus === 'PENDING_REVIEW';
    const canGoLive =
      businessStatus === 'APPROVED' && allRequiredDocumentsApproved;

    return {
      hasBusiness: true,
      businessStatus,
      requiredDocuments: REQUIRED_DOCUMENT_TYPES,
      uploadedDocuments,
      missingDocuments,
      rejectedDocuments,
      allRequiredDocumentsUploaded,
      allRequiredDocumentsApproved,
      hasOperatingHours,
      isReadyForReview,
      canGoLive,
    };
  }

  // ─── Admin Operations ─────────────────────────────────────────────────────

  /**
   * Get all businesses with optional status filter (admin only).
   */
  async getAllBusinessesForAdmin(
    statusFilter?: string,
  ): Promise<Array<BusinessResponse>> {
    // If statusFilter is provided, get businesses with that latest status
    if (statusFilter) {
      const targetStatus = await this.prisma.status.findFirst({
        where: {
          context: 'BUSINESS',
          name: statusFilter,
        },
      });

      if (!targetStatus) {
        return [];
      }

      const businessStatuses = await this.prisma.businessStatus.findMany({
        where: { statusId: targetStatus.id },
        include: {
          business: {
            include: {
              operatingHours: { orderBy: { dayOfWeek: 'asc' } },
              documents: {
                orderBy: { createdAt: 'desc' },
                include: { status: true },
              },
              statusHistory: {
                orderBy: { createdAt: 'desc' },
                include: { status: true },
                take: 1,
              },
            },
          },
        },
      });

      const uniqueBusinessesById = new Map<string, any>();
      for (const bs of businessStatuses) {
        uniqueBusinessesById.set(bs.business.id, bs.business);
      }

      const filtered = await Promise.all(
        Array.from(uniqueBusinessesById.values()).map(async (business) => {
          const latest = await this.getLatestBusinessStatus(business.id);
          return latest === statusFilter ? business : null;
        }),
      );

      const businesses = filtered.filter((b) => b !== null);
      const withCoordinates = await this.attachCoordinatesToBusinesses(businesses);
      return withCoordinates.map((b) => this.formatBusinessResponse(b));
    }

    const businesses = await this.prisma.business.findMany({
      include: {
        operatingHours: { orderBy: { dayOfWeek: 'asc' } },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    const businessesWithCoordinates = await this.attachCoordinatesToBusinesses(businesses);
    return businessesWithCoordinates.map((b) => this.formatBusinessResponse(b));
  }

  /**
   * List all approved businesses (public endpoint).
   */
  async listApprovedBusinesses(): Promise<Array<BusinessResponse>> {
    const approvedStatus = await this.prisma.status.findFirst({
      where: {
        context: 'BUSINESS',
        name: 'APPROVED',
      },
    });

    if (!approvedStatus) {
      return [];
    }

    const businesses = await this.prisma.business.findMany({
      include: {
        operatingHours: { orderBy: { dayOfWeek: 'asc' } },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    const approved = [];
    for (const b of businesses) {
      const latest = await this.getLatestBusinessStatus(b.id);
      if (latest === 'APPROVED') {
        approved.push(b);
      }
    }

    const withCoordinates = await this.attachCoordinatesToBusinesses(approved);
    return withCoordinates.map((b) => this.formatBusinessResponse(b));
  }

  /**
   * Get a specific approved business by ID (public endpoint).
   */
  async getApprovedBusiness(businessId: string): Promise<BusinessResponse> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        operatingHours: { orderBy: { dayOfWeek: 'asc' } },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const latestStatus = await this.getLatestBusinessStatus(businessId);
    if (latestStatus !== 'APPROVED') {
      throw new NotFoundException('Business not found or not approved');
    }

    const businessWithCoordinates = await this.attachCoordinatesToBusiness(business);
    return this.formatBusinessResponse(businessWithCoordinates);
  }

  /**
   * Set business status (admin only).
   */
  async setBusinessStatus(
    businessId: string,
    dto: AdminSetBusinessStatusDto,
  ): Promise<BusinessResponse> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Validate reason is provided for rejection/suspension
    if ((dto.status === 'REJECTED' || dto.status === 'SUSPENDED') && !dto.reason) {
      throw new BadRequestException(
        `Reason is required when ${dto.status.toLowerCase()}ing a business`,
      );
    }

    // Get status ID
    const statusId = await this.getStatusId('BUSINESS', dto.status);

    // Add status entry
    await this.prisma.businessStatus.create({
      data: {
        businessId,
        statusId,
      },
    });

    // Store rejection reason if applicable
    if (dto.reason) {
      await this.prisma.rejectionReason.create({
        data: {
          entityType: 'BUSINESS',
          entityId: businessId,
          reasonText: dto.reason,
        },
      });
    }

    this.logger.log('Business status changed', 'BusinessesService', {
      businessId,
      newStatus: dto.status,
      reason: dto.reason,
    });

    // Return updated business
    const updated = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        operatingHours: { orderBy: { dayOfWeek: 'asc' } },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    if (!updated) {
      throw new NotFoundException('Business not found');
    }

    return await this.formatBusinessResponseWithReason(updated);
  }

  /**
   * Set document status (admin only).
   */
  async setDocumentStatus(
    documentId: string,
    dto: AdminSetDocumentStatusDto,
  ): Promise<{ id: string; type: string; url: string; status: string }> {
    const document = await this.prisma.businessDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Validate reason is provided for rejection
    if (dto.status === 'REJECTED' && !dto.reason) {
      throw new BadRequestException('Reason is required when rejecting a document');
    }

    // Get status ID
    const statusId = await this.getStatusId('DOCUMENT', dto.status);

    // Update document status
    const updated = await this.prisma.businessDocument.update({
      where: { id: documentId },
      data: { statusId },
      include: { status: true },
    });

    // Store rejection reason if applicable
    if (dto.reason) {
      await this.prisma.rejectionReason.create({
        data: {
          entityType: 'BUSINESS_DOCUMENT',
          entityId: documentId,
          reasonText: dto.reason,
        },
      });
    }

    this.logger.log('Document status changed', 'BusinessesService', {
      documentId,
      newStatus: dto.status,
      reason: dto.reason,
    });

    return {
      id: updated.id,
      type: updated.type,
      url: updated.url,
      status: updated.status.name,
    };
  }

  // ─── Public Business Listing ──────────────────────────────────────────────

  /**
   * Get all APPROVED businesses for public listing.
   * Filters to only businesses whose LATEST status is APPROVED.
   */
  async getApprovedBusinessesForPublic(): Promise<Array<{
    id: string;
    businessName: string;
    address: string;
    latitude: number;
    longitude: number;
    contactPhone: string | null;
    contactEmail: string | null;
  }>> {
    const businesses = await this.prisma.business.findMany({
      include: {
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    const approved = businesses.filter(
      (b) => b.statusHistory[0]?.status?.name === 'APPROVED',
    );

    const businessesWithCoordinates = await this.attachCoordinatesToBusinesses(approved);

    return businessesWithCoordinates.map((b) => ({
      id: b.id,
      businessName: b.businessName,
      address: b.address,
      latitude: b.latitude,
      longitude: b.longitude,
      contactPhone: b.contactPhone,
      contactEmail: b.contactEmail,
    }));
  }

  /**
   * Get a specific approved business by ID.
   */
  async getApprovedBusinessById(businessId: string): Promise<{
    id: string;
    businessName: string;
    address: string;
    latitude: number;
    longitude: number;
    contactPhone: string | null;
    contactEmail: string | null;
  } | null> {
    const business: any = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: { status: true },
          take: 1,
        },
      },
    });

    if (!business || business.statusHistory[0]?.status?.name !== 'APPROVED') {
      return null;
    }

    const businessWithCoordinates = await this.attachCoordinatesToBusiness(business);

    return {
      id: businessWithCoordinates.id,
      businessName: businessWithCoordinates.businessName,
      address: businessWithCoordinates.address,
      latitude: businessWithCoordinates.latitude,
      longitude: businessWithCoordinates.longitude,
      contactPhone: businessWithCoordinates.contactPhone,
      contactEmail: businessWithCoordinates.contactEmail,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  /**
   * Validate operating hours input.
   */
  private validateOperatingHours(
    hours: Array<{ dayOfWeek: number; openTime?: string | null; closeTime?: string | null }>,
  ): void {
    if (!Array.isArray(hours)) {
      throw new BadRequestException('Hours must be an array');
    }

    if (hours.length === 0) {
      throw new BadRequestException('At least one operating hour is required');
    }

    const dayOfWeeks = new Set<number>();

    for (const hour of hours) {
      // Check dayOfWeek is 0-6
      if (hour.dayOfWeek < 0 || hour.dayOfWeek > 6) {
        throw new BadRequestException(
          `dayOfWeek must be between 0 and 6 (got ${hour.dayOfWeek})`,
        );
      }

      // Check no duplicates
      if (dayOfWeeks.has(hour.dayOfWeek)) {
        throw new BadRequestException(
          `Duplicate dayOfWeek: ${hour.dayOfWeek}`,
        );
      }
      dayOfWeeks.add(hour.dayOfWeek);

      // Validate time format
      if (hour.openTime && !this.isValidTimeFormat(hour.openTime)) {
        throw new BadRequestException(
          `Invalid openTime format: ${hour.openTime} (expected HH:mm)`,
        );
      }

      if (hour.closeTime && !this.isValidTimeFormat(hour.closeTime)) {
        throw new BadRequestException(
          `Invalid closeTime format: ${hour.closeTime} (expected HH:mm)`,
        );
      }

      // If either time is provided, both should be provided
      if ((hour.openTime && !hour.closeTime) || (!hour.openTime && hour.closeTime)) {
        throw new BadRequestException(
          'Both openTime and closeTime must be provided, or both must be null',
        );
      }

      // Validate closeTime is after openTime
      if (hour.openTime && hour.closeTime) {
        if (!this.isTimeAfter(hour.closeTime, hour.openTime)) {
          throw new BadRequestException(
            `closeTime (${hour.closeTime}) must be after openTime (${hour.openTime})`,
          );
        }
      }
    }
  }

  /**
   * Validate uploaded file.
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    if (!VALID_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${VALID_MIME_TYPES.join(', ')}`,
      );
    }
  }

  /**
   * Check if time string is in HH:mm format.
   */
  private isValidTimeFormat(time: string): boolean {
    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  /**
   * Check if time1 is after time2 (both in HH:mm format).
   */
  private isTimeAfter(time1: string, time2: string): boolean {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return h1 * 60 + m1 > h2 * 60 + m2;
  }

  /**
   * Get the latest rejection reason for a business (if any).
   */
  private async getLatestRejectionReason(businessId: string): Promise<string | null> {
    const rejection = await this.prisma.rejectionReason.findFirst({
      where: {
        entityType: 'BUSINESS',
        entityId: businessId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return rejection?.reasonText ?? null;
  }

  /**
   * Format a business response object.
   */
  private async formatBusinessResponseWithReason(business: Record<string, any>): Promise<BusinessResponse> {
    const latestStatus = business.statusHistory?.[0]?.status?.name ?? null;
    const rejectionReason =
      latestStatus === 'REJECTED' || latestStatus === 'SUSPENDED'
        ? await this.getLatestRejectionReason(business.id)
        : null;

    // Coordinates are always loaded from DB via attachCoordinatesToBusiness/attachCoordinatesToBusinesses
    // before formatting, so latitude/longitude are guaranteed to be present.
    return {
      id: business.id,
      businessName: business.businessName,
      address: business.address,
      latitude: business.latitude,
      longitude: business.longitude,
      contactPhone: business.contactPhone,
      contactEmail: business.contactEmail,
      latestStatus,
      latestRejectionReason: rejectionReason,
      operatingHours: business.operatingHours || [],
      documents: (business.documents || []).map((doc: Record<string, any>) => ({
        id: doc.id,
        type: doc.type,
        url: doc.url,
        status: doc.status?.name ?? 'UNKNOWN',
      })),
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    };
  }

  /**
   * Format a business response object (sync version without rejection reason).
   */
  private formatBusinessResponse(business: Record<string, any>): BusinessResponse {
    return {
      id: business.id,
      businessName: business.businessName,
      address: business.address,
      // Coordinates are always loaded from DB via attachCoordinatesToBusiness/attachCoordinatesToBusinesses
      // before formatting, so latitude/longitude are guaranteed to be present.
      latitude: business.latitude,
      longitude: business.longitude,
      contactPhone: business.contactPhone,
      contactEmail: business.contactEmail,
      latestStatus: business.statusHistory?.[0]?.status?.name ?? null,
      latestRejectionReason: null,
      operatingHours: business.operatingHours || [],
      documents: (business.documents || []).map((doc: Record<string, any>) => ({
        id: doc.id,
        type: doc.type,
        url: doc.url,
        status: doc.status?.name ?? 'UNKNOWN',
      })),
      createdAt: business.createdAt,
      updatedAt: business.updatedAt,
    };
  }

  /**
   * Helper to create operating hours in a transaction.
   */
  private async createOperatingHours(
    tx: Record<string, any>,
    businessId: string,
    hours: Array<{ dayOfWeek: number; openTime?: string | null; closeTime?: string | null }>,
  ): Promise<void> {
    await Promise.all(
      hours.map((hour) =>
        tx.operatingHour.create({
          data: {
            businessId,
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime ?? null,
            closeTime: hour.closeTime ?? null,
          },
        }),
      ),
    );
  }
}
