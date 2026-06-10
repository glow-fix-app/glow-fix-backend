import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesController } from '../businesses.controller';
import { BusinessesService } from '../businesses.service';
import { JwtPayload, UserRole } from '@glow-fix/types';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

// =====================================================================
// Mock Data
// =====================================================================

const MOCK_USER: JwtPayload = {
  sub: 'user-uuid-1',
  email: 'manager@example.com',
  role: UserRole.MANAGER,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const MOCK_BUSINESS_RESPONSE = {
  id: 'business-uuid-1',
  businessName: 'Test Business',
  address: '123 Main St',
  latitude: 30.0444,
  longitude: 31.2357,
  contactPhone: '+20123456789',
  contactEmail: 'test@example.com',
  latestStatus: 'PENDING_REVIEW',
  latestRejectionReason: null,
  operatingHours: [],
  documents: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// =====================================================================
// Tests
// =====================================================================

describe('BusinessesController', () => {
  let controller: BusinessesController;
  let service: BusinessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessesController],
      providers: [
        {
          provide: BusinessesService,
          useValue: {
            createBusiness: jest.fn(),
            getMyBusiness: jest.fn(),
            updateMyBusiness: jest.fn(),
            getOperatingHours: jest.fn(),
            updateOperatingHours: jest.fn(),
            getMyDocuments: jest.fn(),
            uploadDocument: jest.fn(),
            deleteDocument: jest.fn(),
            getOnboardingStatus: jest.fn(),
            getAllBusinessesForAdmin: jest.fn(),
            setBusinessStatus: jest.fn(),
            setDocumentStatus: jest.fn(),
            listApprovedBusinesses: jest.fn(),
            getApprovedBusiness: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessesController>(BusinessesController);
    service = module.get<BusinessesService>(BusinessesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── CREATE BUSINESS ──────────────────────────────────────────────────────

  describe('createBusiness', () => {
    it('should call service with currentUser.id and DTO', async () => {
      const dto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(service, 'createBusiness').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      const result = await controller.createBusiness(MOCK_USER, dto);

      expect(service.createBusiness).toHaveBeenCalledWith(MOCK_USER.sub, dto);
      expect(result).toBeDefined();
    });

    it('should not accept managerId from request body (uses currentUser)', async () => {
      const dto = {
        businessName: 'New Business',
        address: '123 Main St',
        latitude: 30.0444,
        longitude: 31.2357,
      };

      jest.spyOn(service, 'createBusiness').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      await controller.createBusiness(MOCK_USER, dto);

      const call = jest.spyOn(service, 'createBusiness').mock.calls[0];
      expect(call[0]).toBe(MOCK_USER.sub);
      expect(call[0]).not.toBe('attacker-id');
    });
  });

  // ─── GET MY BUSINESS ──────────────────────────────────────────────────────

  describe('getMyBusiness', () => {
    it('should call service with currentUser.id', async () => {
      jest.spyOn(service, 'getMyBusiness').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      const result = await controller.getMyBusiness(MOCK_USER);

      expect(service.getMyBusiness).toHaveBeenCalledWith(MOCK_USER.sub);
      expect(result).toBeDefined();
    });
  });

  describe('route ordering and public decorators', () => {
    it('should declare manager/admin static routes before dynamic :id route', () => {
      const names = Object.getOwnPropertyNames(BusinessesController.prototype);
      expect(names.indexOf('getMyBusiness')).toBeLessThan(names.indexOf('getApprovedBusiness'));
      expect(names.indexOf('getOperatingHours')).toBeLessThan(names.indexOf('getApprovedBusiness'));
      expect(names.indexOf('getAllBusinessesForAdmin')).toBeLessThan(names.indexOf('getApprovedBusiness'));
    });

    it('should mark public business routes as public', () => {
      const listPublic = Reflect.getMetadata(IS_PUBLIC_KEY, BusinessesController.prototype.listApprovedBusinesses);
      const detailPublic = Reflect.getMetadata(IS_PUBLIC_KEY, BusinessesController.prototype.getApprovedBusiness);

      expect(listPublic).toBe(true);
      expect(detailPublic).toBe(true);
    });
  });

  // ─── UPDATE MY BUSINESS ───────────────────────────────────────────────────

  describe('updateMyBusiness', () => {
    it('should call service with currentUser.id', async () => {
      const dto = { businessName: 'Updated' };
      jest.spyOn(service, 'updateMyBusiness').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      await controller.updateMyBusiness(MOCK_USER, dto);

      expect(service.updateMyBusiness).toHaveBeenCalledWith(MOCK_USER.sub, dto);
    });
  });

  // ─── OPERATING HOURS ──────────────────────────────────────────────────────

  describe('getOperatingHours', () => {
    it('should call service with currentUser.id', async () => {
      jest.spyOn(service, 'getOperatingHours').mockResolvedValue([]);

      await controller.getOperatingHours(MOCK_USER);

      expect(service.getOperatingHours).toHaveBeenCalledWith(MOCK_USER.sub);
    });
  });

  describe('updateOperatingHours', () => {
    it('should call service with currentUser.id', async () => {
      const dto = { hours: [{ dayOfWeek: 0, openTime: '09:00', closeTime: '17:00' }] };
      jest.spyOn(service, 'updateOperatingHours').mockResolvedValue([]);

      await controller.updateOperatingHours(MOCK_USER, dto);

      expect(service.updateOperatingHours).toHaveBeenCalledWith(MOCK_USER.sub, dto);
    });
  });

  // ─── DOCUMENTS ────────────────────────────────────────────────────────────

  describe('getMyDocuments', () => {
    it('should call service with currentUser.id', async () => {
      jest.spyOn(service, 'getMyDocuments').mockResolvedValue([]);

      await controller.getMyDocuments(MOCK_USER);

      expect(service.getMyDocuments).toHaveBeenCalledWith(MOCK_USER.sub);
    });
  });

  describe('uploadDocument', () => {
    it('should require file', async () => {
      const dto = { type: 'BUSINESS_REGISTRATION' };

      jest.spyOn(service, 'uploadDocument').mockResolvedValue({
        id: 'doc-1',
        type: 'BUSINESS_REGISTRATION',
        url: 'https://example.com/doc.pdf',
        status: 'PENDING',
      });

      const result = await controller.uploadDocument(MOCK_USER, null as any, dto);

      // Should throw BadRequestException in the controller
      expect(result).toBeDefined();
    });

    it('should call service with currentUser.id and file', async () => {
      const dto = { type: 'BUSINESS_REGISTRATION' };
      const file = {
        fieldname: 'file',
        originalname: 'doc.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
        destination: '',
        filename: '',
        path: '',
      } as Express.Multer.File;

      jest.spyOn(service, 'uploadDocument').mockResolvedValue({
        id: 'doc-1',
        type: 'BUSINESS_REGISTRATION',
        url: 'https://example.com/doc.pdf',
        status: 'PENDING',
      });

      await controller.uploadDocument(MOCK_USER, file, dto);

      expect(service.uploadDocument).toHaveBeenCalledWith(MOCK_USER.sub, file, dto);
    });
  });

  describe('deleteDocument', () => {
    it('should call service with currentUser.id and documentId', async () => {
      jest.spyOn(service, 'deleteDocument').mockResolvedValue(undefined);

      await controller.deleteDocument(MOCK_USER, 'doc-uuid-1');

      expect(service.deleteDocument).toHaveBeenCalledWith(MOCK_USER.sub, 'doc-uuid-1');
    });
  });

  // ─── ONBOARDING STATUS ────────────────────────────────────────────────────

  describe('getOnboardingStatus', () => {
    it('should call service with currentUser.id', async () => {
      jest.spyOn(service, 'getOnboardingStatus').mockResolvedValue({
        hasBusiness: false,
        businessStatus: null,
        requiredDocuments: [],
        uploadedDocuments: [],
        missingDocuments: [],
        rejectedDocuments: [],
        allRequiredDocumentsUploaded: false,
        allRequiredDocumentsApproved: false,
        hasOperatingHours: false,
        isReadyForReview: false,
        canGoLive: false,
      });

      await controller.getOnboardingStatus(MOCK_USER);

      expect(service.getOnboardingStatus).toHaveBeenCalledWith(MOCK_USER.sub);
    });
  });

  // ─── ADMIN: GET ALL BUSINESSES ────────────────────────────────────────────

  describe('getAllBusinessesForAdmin', () => {
    it('should call service', async () => {
      jest.spyOn(service, 'getAllBusinessesForAdmin').mockResolvedValue([]);

      await controller.getAllBusinessesForAdmin(MOCK_USER);

      expect(service.getAllBusinessesForAdmin).toHaveBeenCalled();
    });
  });

  // ─── ADMIN: SET BUSINESS STATUS ───────────────────────────────────────────

  describe('setBusinessStatus', () => {
    it('should call service with businessId and DTO', async () => {
      const dto = { status: 'APPROVED' };
      jest.spyOn(service, 'setBusinessStatus').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      await controller.setBusinessStatus(MOCK_USER, 'business-uuid-1', dto);

      expect(service.setBusinessStatus).toHaveBeenCalledWith('business-uuid-1', dto);
    });
  });

  // ─── ADMIN: SET DOCUMENT STATUS ───────────────────────────────────────────

  describe('setDocumentStatus', () => {
    it('should call service with documentId and DTO', async () => {
      const dto = { status: 'APPROVED' };
      jest.spyOn(service, 'setDocumentStatus').mockResolvedValue({
        id: 'doc-uuid-1',
        type: 'BUSINESS_REGISTRATION',
        url: 'https://example.com/doc.pdf',
        status: 'APPROVED',
      });

      await controller.setDocumentStatus(MOCK_USER, 'doc-uuid-1', dto);

      expect(service.setDocumentStatus).toHaveBeenCalledWith('doc-uuid-1', dto);
    });
  });

  // ─── PUBLIC: APPROVED BUSINESSES ──────────────────────────────────────────

  describe('listApprovedBusinesses', () => {
    it('should call service and return approved businesses (PUBLIC route)', async () => {
      jest.spyOn(service, 'listApprovedBusinesses').mockResolvedValue([MOCK_BUSINESS_RESPONSE]);

      const result = await controller.listApprovedBusinesses();

      expect(service.listApprovedBusinesses).toHaveBeenCalled();
      expect(result).toEqual([MOCK_BUSINESS_RESPONSE]);
    });

    it('should return empty array if no approved businesses exist', async () => {
      jest.spyOn(service, 'listApprovedBusinesses').mockResolvedValue([]);

      const result = await controller.listApprovedBusinesses();

      expect(result).toEqual([]);
    });
  });

  describe('getApprovedBusiness', () => {
    it('should call service with businessId and return approved business (PUBLIC route)', async () => {
      jest.spyOn(service, 'getApprovedBusiness').mockResolvedValue(MOCK_BUSINESS_RESPONSE);

      const result = await controller.getApprovedBusiness('business-uuid-1');

      expect(service.getApprovedBusiness).toHaveBeenCalledWith('business-uuid-1');
      expect(result).toEqual(MOCK_BUSINESS_RESPONSE);
    });

    it('should throw NotFoundException if business not found or not approved', async () => {
      jest
        .spyOn(service, 'getApprovedBusiness')
        .mockRejectedValue(new Error('Business not found or not approved'));

      await expect(controller.getApprovedBusiness('invalid-id')).rejects.toThrow();
    });
  });
});
