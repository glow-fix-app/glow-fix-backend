import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AssignServiceToBusinessDto, BulkAssignServicesDto } from './dto/assign-service-to-business.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
import {
  ServiceCatalogResponseDto,
  AssignedBusinessServiceResponseDto,
  CategoryResponseDto,
  BulkAssignResponseDto,
  AvailableServiceDto,
} from './dto/service-response.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== CATEGORY MANAGEMENT (Admin) ====================

  async createCategory(adminId: string, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name.toUpperCase() },
    });

    if (existingCategory) {
      throw new ConflictException(`Category '${dto.name}' already exists`);
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name.toUpperCase(),
      },
    });

    this.logger.log(`Category created: ${category.name} by admin ${adminId}`);

    return {
      id: category.id,
      name: category.name,
      created_at: category.createdAt,
    };
  }

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map(c => ({
      id: c.id,
      name: c.name,
      created_at: c.createdAt,
    }));
  }

  async getCategoryById(categoryId: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: category.id,
      name: category.name,
      created_at: category.createdAt,
    };
  }

  async deleteCategory(adminId: string, categoryId: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        services: {
          include: {
            businessServices: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.services.length > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category.services.length} service(s). Delete or reassign services first.`
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    this.logger.log(`Category deleted: ${category.name} by admin ${adminId}`);

    return { message: 'Category deleted successfully' };
  }

  // ==================== SERVICE CATALOG MANAGEMENT (Admin only - NO price) ====================

  async createService(adminId: string, dto: CreateServiceDto): Promise<ServiceCatalogResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.category_id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const service = await this.prisma.service.create({
      data: {
        categoryId: dto.category_id,
        title: dto.title,
        description: dto.description,
      },
      include: { category: true },
    });

    this.logger.log(`Service created in catalog: ${service.title} by admin ${adminId}`);

    return {
      id: service.id,
      category_id: service.categoryId,
      category_name: service.category.name,
      title: service.title,
      description: service.description || undefined,
      created_at: service.createdAt,
      updated_at: service.updatedAt,
    };
  }

  async getAllServices(categoryId?: string): Promise<ServiceCatalogResponseDto[]> {
  const where: any = {};

  if (categoryId) {
    if (!isUUID(categoryId)) {
      throw new BadRequestException('Invalid categoryId format');
    }

    where.categoryId = categoryId;
  }

  const services = await this.prisma.service.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { title: 'asc' },
  });

  return services.map(s => ({
    id: s.id,
    category_id: s.categoryId,
    category_name: s.category.name,
    title: s.title,
    description: s.description || undefined,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  }));
}

  async getServiceById(serviceId: string): Promise<ServiceCatalogResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      id: service.id,
      category_id: service.categoryId,
      category_name: service.category.name,
      title: service.title,
      description: service.description || undefined,
      created_at: service.createdAt,
      updated_at: service.updatedAt,
    };
  }

  async updateService(
    adminId: string,
    serviceId: string,
    dto: UpdateServiceDto,
  ): Promise<ServiceCatalogResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (dto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.category_id },
      });
      if (!category) {
        throw new NotFoundException('Target category not found');
      }
    }

    const updatedService = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        categoryId: dto.category_id,
        title: dto.title,
        description: dto.description,
      },
      include: { category: true },
    });

    this.logger.log(`Service updated in catalog: ${updatedService.title} by admin ${adminId}`);

    return {
      id: updatedService.id,
      category_id: updatedService.categoryId,
      category_name: updatedService.category.name,
      title: updatedService.title,
      description: updatedService.description || undefined,
      created_at: updatedService.createdAt,
      updated_at: updatedService.updatedAt,
    };
  }

  async deleteService(adminId: string, serviceId: string): Promise<{ message: string }> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        businessServices: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.businessServices.length > 0) {
      throw new BadRequestException(
        `Cannot delete service assigned to ${service.businessServices.length} business(es). Remove assignments first.`
      );
    }

    await this.prisma.service.delete({
      where: { id: serviceId },
    });

    this.logger.log(`Service deleted from catalog: ${service.title} by admin ${adminId}`);

    return { message: 'Service deleted successfully' };
  }

  // ==================== BUSINESS SERVICE ASSIGNMENT (Manager assigns price & duration) ====================

  async assignServiceToBusiness(
    managerId: string,
    businessId: string,
    dto: AssignServiceToBusinessDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    await this.verifyBusinessOwnership(managerId, businessId);

    // Verify service exists in catalog
    const service = await this.prisma.service.findUnique({
      where: { id: dto.service_id },
      include: { category: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found in catalog');
    }

    // Check if service already assigned to this business
    const existing = await this.prisma.businessService.findFirst({
      where: {
        businessId: businessId,
        serviceId: dto.service_id,
      },
    });

    if (existing) {
      throw new ConflictException('Service already assigned to this business');
    }

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    const businessService = await this.prisma.businessService.create({
      data: {
        businessId: businessId,
        serviceId: dto.service_id,
        price: dto.price * 100, // Store in cents (e.g., 120 EGP = 12000 cents)
        averageDuration: dto.average_duration,
        isActive: dto.is_active ?? true,
      },
    });

    this.logger.log(
      `Service "${service.title}" assigned to business ${businessId} by manager ${managerId} with price ${dto.price} EGP`
    );

    this.eventEmitter.emit('business.service_assigned', {
      businessId,
      serviceId: dto.service_id,
      serviceTitle: service.title,
      price: dto.price,
      duration: dto.average_duration,
    });

    return {
      id: businessService.id,
      business_id: businessId,
      business_name: business?.businessName || '',
      service_id: service.id,
      service_title: service.title,
      service_description: service.description || undefined,
      category_id: service.categoryId,
      category_name: service.category.name,
      price: dto.price,
      average_duration: businessService.averageDuration,
      is_active: businessService.isActive,
      created_at: businessService.createdAt,
      updated_at: businessService.updatedAt,
    };
  }

  async bulkAssignServicesToBusiness(
    managerId: string,
    businessId: string,
    dto: BulkAssignServicesDto,
  ): Promise<BulkAssignResponseDto> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const assignedServices: AssignedBusinessServiceResponseDto[] = [];
    const skippedServices: string[] = [];

    for (const serviceDto of dto.services) {
      try {
        const result = await this.assignServiceToBusiness(managerId, businessId, serviceDto);
        assignedServices.push(result);
      } catch (error: any) {
        skippedServices.push(serviceDto.service_id);
        this.logger.warn(`Failed to assign service ${serviceDto.service_id}: ${error.message}`);
      }
    }

    return {
      success: true,
      assigned_count: assignedServices.length,
      skipped_count: skippedServices.length,
      assigned_services: assignedServices,
      skipped_services: skippedServices,
    };
  }

  // ==================== BUSINESS SERVICE MANAGEMENT ====================

  async getBusinessServices(
    businessId: string,
    includeInactive: boolean = false,
    categoryId?: string,
  ): Promise<AssignedBusinessServiceResponseDto[]> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const where: any = {
      businessId: businessId,
    };

    if (!includeInactive) {
      where.isActive = true;
    }

    if (categoryId) {
      where.service = { categoryId: categoryId };
    }

    const businessServices = await this.prisma.businessService.findMany({
      where,
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return businessServices.map(bs => ({
      id: bs.id,
      business_id: businessId,
      business_name: business.businessName,
      service_id: bs.service.id,
      service_title: bs.service.title,
      service_description: bs.service.description || undefined,
      category_id: bs.service.category.id,
      category_name: bs.service.category.name,
      price: Number(bs.price) / 100, // Convert from cents to EGP
      average_duration: bs.averageDuration,
      is_active: bs.isActive,
      created_at: bs.createdAt,
      updated_at: bs.updatedAt,
    }));
  }

  async getBusinessServiceById(businessServiceId: string): Promise<AssignedBusinessServiceResponseDto> {
    const businessService = await this.prisma.businessService.findUnique({
      where: { id: businessServiceId },
      include: {
        business: true,
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    return {
      id: businessService.id,
      business_id: businessService.businessId,
      business_name: businessService.business.businessName,
      service_id: businessService.service.id,
      service_title: businessService.service.title,
      service_description: businessService.service.description || undefined,
      category_id: businessService.service.category.id,
      category_name: businessService.service.category.name,
      price: Number(businessService.price) / 100,
      average_duration: businessService.averageDuration,
      is_active: businessService.isActive,
      created_at: businessService.createdAt,
      updated_at: businessService.updatedAt,
    };
  }

  async updateBusinessService(
    managerId: string,
    businessId: string,
    businessServiceId: string,
    dto: UpdateBusinessServiceDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId: businessId,
      },
      include: {
        business: true,
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    const updateData: any = {};

    if (dto.price !== undefined) {
      updateData.price = dto.price * 100; // Convert to cents
    }

    if (dto.average_duration !== undefined) {
      updateData.averageDuration = dto.average_duration;
    }

    if (dto.is_active !== undefined) {
      updateData.isActive = dto.is_active;
    }

    const updated = await this.prisma.businessService.update({
      where: { id: businessServiceId },
      data: updateData,
      include: {
        business: true,
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    this.logger.log(`Business service ${businessServiceId} updated by manager ${managerId}`);

    this.eventEmitter.emit('business.service_updated', {
      businessId,
      businessServiceId,
      updates: Object.keys(dto),
    });

    return {
      id: updated.id,
      business_id: updated.businessId,
      business_name: updated.business.businessName,
      service_id: updated.service.id,
      service_title: updated.service.title,
      service_description: updated.service.description || undefined,
      category_id: updated.service.category.id,
      category_name: updated.service.category.name,
      price: Number(updated.price) / 100,
      average_duration: updated.averageDuration,
      is_active: updated.isActive,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    };
  }

  async removeServiceFromBusiness(
    managerId: string,
    businessId: string,
    businessServiceId: string,
  ): Promise<{ message: string }> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId: businessId,
      },
      include: {
        service: true,
      },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    // Check if there are active bookings using this service
    const activeBookings = await this.prisma.bookingItem.findFirst({
      where: {
        businessServiceId: businessServiceId,
        booking: {
          statusHistory: {
            none: {
              status: { context: { in: ['COMPLETED', 'CANCELLED'] } },
            },
          },
        },
      },
    });

    if (activeBookings) {
      // Soft delete - just deactivate
      await this.prisma.businessService.update({
        where: { id: businessServiceId },
        data: { isActive: false },
      });
      return {
        message: 'Service deactivated due to existing bookings',
      };
    }

    // Hard delete if no bookings
    await this.prisma.businessService.delete({
      where: { id: businessServiceId },
    });

    this.logger.log(`Business service ${businessServiceId} removed by manager ${managerId}`);

    this.eventEmitter.emit('business.service_removed', {
      businessId,
      businessServiceId,
      serviceTitle: businessService.service.title,
    });

    return { message: 'Service removed from business' };
  }

  async toggleServiceStatus(
    managerId: string,
    businessId: string,
    businessServiceId: string,
  ): Promise<{ is_active: boolean; message: string }> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId: businessId,
      },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    const updated = await this.prisma.businessService.update({
      where: { id: businessServiceId },
      data: {
        isActive: !businessService.isActive,
      },
    });

    const status = updated.isActive ? 'activated' : 'deactivated';
    this.logger.log(`Business service ${businessServiceId} ${status} by manager ${managerId}`);

    return {
      is_active: updated.isActive,
      message: `Service ${status} successfully`,
    };
  }

  // ==================== PUBLIC DISCOVERY (For Clients) ====================

  async getAvailableServicesForBusiness(businessId: string): Promise<AvailableServiceDto[]> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const businessServices = await this.prisma.businessService.findMany({
      where: {
        businessId: businessId,
        isActive: true,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });

    return businessServices.map(bs => ({
      business_service_id: bs.id,
      service_id: bs.service.id,
      title: bs.service.title,
      description: bs.service.description || undefined,
      category_name: bs.service.category.name,
      price: Number(bs.price) / 100,
      duration_minutes: bs.averageDuration,
    }));
  }

  async getAvailableServicesByCategory(
    businessId: string,
    categoryName: string,
  ): Promise<AvailableServiceDto[]> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: 'insensitive',
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryName}' not found`);
    }

    const businessServices = await this.prisma.businessService.findMany({
      where: {
        businessId: businessId,
        isActive: true,
        service: {
          categoryId: category.id,
        },
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });

    return businessServices.map(bs => ({
      business_service_id: bs.id,
      service_id: bs.service.id,
      title: bs.service.title,
      description: bs.service.description || undefined,
      category_name: bs.service.category.name,
      price: Number(bs.price) / 100,
      duration_minutes: bs.averageDuration,
    }));
  }

  async getUnassignedServicesForBusiness(
    managerId: string,
    businessId: string,
  ): Promise<ServiceCatalogResponseDto[]> {
    await this.verifyBusinessOwnership(managerId, businessId);

    // Get all service IDs already assigned to this business
    const assignedServices = await this.prisma.businessService.findMany({
      where: { businessId: businessId },
      select: { serviceId: true },
    });

    const assignedServiceIds = assignedServices.map(s => s.serviceId);

    // Get unassigned services from catalog
    const unassignedServices = await this.prisma.service.findMany({
      where: {
        id: { notIn: assignedServiceIds },
      },
      include: {
        category: true,
      },
      orderBy: { title: 'asc' },
    });

    return unassignedServices.map(s => ({
      id: s.id,
      category_id: s.categoryId,
      category_name: s.category.name,
      title: s.title,
      description: s.description || undefined,
      created_at: s.createdAt,
      updated_at: s.updatedAt,
    }));
  }

  // ==================== PRIVATE HELPERS ====================

  async verifyBusinessOwnership(managerId: string, businessId: string): Promise<void> {
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        managerId: managerId,
      },
    });

    if (!business) {
      throw new ForbiddenException('You do not own this business');
    }
  }
}
