import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { validate as isUUID } from 'uuid';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  AssignServiceToBusinessDto,
  BulkAssignServicesDto,
} from './dto/assign-service-to-business.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';

const businessServiceInclude = {
  business: true,
  service: {
    include: {
      category: true,
    },
  },
} as const;

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createCategory(adminId: string, dto: CreateCategoryDto) {
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
    return category;
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async deleteCategory(adminId: string, categoryId: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        services: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.services.length > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${category.services.length} service(s). Delete or reassign services first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    this.logger.log(`Category deleted: ${category.name} by admin ${adminId}`);
    return { message: 'Category deleted successfully' };
  }

  async createService(adminId: string, dto: CreateServiceDto) {
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
    return service;
  }

  async getAllServices(categoryId?: string) {
    const where: Record<string, unknown> = {};

    if (categoryId) {
      if (!isUUID(categoryId)) {
        throw new BadRequestException('Invalid categoryId format');
      }

      where.categoryId = categoryId;
    }

    return this.prisma.service.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async getServiceById(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async updateService(adminId: string, serviceId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
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
    return updatedService;
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
        `Cannot delete service assigned to ${service.businessServices.length} business(es). Remove assignments first.`,
      );
    }

    await this.prisma.service.delete({
      where: { id: serviceId },
    });

    this.logger.log(`Service deleted from catalog: ${service.title} by admin ${adminId}`);
    return { message: 'Service deleted successfully' };
  }

  async getAssignedBusinessServices(managerId: string, businessId: string) {
    await this.verifyBusinessOwnership(managerId, businessId);

    return this.prisma.businessService.findMany({
      where: {
        businessId,
      },
      include: businessServiceInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUnassignedBusinessServices(managerId: string, businessId: string) {
    await this.verifyBusinessOwnership(managerId, businessId);

    const assignedServices = await this.prisma.businessService.findMany({
      where: { businessId },
      select: { serviceId: true },
    });

    const assignedServiceIds = assignedServices.map((service) => service.serviceId);

    return this.prisma.service.findMany({
      where: {
        id: { notIn: assignedServiceIds },
      },
      include: {
        category: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async assignServiceToBusiness(
    managerId: string,
    businessId: string,
    dto: AssignServiceToBusinessDto,
  ) {
    await this.verifyBusinessOwnership(managerId, businessId);
    await this.assertNoDuplicateBusinessService(businessId, dto.service_id);

    const service = await this.assertServiceExists(dto.service_id);

    const businessService = await this.prisma.businessService.create({
      data: {
        businessId,
        serviceId: dto.service_id,
        price: BigInt(dto.price * 100),
        averageDuration: dto.average_duration,
        isActive: dto.is_active ?? true,
      },
      include: businessServiceInclude,
    });

    this.logger.log(
      `Service "${service.title}" assigned to business ${businessId} by manager ${managerId} with price ${dto.price} EGP`,
    );

    this.eventEmitter.emit('business.service_assigned', {
      businessId,
      serviceId: dto.service_id,
      serviceTitle: service.title,
      price: dto.price,
      duration: dto.average_duration,
    });

    return businessService;
  }

  async bulkAssignServicesToBusiness(
    managerId: string,
    businessId: string,
    dto: BulkAssignServicesDto,
  ) {
    await this.verifyBusinessOwnership(managerId, businessId);

    const serviceIds = dto.services.map((serviceDto) => serviceDto.service_id);
    const uniqueServiceIds = new Set(serviceIds);

    if (uniqueServiceIds.size !== serviceIds.length) {
      throw new ConflictException('Duplicate service IDs found in request payload');
    }

    const services = await this.prisma.service.findMany({
      where: {
        id: { in: serviceIds },
      },
      include: {
        category: true,
      },
    });

    if (services.length !== serviceIds.length) {
      const foundIds = new Set(services.map((service) => service.id));
      const missingServiceId = serviceIds.find((serviceId) => !foundIds.has(serviceId));
      throw new NotFoundException(
        `Service not found in catalog: ${missingServiceId}`,
      );
    }

    const existingAssignments = await this.prisma.businessService.findMany({
      where: {
        businessId,
        serviceId: { in: serviceIds },
      },
      select: {
        serviceId: true,
      },
    });

    if (existingAssignments.length > 0) {
      throw new ConflictException('One or more services are already assigned to this business');
    }

    const dtoByServiceId = new Map(
      dto.services.map((serviceDto) => [serviceDto.service_id, serviceDto]),
    );

    const createdBusinessServices = await this.prisma.$transaction(
      dto.services.map((serviceDto) =>
        this.prisma.businessService.create({
          data: {
            businessId,
            serviceId: serviceDto.service_id,
            price: BigInt(serviceDto.price * 100),
            averageDuration: serviceDto.average_duration,
            isActive: serviceDto.is_active ?? true,
          },
          include: businessServiceInclude,
        }),
      ),
    );

    for (const createdBusinessService of createdBusinessServices) {
      const assignedDto = dtoByServiceId.get(createdBusinessService.serviceId);
      this.eventEmitter.emit('business.service_assigned', {
        businessId,
        serviceId: createdBusinessService.serviceId,
        serviceTitle: createdBusinessService.service.title,
        price: assignedDto?.price,
        duration: assignedDto?.average_duration,
      });
    }

    this.logger.log(
      `Bulk assigned ${createdBusinessServices.length} services to business ${businessId} by manager ${managerId}`,
    );

    return createdBusinessServices;
  }

  async getBusinessServiceById(businessServiceId: string) {
    const businessService = await this.prisma.businessService.findUnique({
      where: { id: businessServiceId },
      include: businessServiceInclude,
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    return businessService;
  }

  async updateAssignedBusinessService(
    managerId: string,
    businessId: string,
    businessServiceId: string,
    dto: UpdateBusinessServiceDto,
  ) {
    await this.verifyBusinessOwnership(managerId, businessId);
    await this.getBusinessServiceOrThrow(businessServiceId, businessId);

    const updateData: Record<string, unknown> = {};

    if (dto.price !== undefined) {
      updateData.price = BigInt(dto.price * 100);
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
      include: businessServiceInclude,
    });

    this.logger.log(`Business service ${businessServiceId} updated by manager ${managerId}`);

    this.eventEmitter.emit('business.service_updated', {
      businessId,
      businessServiceId,
      updates: Object.keys(dto),
    });

    return updated;
  }

  async toggleAssignedBusinessService(
    managerId: string,
    businessId: string,
    businessServiceId: string,
  ) {
    await this.verifyBusinessOwnership(managerId, businessId);

    const businessService = await this.getBusinessServiceOrThrow(
      businessServiceId,
      businessId,
    );

    const updated = await this.prisma.businessService.update({
      where: { id: businessServiceId },
      data: {
        isActive: !businessService.isActive,
      },
    });

    const status = updated.isActive ? 'activated' : 'deactivated';
    this.logger.log(`Business service ${businessServiceId} ${status} by manager ${managerId}`);

    return updated;
  }

  async removeAssignedBusinessService(
    managerId: string,
    businessId: string,
    businessServiceId: string,
  ): Promise<{ message: string }> {
    await this.verifyBusinessOwnership(managerId, businessId);

    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId,
      },
      include: {
        service: true,
      },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    const activeBookings = await this.prisma.bookingItem.findFirst({
      where: {
        businessServiceId,
        booking: {
          statusHistory: {
            none: {
              status: { name: { in: ['COMPLETED', 'CANCELLED'] } },
            },
          },
        },
      },
    });

    if (activeBookings) {
      await this.prisma.businessService.update({
        where: { id: businessServiceId },
        data: { isActive: false },
      });

      return {
        message: 'Service deactivated due to existing bookings',
      };
    }

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

  async getAvailableServicesForBusiness(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.businessService.findMany({
      where: {
        businessId,
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
  }

  async getAvailableServicesByCategory(businessId: string, categoryName: string) {
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

    return this.prisma.businessService.findMany({
      where: {
        businessId,
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
  }

  async verifyBusinessOwnership(managerId: string, businessId: string): Promise<void> {
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

  async assertServiceExists(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found in catalog');
    }

    return service;
  }

  async assertBusinessServiceBelongsToBusiness(
    businessServiceId: string,
    businessId: string,
  ): Promise<void> {
    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId,
      },
      select: { id: true },
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }
  }

  async assertNoDuplicateBusinessService(
    businessId: string,
    serviceId: string,
  ): Promise<void> {
    const existing = await this.prisma.businessService.findFirst({
      where: {
        businessId,
        serviceId,
      },
    });

    if (existing) {
      throw new ConflictException('Service already assigned to this business');
    }
  }

  async getBusinessServiceOrThrow(businessServiceId: string, businessId: string) {
    const businessService = await this.prisma.businessService.findFirst({
      where: {
        id: businessServiceId,
        businessId,
      },
      include: businessServiceInclude,
    });

    if (!businessService) {
      throw new NotFoundException('Business service not found');
    }

    return businessService;
  }
}
