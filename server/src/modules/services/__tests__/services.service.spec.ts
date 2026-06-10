import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { ServicesService } from '../services.service';

const MOCK_MANAGER_ID = 'manager-uuid-1';
const MOCK_BUSINESS_ID = 'business-uuid-1';
const MOCK_SERVICE_ID = 'service-uuid-1';
const MOCK_BUSINESS_SERVICE_ID = 'business-service-uuid-1';

const createBusiness = (overrides?: Partial<any>) => ({
  id: MOCK_BUSINESS_ID,
  managerId: MOCK_MANAGER_ID,
  businessName: 'Glow Fix Garage',
  ...overrides,
});

const createService = (overrides?: Partial<any>) => ({
  id: MOCK_SERVICE_ID,
  categoryId: 'category-uuid-1',
  title: 'Exterior Wash',
  description: 'Full exterior wash',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: new Date('2025-01-02T00:00:00.000Z'),
  category: {
    id: 'category-uuid-1',
    name: 'CAR_WASH',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  ...overrides,
});

const createBusinessService = (overrides?: Partial<any>) => ({
  id: MOCK_BUSINESS_SERVICE_ID,
  businessId: MOCK_BUSINESS_ID,
  serviceId: MOCK_SERVICE_ID,
  price: 15000n,
  averageDuration: 30,
  isActive: true,
  createdAt: new Date('2025-01-03T00:00:00.000Z'),
  updatedAt: new Date('2025-01-04T00:00:00.000Z'),
  business: createBusiness(),
  service: createService(),
  ...overrides,
});

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: any;
  let eventEmitter: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            business: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            category: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
            service: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            businessService: {
              findFirst: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            bookingItem: {
              findFirst: jest.fn(),
            },
            $transaction: jest.fn(async (operations: Promise<unknown>[]) => Promise.all(operations)),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ServicesService);
    prisma = module.get(PrismaService);
    eventEmitter = module.get(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAssignedBusinessServices', () => {
    it('rejects access for another manager', async () => {
      prisma.business.findFirst.mockResolvedValue(null);

      await expect(
        service.getAssignedBusinessServices(MOCK_MANAGER_ID, MOCK_BUSINESS_ID),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('assignServiceToBusiness', () => {
    it('rejects duplicate assignment', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findFirst.mockResolvedValue(createBusinessService());

      await expect(
        service.assignServiceToBusiness(MOCK_MANAGER_ID, MOCK_BUSINESS_ID, {
          service_id: MOCK_SERVICE_ID,
          price: 150,
          average_duration: 30,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('bulkAssignServicesToBusiness', () => {
    it('rejects duplicate service ids inside payload atomically', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());

      await expect(
        service.bulkAssignServicesToBusiness(MOCK_MANAGER_ID, MOCK_BUSINESS_ID, {
          services: [
            { service_id: MOCK_SERVICE_ID, price: 150, average_duration: 30 },
            { service_id: MOCK_SERVICE_ID, price: 200, average_duration: 45 },
          ],
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.businessService.create).not.toHaveBeenCalled();
    });

    it('rejects missing service ids atomically', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.service.findMany.mockResolvedValue([]);

      await expect(
        service.bulkAssignServicesToBusiness(MOCK_MANAGER_ID, MOCK_BUSINESS_ID, {
          services: [{ service_id: MOCK_SERVICE_ID, price: 150, average_duration: 30 }],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.businessService.create).not.toHaveBeenCalled();
    });

    it('rejects already assigned services atomically', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.service.findMany.mockResolvedValue([createService()]);
      prisma.businessService.findMany.mockResolvedValue([{ serviceId: MOCK_SERVICE_ID }]);

      await expect(
        service.bulkAssignServicesToBusiness(MOCK_MANAGER_ID, MOCK_BUSINESS_ID, {
          services: [{ service_id: MOCK_SERVICE_ID, price: 150, average_duration: 30 }],
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.businessService.create).not.toHaveBeenCalled();
    });

    it('creates all assignments in one transaction after full validation', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.service.findMany.mockResolvedValue([
        createService(),
        createService({ id: 'service-uuid-2', title: 'Interior Wash' }),
      ]);
      prisma.businessService.findMany.mockResolvedValue([]);
      prisma.businessService.create
        .mockResolvedValueOnce(createBusinessService())
        .mockResolvedValueOnce(
          createBusinessService({
            id: 'business-service-uuid-2',
            serviceId: 'service-uuid-2',
            service: createService({ id: 'service-uuid-2', title: 'Interior Wash' }),
          }),
        );

      const result = await service.bulkAssignServicesToBusiness(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
        {
          services: [
            { service_id: MOCK_SERVICE_ID, price: 150, average_duration: 30 },
            { service_id: 'service-uuid-2', price: 200, average_duration: 45 },
          ],
        },
      );

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(eventEmitter.emit).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateAssignedBusinessService', () => {
    it('updates price and duration for owned business service', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findFirst.mockResolvedValue(createBusinessService());
      prisma.businessService.update.mockResolvedValue(
        createBusinessService({
          price: 22500n,
          averageDuration: 60,
        }),
      );

      const result = await service.updateAssignedBusinessService(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
        MOCK_BUSINESS_SERVICE_ID,
        {
          price: 225,
          average_duration: 60,
        },
      );

      expect(prisma.businessService.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: MOCK_BUSINESS_SERVICE_ID },
          data: expect.objectContaining({
            price: 22500n,
            averageDuration: 60,
          }),
        }),
      );
      expect(result.averageDuration).toBe(60);
    });
  });

  describe('toggleAssignedBusinessService', () => {
    it('flips isActive for owned business service', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findFirst.mockResolvedValue(createBusinessService());
      prisma.businessService.update.mockResolvedValue({
        id: MOCK_BUSINESS_SERVICE_ID,
        isActive: false,
      });

      const result = await service.toggleAssignedBusinessService(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
        MOCK_BUSINESS_SERVICE_ID,
      );

      expect(prisma.businessService.update).toHaveBeenCalledWith({
        where: { id: MOCK_BUSINESS_SERVICE_ID },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('removeAssignedBusinessService', () => {
    it('removes assigned service when there are no active bookings', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findFirst.mockResolvedValue(
        createBusinessService({
          service: createService(),
        }),
      );
      prisma.bookingItem.findFirst.mockResolvedValue(null);
      prisma.businessService.delete.mockResolvedValue({ id: MOCK_BUSINESS_SERVICE_ID });

      const result = await service.removeAssignedBusinessService(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
        MOCK_BUSINESS_SERVICE_ID,
      );

      expect(prisma.businessService.delete).toHaveBeenCalledWith({
        where: { id: MOCK_BUSINESS_SERVICE_ID },
      });
      expect(result).toEqual({ message: 'Service removed from business' });
    });
  });

  describe('listing methods', () => {
    it('lists assigned services for owned business', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findMany.mockResolvedValue([createBusinessService()]);

      const result = await service.getAssignedBusinessServices(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
      );

      expect(result).toHaveLength(1);
      expect(prisma.businessService.findMany).toHaveBeenCalled();
    });

    it('lists unassigned services for owned business', async () => {
      prisma.business.findFirst.mockResolvedValue(createBusiness());
      prisma.businessService.findMany.mockResolvedValue([{ serviceId: MOCK_SERVICE_ID }]);
      prisma.service.findMany.mockResolvedValue([
        createService({ id: 'service-uuid-2', title: 'Interior Wash' }),
      ]);

      const result = await service.getUnassignedBusinessServices(
        MOCK_MANAGER_ID,
        MOCK_BUSINESS_ID,
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('service-uuid-2');
    });
  });
});
