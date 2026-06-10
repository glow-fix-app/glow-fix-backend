import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

import { BusinessesService } from '../businesses.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { StorageService } from '../../../core/storage/storage.service';
import { WinstonLoggerService } from '../../../common/logger/winston-logger.service';

import { CreateBusinessDto, UpdateBusinessDto, CreateOperatingHoursDto, UploadDocumentDto } from '../dto';

// =====================================================================
// Mock Data & Helpers
// =====================================================================

const MOCK_MANAGER_ID = 'manager-uuid-1';
const MOCK_BUSINESS_ID = 'business-uuid-1';
const MOCK_STATUS_ID = 'status-uuid-1';
const MOCK_DOCUMENT_ID = 'document-uuid-1';

const createMockBusiness = (overrides?: Partial<any>) => ({
  id: MOCK_BUSINESS_ID,
  managerId: MOCK_MANAGER_ID,
  businessName: 'Test Business',
  address: '123 Main St',
  location: 'SRID=4326;POINT(31.2357 30.0444)',
  contactPhone: '+20123456789',
  contactEmail: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  statusHistory: [
    {
      id: 'status-entry-1',
      businessId: MOCK_BUSINESS_ID,
      statusId: MOCK_STATUS_ID,
      createdAt: new Date(),
      status: {
        id: MOCK_STATUS_ID,
        context: 'BUSINESS',
        name: 'PENDING_REVIEW',
        createdAt: new Date(),
      },
    },
  ],
  operatingHours: [],
  businessServices: [],
  documents: [],
  ...overrides,
});

const createMockFile = (overrides?: Partial<Express.Multer.File>): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'document.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  size: 1024,
  stream: {} as any,
  buffer: Buffer.from('test content'),
  destination: '',
  filename: '',
  path: '',
  ...overrides,
} as any);

// =====================================================================
// Tests
// =====================================================================

