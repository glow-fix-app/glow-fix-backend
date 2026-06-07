import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { BusinessCategoriesResponseDto, CategoryWithServicesDto, ServiceDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all categories with their services for a specific business
   * This is the main endpoint for the UI to display service categories
   */
  async getBusinessCategories(businessId: string): Promise<BusinessCategoriesResponseDto> {
    // Verify business exists and is approved
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        statusHistory: {
          include: { status: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const status = business.statusHistory[0]?.status?.context;
    if (status !== 'APPROVED') {
      throw new NotFoundException('Business is not available');
    }

    // Get all categories
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Get all business services with their details
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
      orderBy: { createdAt: 'asc' },
    });

    // Group services by category
    const categoriesWithServices: CategoryWithServicesDto[] = categories.map(category => ({
      id: category.id,
      name: category.name,
      services: businessServices
        .filter(bs => bs.service.categoryId === category.id)
        .map(bs => ({
          id: bs.service.id,
          business_service_id: bs.id,
          title: bs.service.title,
          description: bs.service.description || undefined,
          price: Number(bs.price),
          duration_minutes: bs.averageDuration,
          is_active: bs.isActive,
        })),
    })).filter(category => category.services.length > 0); // Only return categories with services

    return {
      business_id: business.id,
      business_name: business.businessName,
      categories: categoriesWithServices,
    };
  }

  /**
   * Get services by category for a specific business
   */
  async getServicesByCategory(businessId: string, categoryName: string): Promise<CategoryWithServicesDto | null> {
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

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const businessServices = await this.prisma.businessService.findMany({
      where: {
        businessId: businessId,
        service: { categoryId: category.id },
        isActive: true,
      },
      include: {
        service: true,
      },
      orderBy: { price: 'asc' },
    });

    if (businessServices.length === 0) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      services: businessServices.map(bs => ({
        id: bs.service.id,
        business_service_id: bs.id,
        title: bs.service.title,
        description: bs.service.description || undefined,
        price: Number(bs.price),
        duration_minutes: bs.averageDuration,
        is_active: bs.isActive,
      })),
    };
  }

  /**
   * Get service details by business_service_id (for booking)
   */
  async getServiceDetails(businessServiceId: string): Promise<ServiceDto & { business_id: string; business_name: string }> {
    const businessService = await this.prisma.businessService.findUnique({
      where: { id: businessServiceId },
      include: {
        service: true,
        business: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    if (!businessService) {
      throw new NotFoundException('Service not found');
    }

    return {
      id: businessService.service.id,
      business_service_id: businessService.id,
      title: businessService.service.title,
      description: businessService.service.description || undefined,
      price: Number(businessService.price),
      duration_minutes: businessService.averageDuration,
      is_active: businessService.isActive,
      business_id: businessService.business.id,
      business_name: businessService.business.businessName,
    };
  }

  /**
   * Get all available categories (for filter UI)
   */
  async getAllCategories(): Promise<Array<{ id: string; name: string }>> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}