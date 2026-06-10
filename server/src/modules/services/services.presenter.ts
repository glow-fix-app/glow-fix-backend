import { Injectable } from '@nestjs/common';
import {
  ActionMessageEntity,
  AssignedBusinessServiceEntity,
  AvailableServiceEntity,
  BulkAssignBusinessServicesResponseEntity,
  CategorySummaryEntity,
  ServiceEntity,
  ToggleBusinessServiceResponseEntity,
  UnassignedServiceEntity,
} from './entities';

@Injectable()
export class ServicesPresenter {
  toCategoryEntity(category: any): CategorySummaryEntity {
    return {
      id: category.id,
      name: category.name,
      created_at: category.createdAt,
    };
  }

  toCategoryEntities(categories: any[]): CategorySummaryEntity[] {
    return categories.map((category) => this.toCategoryEntity(category));
  }

  toServiceEntity(service: any): ServiceEntity {
    return {
      id: service.id,
      category_id: service.categoryId,
      category_name: service.category?.name ?? service.category_name,
      title: service.title,
      description: service.description ?? undefined,
      created_at: service.createdAt,
      updated_at: service.updatedAt,
    };
  }

  toServiceEntities(services: any[]): ServiceEntity[] {
    return services.map((service) => this.toServiceEntity(service));
  }

  toUnassignedServiceEntity(service: any): UnassignedServiceEntity {
    return this.toServiceEntity(service);
  }

  toUnassignedServiceEntities(services: any[]): UnassignedServiceEntity[] {
    return services.map((service) => this.toUnassignedServiceEntity(service));
  }

  toAssignedBusinessServiceEntity(businessService: any): AssignedBusinessServiceEntity {
    return {
      id: businessService.id,
      business_id: businessService.businessId,
      business_name: businessService.business?.businessName ?? '',
      service_id: businessService.serviceId,
      service_title: businessService.service?.title ?? '',
      service_description: businessService.service?.description ?? undefined,
      category_id: businessService.service?.category?.id ?? '',
      category_name: businessService.service?.category?.name ?? '',
      price: Number(businessService.price) / 100,
      average_duration: businessService.averageDuration,
      is_active: businessService.isActive,
      created_at: businessService.createdAt,
      updated_at: businessService.updatedAt,
    };
  }

  toAssignedBusinessServiceEntities(businessServices: any[]): AssignedBusinessServiceEntity[] {
    return businessServices.map((businessService) =>
      this.toAssignedBusinessServiceEntity(businessService),
    );
  }

  toAvailableServiceEntity(businessService: any): AvailableServiceEntity {
    return {
      business_service_id: businessService.id,
      service_id: businessService.service.id,
      title: businessService.service.title,
      description: businessService.service.description ?? undefined,
      category_name: businessService.service.category.name,
      price: Number(businessService.price) / 100,
      duration_minutes: businessService.averageDuration,
    };
  }

  toAvailableServiceEntities(businessServices: any[]): AvailableServiceEntity[] {
    return businessServices.map((businessService) =>
      this.toAvailableServiceEntity(businessService),
    );
  }

  toBulkAssignResponseEntity(
    businessServices: any[],
  ): BulkAssignBusinessServicesResponseEntity {
    return {
      success: true,
      assigned_count: businessServices.length,
      skipped_count: 0,
      assigned_services: this.toAssignedBusinessServiceEntities(businessServices),
      skipped_services: [],
    };
  }

  toToggleBusinessServiceResponseEntity(
    businessService: any,
  ): ToggleBusinessServiceResponseEntity {
    const status = businessService.isActive ? 'activated' : 'deactivated';

    return {
      is_active: businessService.isActive,
      message: `Service ${status} successfully`,
    };
  }

  toActionMessageEntity(message: string): ActionMessageEntity {
    return { message };
  }
}
