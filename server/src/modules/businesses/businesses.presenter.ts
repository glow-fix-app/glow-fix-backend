import { Injectable } from '@nestjs/common';
import {
  PublicBusinessOperatingHourEntity,
  PublicBusinessProfileEntity,
  PublicBusinessServiceCategoryEntity,
  PublicBusinessServiceEntity,
} from './entities';

@Injectable()
export class BusinessesPresenter {
  toPublicBusinessProfileEntity(business: any): PublicBusinessProfileEntity {
    const operatingHours = this.toPublicOperatingHours(business.operatingHours || []);
    const groupedCategories = this.groupServicesByCategory(business.businessServices || []);
    const todayDayOfWeek = new Date().getDay();
    const todayHours =
      operatingHours.find((hour) => hour.day_of_week === todayDayOfWeek) ?? null;
    const isOpen = this.computeIsOpen(todayHours);

    return {
      id: business.id,
      business_name: business.businessName,
      address: business.address,
      contact_phone: business.contactPhone ?? null,
      contact_email: business.contactEmail ?? null,
      latitude: business.latitude ?? null,
      longitude: business.longitude ?? null,
      latest_status: business.statusHistory?.[0]?.status?.name ?? null,
      rating: business.rating ?? null,
      reviews_count: business.reviews_count ?? 0,
      is_open: isOpen,
      today_hours: todayHours,
      categories: groupedCategories,
      about: {
        operating_hours: operatingHours,
      },
      created_at: business.createdAt,
      updated_at: business.updatedAt,
    };
  }

  private toPublicOperatingHours(hours: any[]): PublicBusinessOperatingHourEntity[] {
    return hours
      .slice()
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .map((hour) => ({
        day_of_week: hour.dayOfWeek,
        open_time: hour.openTime ?? null,
        close_time: hour.closeTime ?? null,
        is_closed: !hour.openTime || !hour.closeTime,
      }));
  }

  private groupServicesByCategory(
    businessServices: any[],
  ): PublicBusinessServiceCategoryEntity[] {
    const categoryMap = new Map<string, PublicBusinessServiceCategoryEntity>();

    for (const businessService of businessServices) {
      const category = businessService.service.category;
      const categoryId = category.id;

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          category_id: categoryId,
          category_name: category.name,
          services_count: 0,
          services: [],
        });
      }

      const mappedService: PublicBusinessServiceEntity = {
        business_service_id: businessService.id,
        service_id: businessService.service.id,
        service_title: businessService.service.title,
        description: businessService.service.description ?? null,
        category_id: category.id,
        category_name: category.name,
        price: Number(businessService.price) / 100,
        average_duration: businessService.averageDuration,
        is_active: businessService.isActive,
      };

      const existingCategory = categoryMap.get(categoryId)!;
      existingCategory.services.push(mappedService);
      existingCategory.services_count = existingCategory.services.length;
    }

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.category_name.localeCompare(b.category_name),
    );
  }

  private computeIsOpen(todayHours: PublicBusinessOperatingHourEntity | null): boolean {
    if (!todayHours || todayHours.is_closed || !todayHours.open_time || !todayHours.close_time) {
      return false;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = this.timeToMinutes(todayHours.open_time);
    const closeMinutes = this.timeToMinutes(todayHours.close_time);

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