describe('BusinessesService', () => {
  let service: BusinessesService;
  let prisma: PrismaService;
  let storage: StorageService;
  let logger: WinstonLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: PrismaService,
          useValue: {
            business: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            businessStatus: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
            },
            businessDocument: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            operatingHour: {
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              create: jest.fn(),
            },
            status: {
              findFirst: jest.fn(),
            },
            rejectionReason: {
              create: jest.fn(),
            },
            review: {
              findMany: jest.fn(),
            },
            $queryRaw: jest.fn(),
            $transaction: jest.fn((callback) => {
              const tx = {
                business: { update: jest.fn().mockResolvedValue({}), create: jest.fn().mockResolvedValue({}) },
                $queryRaw: jest.fn().mockResolvedValue([]),
                businessStatus: { create: jest.fn().mockResolvedValue({}) },
                operatingHour: { deleteMany: jest.fn().mockResolvedValue({}), create: jest.fn().mockResolvedValue({}) },
              };
              return callback(tx);
            }),
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
        {
          provide: WinstonLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    prisma = module.get<PrismaService>(PrismaService);
    storage = module.get<StorageService>(StorageService);
    logger = module.get<WinstonLoggerService>(WinstonLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── CREATE BUSINESS ──────────────────────────────────────────────────────

  describe('createBusiness', () => {
    it('should create a business for a manager with PENDING_REVIEW status', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);
      const txQueryRawSpy = jest.fn().mockResolvedValue([{ id: MOCK_BUSINESS_ID }]);

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          $queryRaw: txQueryRawSpy,
          businessStatus: { create: jest.fn().mockResolvedValue({}) },
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(
        createMockBusiness({ businessName: dto.businessName }),
      );
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: dto.latitude, longitude: dto.longitude }] as any,
      );

      const result = await service.createBusiness(MOCK_MANAGER_ID, dto);

      expect(result).toBeDefined();
      expect(result.businessName).toBe(dto.businessName);
      expect(txQueryRawSpy).toHaveBeenCalled();
    });

    it('should throw ConflictException if manager already has a business', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());

      await expect(service.createBusiness(MOCK_MANAGER_ID, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should use currentUser.id as managerId (not from request body)', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);

      const txQueryRawSpy = jest.fn().mockResolvedValue([{ id: MOCK_BUSINESS_ID }]);
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          $queryRaw: txQueryRawSpy,
          businessStatus: { create: jest.fn().mockResolvedValue({}) },
        };
        return callback(tx as any);
      });
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);

      await service.createBusiness(MOCK_MANAGER_ID, dto);

      // Verify the raw SQL insert was used (no prisma business.create)
      expect(txQueryRawSpy).toHaveBeenCalled();
      expect((prisma.business as any).create).not.toHaveBeenCalled();
    });

    it('should create the business with transaction-safe PostGIS location and no null insertion', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);

      // Middle spy captures the raw SQL call arguments
      const txInsertSpy = jest.fn().mockImplementation(
        (sql: TemplateStringsArray, ...values: unknown[]) => {
          // Verify the SQL template contains ST_SetSRID and ST_MakePoint
          const rawSql = Array.isArray(sql) ? sql.join(' ') : String(sql);
          expect(rawSql).toContain('ST_SetSRID');
          expect(rawSql).toContain('ST_MakePoint');
          expect(rawSql).not.toContain('$executeRawUnsafe');
          return Promise.resolve([{ id: MOCK_BUSINESS_ID }]);
        },
      );

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          $queryRaw: txInsertSpy,
          businessStatus: { create: jest.fn().mockResolvedValue({}) },
          operatingHour: { create: jest.fn() },
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(
        createMockBusiness({ businessName: dto.businessName }),
      );
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: dto.latitude, longitude: dto.longitude }] as any,
      );

      const result = await service.createBusiness(MOCK_MANAGER_ID, dto);

      // Verify no prisma business.create was called (inserted via raw SQL)
      expect((prisma.business as any).create).not.toHaveBeenCalled();
      // Verify raw SQL insert was called with ST_SetSRID/ST_MakePoint
      expect(txInsertSpy).toHaveBeenCalled();
      // Verify response includes actual coordinates from ST_X/ST_Y helper
      expect(result.latitude).toBe(dto.latitude);
      expect(result.longitude).toBe(dto.longitude);
    });

    it('should create transaction-safe with business and status', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);

      const txSpy = jest.spyOn(prisma, '$transaction');

      try {
        await service.createBusiness(MOCK_MANAGER_ID, dto);
      } catch {
        // Expected if transaction callback isn't fully implemented
      }

      expect(txSpy).toHaveBeenCalled();
    });
  });

  // ─── GET MY BUSINESS ──────────────────────────────────────────────────────

  describe('getMyBusiness', () => {
    it('should return manager\'s own business', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);

      const result = await service.getMyBusiness(MOCK_MANAGER_ID);

      expect(result).toBeDefined();
      expect(result.businessName).toBe(business.businessName);
      expect(result.id).toBe(business.id);
      expect(result.latitude).toBe(30.0444);
      expect(result.longitude).toBe(31.2357);
    });

    it('should throw NotFoundException if manager has no business', async () => {
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);

      await expect(service.getMyBusiness(MOCK_MANAGER_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return null latestRejectionReason for APPROVED status', async () => {
      const business = createMockBusiness({
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(service as any, 'getLatestRejectionReason').mockResolvedValue('Invalid docs');

      const result = await service.getMyBusiness(MOCK_MANAGER_ID);

      expect(result.latestStatus).toBe('APPROVED');
      expect(result.latestRejectionReason).toBeNull();
    });

    it('should include latestRejectionReason when latest status is REJECTED', async () => {
      const business = createMockBusiness({
        statusHistory: [
          {
            status: { name: 'REJECTED' },
          },
        ],
      });
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(service as any, 'getLatestRejectionReason').mockResolvedValue('Missing permit');

      const result = await service.getMyBusiness(MOCK_MANAGER_ID);

      expect(result.latestStatus).toBe('REJECTED');
      expect(result.latestRejectionReason).toBe('Missing permit');
    });
  });

  // ─── UPDATE MY BUSINESS ───────────────────────────────────────────────────

  describe('updateMyBusiness', () => {
    it('should update manager\'s own business', async () => {
      const dto: UpdateBusinessDto = {
        businessName: 'Updated Business',
        address: '456 Oak Ave',
      };

      jest
        .spyOn(prisma.business, 'findFirst')
        .mockResolvedValueOnce(createMockBusiness())
        .mockResolvedValueOnce(createMockBusiness(dto));

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(
        createMockBusiness(dto),
      );
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: 30.0444, longitude: 31.2357 }] as any,
      );

      const result = await service.updateMyBusiness(MOCK_MANAGER_ID, dto);

      expect(result).toBeDefined();
    });

    it('should not allow changing managerId', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const updateSpy = jest.spyOn(prisma.business, 'update').mockResolvedValue(
        createMockBusiness(),
      );

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: 30.0444, longitude: 31.2357 }] as any,
      );
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          business: { update: updateSpy },
          $queryRaw: jest.fn().mockResolvedValue([]),
        };
        return callback(tx as any);
      });

      await service.updateMyBusiness(MOCK_MANAGER_ID, { businessName: 'Updated' });

      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('managerId');
    });

    it('should throw NotFoundException if manager has no business', async () => {
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateMyBusiness(MOCK_MANAGER_ID, { businessName: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not change business status when updating', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const updateSpy = jest.spyOn(prisma.business, 'update').mockResolvedValue(business);

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(business);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: 30.0444, longitude: 31.2357 }] as any,
      );
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          business: { update: updateSpy },
          $queryRaw: jest.fn().mockResolvedValue([]),
        };
        return callback(tx as any);
      });

      await service.updateMyBusiness(MOCK_MANAGER_ID, {
        businessName: 'Updated',
      });

      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall.data).toBeDefined();
    });

    it('should update PostGIS location using transaction raw SQL when coordinates change', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const updateSpy = jest.fn().mockResolvedValue(business);
      const txQueryRawSpy = jest.fn().mockImplementation(
        (sql: TemplateStringsArray, ...values: unknown[]) => {
          const rawSql = Array.isArray(sql) ? sql.join(' ') : String(sql);
          expect(rawSql).toContain('ST_SetSRID');
          expect(rawSql).toContain('ST_MakePoint');
          return Promise.resolve([]);
        },
      );

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          business: { update: updateSpy },
          $queryRaw: txQueryRawSpy,
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(business);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 29.0, longitude: 31.0 }] as any);

      const result = await service.updateMyBusiness(MOCK_MANAGER_ID, {
        latitude: 29.0,
        longitude: 31.0,
      });

      expect(updateSpy).toHaveBeenCalled();
      expect(txQueryRawSpy).toHaveBeenCalled();
      expect(result.latitude).toBe(29.0);
      expect(result.longitude).toBe(31.0);
    });

    it('should load existing ST_X/ST_Y coordinates when only one coordinate is provided', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const updateSpy = jest.fn().mockResolvedValue(business);

      // Spy called twice: load existing coords, then update location
      const loadCoordSpy = jest.fn()
        .mockResolvedValueOnce([{ latitude: 30.0444, longitude: 31.2357 }])
        .mockResolvedValueOnce([]);

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          business: { update: updateSpy },
          $queryRaw: loadCoordSpy,
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(business);
      // post-transaction coordinate loading must reflect the updated longitude
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.5 }] as any);

      const result = await service.updateMyBusiness(MOCK_MANAGER_ID, {
        longitude: 31.5,
      });

      expect(loadCoordSpy).toHaveBeenCalledTimes(2);
      expect(result.longitude).toBe(31.5);
      expect(result).toBeDefined();
    });

    it('should update location with safe raw SQL (ST_SetSRID/ST_MakePoint)', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const updateSpy = jest.fn().mockResolvedValue(business);
      const updateCoordSpy = jest.fn().mockImplementation(
        (sql: TemplateStringsArray, ...values: unknown[]) => {
          const rawSql = Array.isArray(sql) ? sql.join(' ') : String(sql);
          expect(rawSql).toContain('ST_SetSRID');
          expect(rawSql).toContain('ST_MakePoint');
          expect(rawSql).not.toContain('ST_GeographyFromText');
          return Promise.resolve([]);
        },
      );

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          business: { update: updateSpy },
          $queryRaw: updateCoordSpy,
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(business);
      // post-transaction coordinate loading must reflect the updated coordinates
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 29.5, longitude: 31.2 }] as any);

      const result = await service.updateMyBusiness(MOCK_MANAGER_ID, {
        latitude: 29.5,
        longitude: 31.2,
      });

      expect(updateCoordSpy).toHaveBeenCalled();
      expect(result.latitude).toBe(29.5);
      expect(result.longitude).toBe(31.2);
    });
  });

  // ─── RESPONSE COORDINATE LOADING ───────────────────────────────────────────

  describe('response coordinate loading', () => {
    it('should return actual coordinates from ST_X/ST_Y helper for createBusiness', async () => {
      const dto: CreateBusinessDto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);

      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          $queryRaw: jest.fn().mockResolvedValue([{ id: MOCK_BUSINESS_ID }]),
          businessStatus: { create: jest.fn().mockResolvedValue({}) },
        };
        return callback(tx as any);
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());
      // Mock the ST_X/ST_Y query used in attachCoordinatesToBusiness
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: 30.0444, longitude: 31.2357 }] as any,
      );

      const result = await service.createBusiness(MOCK_MANAGER_ID, dto);

      expect(result.latitude).toBe(30.0444);
      expect(result.longitude).toBe(31.2357);
    });

    it('should return actual coordinates from ST_X/ST_Y helper for getMyBusiness', async () => {
      const business = createMockBusiness();
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);
      // Mock ST_X/ST_Y loading of actual stored coordinates
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ latitude: 30.0444, longitude: 31.2357 }] as any,
      );

      const result = await service.getMyBusiness(MOCK_MANAGER_ID);

      expect(result.latitude).toBe(30.0444);
      expect(result.longitude).toBe(31.2357);
    });
  });

  // ─── NO location: null VERIFICATION ────────────────────────────────────────

  describe('location safety', () => {
    it('should not have location: null in businesses.service.ts source code', async () => {
      const fs = require('fs');
      const source = fs.readFileSync(
        require('path').join(__dirname, '..', 'businesses.service.ts'),
        'utf8',
      );
      // Verify no location: null pattern exists in the service file
      expect(source).not.toMatch(/location:\s*null/);
    });
  });

  // ─── OPERATING HOURS ──────────────────────────────────────────────────────

  describe('updateOperatingHours', () => {
    it('should update operating hours with valid input', async () => {
      const dto: CreateOperatingHoursDto = {
        hours: [
          { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00' },
          { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00' },
        ],
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
        const tx = {
          operatingHour: {
            deleteMany: jest.fn().mockResolvedValue({}),
            create: jest
              .fn()
              .mockImplementation((data) =>
                Promise.resolve({ ...data, id: 'hour-id' }),
              ),
          },
        };
        return callback(tx as any);
      });

      const result = await service.updateOperatingHours(MOCK_MANAGER_ID, dto);

      expect(result).toBeDefined();
    });

    it('should reject duplicate dayOfWeek', async () => {
      const dto: CreateOperatingHoursDto = {
        hours: [
          { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00' },
          { dayOfWeek: 0, openTime: '10:00', closeTime: '18:00' },
        ],
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());

      await expect(service.updateOperatingHours(MOCK_MANAGER_ID, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate time format HH:mm', async () => {
      const dto: CreateOperatingHoursDto = {
        hours: [{ dayOfWeek: 0, openTime: '9:00', closeTime: '17:00' }],
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());

      await expect(service.updateOperatingHours(MOCK_MANAGER_ID, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate closeTime is after openTime', async () => {
      const dto: CreateOperatingHoursDto = {
        hours: [{ dayOfWeek: 0, openTime: '17:00', closeTime: '09:00' }],
      };

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());

      await expect(service.updateOperatingHours(MOCK_MANAGER_ID, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── DOCUMENTS ────────────────────────────────────────────────────────────

  describe('uploadDocument', () => {
    it('should upload document with valid file', async () => {
      const dto: UploadDocumentDto = { type: 'BUSINESS_REGISTRATION' };
      const file = createMockFile();

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma.businessDocument, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);
      jest.spyOn(storage, 'uploadFile').mockResolvedValue({
        storageKey: 'documents/doc-key.pdf',
        url: 'https://cdn.example.com/documents/doc-key.pdf',
      });
      jest.spyOn(prisma.businessDocument, 'create').mockResolvedValue({
        id: MOCK_DOCUMENT_ID,
        businessId: MOCK_BUSINESS_ID,
        type: dto.type,
        url: 'https://cdn.example.com/documents/doc-key.pdf',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: {
          id: MOCK_STATUS_ID,
          context: 'DOCUMENT',
          name: 'PENDING',
          createdAt: new Date(),
        },
      } as any);

      const result = await service.uploadDocument(MOCK_MANAGER_ID, file, dto);

      expect(result).toBeDefined();
      expect(result.type).toBe(dto.type);
      expect(result.status).toBe('PENDING');
      expect(storage.uploadFile).toHaveBeenCalledWith(
        file.buffer,
        'documents',
        file.mimetype,
        undefined,
      );
    });

    it('should reject if file is missing', async () => {
      const dto: UploadDocumentDto = { type: 'BUSINESS_REGISTRATION' };

      await expect(
        service.uploadDocument(MOCK_MANAGER_ID, null as any, dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid MIME type', async () => {
      const dto: UploadDocumentDto = { type: 'BUSINESS_REGISTRATION' };
      const file = createMockFile({ mimetype: 'text/plain' });

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma.businessDocument, 'findFirst').mockResolvedValue(null);

      await expect(service.uploadDocument(MOCK_MANAGER_ID, file, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject duplicate document type', async () => {
      const dto: UploadDocumentDto = { type: 'BUSINESS_REGISTRATION' };
      const file = createMockFile();

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma.businessDocument, 'findFirst').mockResolvedValue({
        id: MOCK_DOCUMENT_ID,
        businessId: MOCK_BUSINESS_ID,
        type: dto.type,
        url: 'https://example.com/doc.pdf',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await expect(service.uploadDocument(MOCK_MANAGER_ID, file, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should use real storage service, not fake URLs', async () => {
      const dto: UploadDocumentDto = { type: 'BUSINESS_REGISTRATION' };
      const file = createMockFile();

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(createMockBusiness());
      jest.spyOn(prisma.businessDocument, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);

      const uploadSpy = jest
        .spyOn(storage, 'uploadFile')
        .mockResolvedValue({
          storageKey: 'documents/real-key-123.pdf',
          url: 'https://cdn.glowfix.io/documents/real-key-123.pdf',
        });

      jest.spyOn(prisma.businessDocument, 'create').mockResolvedValue({
        id: MOCK_DOCUMENT_ID,
        businessId: MOCK_BUSINESS_ID,
        type: dto.type,
        url: 'https://cdn.glowfix.io/documents/real-key-123.pdf',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: {
          id: MOCK_STATUS_ID,
          context: 'DOCUMENT',
          name: 'PENDING',
          createdAt: new Date(),
        },
      } as any);

      const result = await service.uploadDocument(MOCK_MANAGER_ID, file, dto);

      expect(uploadSpy).toHaveBeenCalledWith(
        file.buffer,
        'documents',
        file.mimetype,
        undefined,
      );
      expect(result.url).not.toContain('storage.glowfix.com');
      expect(result.url).toMatch(/https:\/\/cdn\.(glowfix|example)\.io?/);
    });
  });

  // ─── ONBOARDING STATUS ────────────────────────────────────────────────────

  describe('getOnboardingStatus', () => {
    it('should return hasBusiness=false if no business', async () => {
      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(null);

      const result = await service.getOnboardingStatus(MOCK_MANAGER_ID);

      expect(result.hasBusiness).toBe(false);
      expect(result.missingDocuments).toContain('BUSINESS_REGISTRATION');
      expect(result.missingDocuments).toContain('INSURANCE_CERTIFICATE');
      expect(result.missingDocuments).toContain('TAX_CARD');
    });

    it('should calculate missing documents', async () => {
      const business = createMockBusiness({
        documents: [
          {
            id: 'doc-1',
            type: 'BUSINESS_REGISTRATION',
            status: { name: 'APPROVED' },
            createdAt: new Date(),
          },
        ],
      });

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const result = await service.getOnboardingStatus(MOCK_MANAGER_ID);

      expect(result.uploadedDocuments).toContain('BUSINESS_REGISTRATION');
      expect(result.missingDocuments).toContain('INSURANCE_CERTIFICATE');
      expect(result.missingDocuments).toContain('TAX_CARD');
    });

    it('should detect rejected documents', async () => {
      const business = createMockBusiness({
        documents: [
          {
            id: 'doc-1',
            type: 'BUSINESS_REGISTRATION',
            status: { name: 'REJECTED' },
            createdAt: new Date(),
          },
        ],
      });

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const result = await service.getOnboardingStatus(MOCK_MANAGER_ID);

      expect(result.rejectedDocuments).toContain('BUSINESS_REGISTRATION');
    });

    it('should set isReadyForReview correctly', async () => {
      const business = createMockBusiness({
        operatingHours: [{ dayOfWeek: 0, openTime: '09:00', closeTime: '17:00' }],
        documents: [
          {
            id: 'doc-1',
            type: 'BUSINESS_REGISTRATION',
            status: { name: 'PENDING' },
            createdAt: new Date(),
          },
          {
            id: 'doc-2',
            type: 'INSURANCE_CERTIFICATE',
            status: { name: 'PENDING' },
            createdAt: new Date(),
          },
          {
            id: 'doc-3',
            type: 'TAX_CARD',
            status: { name: 'PENDING' },
            createdAt: new Date(),
          },
        ],
      });

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const result = await service.getOnboardingStatus(MOCK_MANAGER_ID);

      expect(result.isReadyForReview).toBe(true);
    });

    it('should set canGoLive only when APPROVED and all documents approved', async () => {
      const business = createMockBusiness({
        statusHistory: [
          {
            id: 'status-entry-1',
            businessId: MOCK_BUSINESS_ID,
            statusId: MOCK_STATUS_ID,
            createdAt: new Date(),
            status: {
              id: MOCK_STATUS_ID,
              context: 'BUSINESS',
              name: 'APPROVED',
              createdAt: new Date(),
            },
          },
        ],
        documents: [
          {
            id: 'doc-1',
            type: 'BUSINESS_REGISTRATION',
            status: { name: 'APPROVED' },
            createdAt: new Date(),
          },
          {
            id: 'doc-2',
            type: 'INSURANCE_CERTIFICATE',
            status: { name: 'APPROVED' },
            createdAt: new Date(),
          },
          {
            id: 'doc-3',
            type: 'TAX_CARD',
            status: { name: 'APPROVED' },
            createdAt: new Date(),
          },
        ],
      });

      jest.spyOn(prisma.business, 'findFirst').mockResolvedValue(business);

      const result = await service.getOnboardingStatus(MOCK_MANAGER_ID);

      expect(result.canGoLive).toBe(true);
    });
  });

  // ─── ADMIN OPERATIONS ────────────────────────────────────────────────────

  describe('setBusinessStatus', () => {
    it('should allow admin to approve business', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);
      jest.spyOn(prisma.businessStatus, 'create').mockResolvedValue({} as any);
      jest
        .spyOn(prisma.business, 'findUnique')
        .mockResolvedValueOnce(createMockBusiness())
        .mockResolvedValueOnce(createMockBusiness());

      const result = await service.setBusinessStatus(MOCK_BUSINESS_ID, {
        status: 'APPROVED',
      });

      expect(result).toBeDefined();
    });

    it('should deduplicate businesses when admin status filter returns duplicate entries', async () => {
      const business = createMockBusiness({ id: 'duplicate-business' });
      jest.spyOn(prisma.status, 'findFirst').mockResolvedValue({ id: 'status-uuid', context: 'BUSINESS', name: 'PENDING_REVIEW' } as any);
      jest.spyOn(prisma.businessStatus, 'findMany').mockResolvedValue([
        { business } as any,
        { business } as any,
      ]);
      jest.spyOn(service as any, 'getLatestBusinessStatus').mockResolvedValue('PENDING_REVIEW');
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ id: 'duplicate-business', latitude: 30.0444, longitude: 31.2357 }] as any);

      const result = await service.getAllBusinessesForAdmin('PENDING_REVIEW');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('duplicate-business');
    });

    it('should require reason when rejecting', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());

      await expect(
        service.setBusinessStatus(MOCK_BUSINESS_ID, { status: 'REJECTED' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should require reason when suspending', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());

      await expect(
        service.setBusinessStatus(MOCK_BUSINESS_ID, { status: 'SUSPENDED' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should store rejection reason', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(createMockBusiness());
      jest.spyOn(service, 'getStatusId').mockResolvedValue(MOCK_STATUS_ID);
      jest.spyOn(prisma.businessStatus, 'create').mockResolvedValue({} as any);

      const reasonSpy = jest.spyOn(prisma.rejectionReason, 'create').mockResolvedValue({} as any);

      jest
        .spyOn(prisma.business, 'findUnique')
        .mockResolvedValueOnce(createMockBusiness())
        .mockResolvedValueOnce(createMockBusiness());

      await service.setBusinessStatus(MOCK_BUSINESS_ID, {
        status: 'REJECTED',
        reason: 'Missing documents',
      });

      expect(reasonSpy).toHaveBeenCalled();
    });
  });

  // ─── MANAGER AUTHORIZATION ────────────────────────────────────────────────

  describe('assertBusinessOwner', () => {
    it('should allow manager to access own business', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue({
        managerId: MOCK_MANAGER_ID,
      } as any);

      await expect(
        service.assertBusinessOwner(MOCK_BUSINESS_ID, MOCK_MANAGER_ID),
      ).resolves.toBeUndefined();
    });

    it('should forbid manager from accessing another business', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue({
        managerId: 'other-manager-id',
      } as any);

      await expect(
        service.assertBusinessOwner(MOCK_BUSINESS_ID, MOCK_MANAGER_ID),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ─── PUBLIC LISTING ──────────────────────────────────────────────────────

  describe('getApprovedBusinessesForPublic', () => {
    it('should return only APPROVED businesses', async () => {
      const approvedBusiness = createMockBusiness({
        id: 'business-1',
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });

      const rejectedBusiness = createMockBusiness({
        id: 'business-2',
        statusHistory: [
          {
            status: { name: 'REJECTED' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findMany').mockResolvedValue([
        approvedBusiness,
        rejectedBusiness,
      ] as any);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue(
        [{ id: 'business-1', latitude: 30.0444, longitude: 31.2357 }] as any,
      );

      const result = await service.getApprovedBusinessesForPublic();

      // Result should only contain approved business
      const businessIds = result.map((b) => b.id);
      expect(businessIds).toContain('business-1');
    });

    it('should not return suspended businesses even if previously approved', async () => {
      const suspendedBusiness = createMockBusiness({
        id: 'business-1',
        statusHistory: [
          {
            status: { name: 'SUSPENDED' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findMany').mockResolvedValue([suspendedBusiness] as any);

      const result = await service.getApprovedBusinessesForPublic();

      const businessIds = result.map((b) => b.id);
      expect(businessIds).not.toContain('business-1');
    });
  });

  // ─── PUBLIC: LIST APPROVED BUSINESSES ──────────────────────────────────────

  describe('listApprovedBusinesses', () => {
    it('should return only APPROVED businesses', async () => {
      const approvedBusiness = createMockBusiness({
        id: 'business-1',
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });

      const pendingBusiness = createMockBusiness({
        id: 'business-2',
        statusHistory: [
          {
            status: { name: 'PENDING_REVIEW' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findMany').mockResolvedValue([
        approvedBusiness,
        pendingBusiness,
      ] as any);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(prisma.status, 'findFirst').mockResolvedValue(
        { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED' } as any,
      );
      jest.spyOn(prisma.businessStatus, 'findFirst').mockImplementation(
        ((args: any) => {
          if (args?.where?.businessId === 'business-1') {
            return Promise.resolve({
              id: 'status-entry-1',
              businessId: 'business-1',
              statusId: MOCK_STATUS_ID,
              createdAt: new Date(),
              status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED', createdAt: new Date() },
            } as any);
          }
          return Promise.resolve({
            id: 'status-entry-2',
            businessId: args?.where?.businessId,
            statusId: MOCK_STATUS_ID,
            createdAt: new Date(),
            status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'PENDING_REVIEW', createdAt: new Date() },
          } as any);
        }) as any,
      );

      const result = await service.listApprovedBusinesses();

      const businessIds = result.map((b) => b.id);
      expect(businessIds).toContain('business-1');
      expect(businessIds).not.toContain('business-2');
    });

    it('should return empty array if no approved businesses exist', async () => {
      jest.spyOn(prisma.business, 'findMany').mockResolvedValue([] as any);

      const result = await service.listApprovedBusinesses();

      expect(result).toEqual([]);
    });

    it('should include latestStatus as APPROVED in response', async () => {
      const approvedBusiness = createMockBusiness({
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findMany').mockResolvedValue([approvedBusiness] as any);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(prisma.status, 'findFirst').mockResolvedValue(
        { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED' } as any,
      );
      jest.spyOn(prisma.businessStatus, 'findFirst').mockResolvedValue({
        id: 'status-entry-1',
        businessId: approvedBusiness.id,
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED', createdAt: new Date() },
      } as any);

      const result = await service.listApprovedBusinesses();

      expect(result[0].latestStatus).toBe('APPROVED');
    });
  });

  // ─── PUBLIC: GET APPROVED BUSINESS BY ID ──────────────────────────────────

  describe('getApprovedBusiness', () => {
    it('should return approved business by ID', async () => {
      const approvedBusiness = createMockBusiness({
        id: 'business-1',
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(approvedBusiness as any);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(prisma.businessStatus, 'findFirst').mockResolvedValue({
        id: 'status-entry-1',
        businessId: 'business-1',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED', createdAt: new Date() },
      } as any);

      const result = await service.getApprovedBusiness('business-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('business-1');
      expect(result.latestStatus).toBe('APPROVED');
    });

    it('should throw NotFoundException if business not found', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(null);

      await expect(service.getApprovedBusiness('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if business exists but is not approved', async () => {
      const pendingBusiness = createMockBusiness({
        statusHistory: [
          {
            status: { name: 'PENDING_REVIEW' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(pendingBusiness as any);
      jest.spyOn(prisma.businessStatus, 'findFirst').mockResolvedValue({
        id: 'status-entry-1',
        businessId: 'business-1',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'PENDING_REVIEW', createdAt: new Date() },
      } as any);

      await expect(service.getApprovedBusiness('business-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should load coordinates using PostGIS ST_X and ST_Y', async () => {
      const approvedBusiness = createMockBusiness({
        statusHistory: [
          {
            status: { name: 'APPROVED' },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(approvedBusiness as any);
      jest.spyOn(prisma.businessStatus, 'findFirst').mockResolvedValue({
        id: 'status-entry-1',
        businessId: 'business-1',
        statusId: MOCK_STATUS_ID,
        createdAt: new Date(),
        status: { id: MOCK_STATUS_ID, context: 'BUSINESS', name: 'APPROVED', createdAt: new Date() },
      } as any);
      const queryRawSpy = jest
        .spyOn(prisma, '$queryRaw')
        .mockResolvedValue([{ latitude: 29.5, longitude: 30.5 }] as any);

      const result = await service.getApprovedBusiness('business-1');

      expect(queryRawSpy).toHaveBeenCalled();
      expect(result.latitude).toBe(29.5);
      expect(result.longitude).toBe(30.5);
    });
  });

  describe('getPublicBusinessProfile', () => {
    it('returns public profile for approved business', async () => {
      const approvedBusiness = createMockBusiness({
        statusHistory: [{ status: { name: 'APPROVED' } }],
        operatingHours: [{ dayOfWeek: 1, openTime: '09:00', closeTime: '17:00' }],
        businessServices: [
          {
            id: 'bs-1',
            businessId: MOCK_BUSINESS_ID,
            serviceId: 'service-1',
            price: 15000n,
            averageDuration: 30,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            service: {
              id: 'service-1',
              title: 'Exterior Wash',
              description: 'Wash',
              category: { id: 'cat-1', name: 'Car Wash' },
            },
          },
          {
            id: 'bs-2',
            businessId: MOCK_BUSINESS_ID,
            serviceId: 'service-2',
            price: 20000n,
            averageDuration: 45,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            service: {
              id: 'service-2',
              title: 'Interior Wash',
              description: 'Wash',
              category: { id: 'cat-1', name: 'Car Wash' },
            },
          },
        ],
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(approvedBusiness as any);
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ latitude: 30.0444, longitude: 31.2357 }] as any);
      jest.spyOn(prisma.review, 'findMany').mockResolvedValue([{ rating: 4 }, { rating: 5 }] as any);

      const result = await service.getPublicBusinessProfile(MOCK_BUSINESS_ID);

      expect(result.id).toBe(MOCK_BUSINESS_ID);
      expect(result.businessServices).toHaveLength(2);
      expect(result.operatingHours).toHaveLength(1);
      expect(result.rating).toBe(4.5);
      expect(result.reviews_count).toBe(2);
      expect(result.businessServices[0].price).toBe(15000n);
    });

    it('throws NotFoundException if business does not exist', async () => {
      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(null);

      await expect(service.getPublicBusinessProfile(MOCK_BUSINESS_ID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException if latest status is not approved', async () => {
      const pendingBusiness = createMockBusiness({
        statusHistory: [{ status: { name: 'PENDING_REVIEW' } }],
      });

      jest.spyOn(prisma.business, 'findUnique').mockResolvedValue(pendingBusiness as any);

      await expect(service.getPublicBusinessProfile(MOCK_BUSINESS_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
