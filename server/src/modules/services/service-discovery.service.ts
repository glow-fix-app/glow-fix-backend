// modules/services/service-discovery.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  SearchServicesDto,
  SortBy,
  ServiceDiscoveryResponseDto,
  ServiceOfferDto,
  SearchSuggestionsDto,
  PopularServiceDto,
  FilterCategoriesResponseDto,
  FilterOptionDto,
  SearchMetaDto,
} from './dto/service-discovery.dto';

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search services across all providers with full filters
   */
  async searchServices(
    userId: string | null,
    dto: SearchServicesDto,
  ): Promise<{
    data: ServiceDiscoveryResponseDto[];
    meta: SearchMetaDto;
    filters: FilterCategoriesResponseDto;
  }> {
    const {
      query,
      category,
      latitude,
      longitude,
      filters,
      sort_by = SortBy.PRICE_ASC,
      page = 1,
      limit = 20,
    } = dto;

    // Ensure numeric types (query params arrive as strings)
    const pageNum = Number(page);
    const limitNum = Math.min(Number(limit), 50);
    const skip = (pageNum - 1) * limitNum;

    // Get client location if authenticated and not provided
    let userLat = latitude ? Number(latitude) : undefined;
    let userLng = longitude ? Number(longitude) : undefined;

    if (userId && !userLat && !userLng) {
      const clientLocation = await this.getClientLocation(userId);
      if (clientLocation) {
        userLat = clientLocation.latitude;
        userLng = clientLocation.longitude;
      }
    }

    // Extract filters
    const minPrice =
      filters?.min_price !== undefined ? Number(filters.min_price) : undefined;
    const maxPrice =
      filters?.max_price !== undefined ? Number(filters.max_price) : undefined;
    const radius = filters?.radius ? Number(filters.radius) : 20;
    const minRating =
      filters?.min_rating !== undefined
        ? Number(filters.min_rating)
        : undefined;
    const openNow = filters?.open_now;
    const verifiedOnly = filters?.verified_only;
    const selectedCategories: string[] =
      filters?.categories || (category ? [category] : []);
    const selectedLocations: string[] = filters?.locations || [];

    // Build service search query
    const serviceWhere: Prisma.ServiceWhereInput = {};

    if (query) {
      serviceWhere.title = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (selectedCategories.length > 0) {
      serviceWhere.category = {
        name: {
          in: selectedCategories,
          mode: 'insensitive',
        },
      };
    }

    // Get matching services with active business assignments
    const services = await this.prisma.service.findMany({
      where: serviceWhere,
      include: {
        category: true,
        businessServices: {
          where: {
            isActive: true,
            ...(minPrice !== undefined && { price: { gte: minPrice } }),
            ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
          },
          include: {
            business: {
              include: {
                statusHistory: {
                  include: { status: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                operatingHours: true,
              },
            },
          },
        },
      },
    });

    // Process each service and its offers
    const results: ServiceDiscoveryResponseDto[] = [];
    let totalOffersCount = 0;

    for (const service of services) {
      // Filter businesses by approval status
      const activeOffers = service.businessServices.filter((bs) => {
        const latestStatus = bs.business.statusHistory[0]?.status?.context;
        return latestStatus === 'APPROVED';
      });

      if (activeOffers.length === 0) continue;

      // Calculate details for each offer in parallel
      const offersWithDetails = await Promise.all(
        activeOffers.map(async (bs) => {
          let distance = 0;

          if (userLat !== undefined && userLng !== undefined) {
            const businessLocation = await this.getBusinessLocation(
              bs.businessId,
            );
            if (businessLocation) {
              distance = this.calculateDistance(
                userLat!,
                userLng!,
                businessLocation.latitude,
                businessLocation.longitude,
              );
            }
          }

          // Apply radius filter early to skip unnecessary DB calls
          if (
            userLat !== undefined &&
            userLng !== undefined &&
            distance > radius
          ) {
            return null;
          }

          const [ratingSummary, isOpen, isVerified] = await Promise.all([
            this.getBusinessRatingSummary(bs.businessId),
            this.isBusinessOpen(bs.businessId, new Date()),
            this.isBusinessVerified(bs.businessId),
          ]);

          const operatingHoursToday = this.getOperatingHoursToday(
            bs.business.operatingHours,
          );

          // Apply filters
          if (
            minRating !== undefined &&
            ratingSummary.average_rating < minRating
          )
            return null;
          if (openNow && !isOpen) return null;
          if (verifiedOnly && !isVerified) return null;

          // Apply location filter using the real city column (matches discover page)
          if (selectedLocations.length > 0) {
            const businessCity: string = (bs.business as any).city || this.extractCityFromAddress(bs.business.address);
            const matchesLocation = selectedLocations.some(
              (loc) => businessCity.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(businessCity.toLowerCase()),
            );
            const isNearYou =
              selectedLocations.includes('Near you') && distance <= 5;
            if (!matchesLocation && !isNearYou) return null;
          }

          return {
            business_service_id: bs.id,
            business_id: bs.businessId,
            business_name: bs.business.businessName,
            business_address: bs.business.address,
            business_phone: bs.business.contactPhone || undefined,
            distance_km: Math.round(distance * 10) / 10,
            price: Number(bs.price),
            duration_minutes: bs.averageDuration,
            average_rating: ratingSummary.average_rating,
            total_reviews: ratingSummary.total_reviews,
            is_open: isOpen,
            is_verified: isVerified,
            operating_hours_today: operatingHoursToday,
          } as ServiceOfferDto;
        }),
      );

      const validOffers = offersWithDetails.filter(
        (o): o is ServiceOfferDto => o !== null,
      );

      if (validOffers.length === 0) continue;

      this.sortOffers(validOffers, sort_by);

      const totalOffers = validOffers.length;
      totalOffersCount += totalOffers;

      const prices = validOffers.map((o) => o.price);
      const fromPrice = Math.min(...prices);

      results.push({
        service_id: service.id,
        service_name: service.title,
        service_description: service.description || undefined,
        category_id: service.categoryId,
        category_name: service.category.name,
        total_offers: totalOffers,
        provider_count: validOffers.length,
        from_price: fromPrice,
        price_range: {
          min: Math.min(...prices),
          max: Math.max(...prices),
        },
        offers: validOffers,
      });
    }

    this.sortResults(results, sort_by);

    const totalServices = results.length;
    const paginatedResults = results.slice(skip, skip + limitNum);

    const filterOptions = await this.getFilterOptions(
      query,
      userLat,
      userLng,
      radius,
    );

    return {
      data: paginatedResults,
      meta: {
        total_services: totalServices,
        total_offers: totalOffersCount,
        page: pageNum,
        limit: limitNum,
        total_pages: Math.ceil(totalServices / limitNum),
        location_used: !!(userLat !== undefined && userLng !== undefined),
        latitude: userLat,
        longitude: userLng,
      },
      filters: filterOptions,
    };
  }

  /**
   * Get filter options (categories, locations, price ranges)
   */
  async getFilterOptions(
    query?: string,
    latitude?: number,
    longitude?: number,
    radius?: number,
  ): Promise<FilterCategoriesResponseDto> {
    const serviceWhere: Prisma.ServiceWhereInput = {};
    if (query) {
      serviceWhere.title = {
        contains: query,
        mode: 'insensitive',
      };
    }

    const services = await this.prisma.service.findMany({
      where: serviceWhere,
      include: {
        category: true,
        businessServices: {
          where: { isActive: true },
          include: {
            business: {
              include: {
                statusHistory: {
                  include: { status: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    const categoryCount: Record<string, number> = {};
    const locationCount: Record<string, number> = {};

    for (const service of services) {
      for (const bs of service.businessServices) {
        const latestStatus = bs.business.statusHistory[0]?.status?.context;
        if (latestStatus !== 'APPROVED') continue;

        const categoryName = service.category.name;
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;

        // Use the real city column (same source as the discover page)
        const city: string = (bs.business as any).city || this.extractCityFromAddress(bs.business.address);
        if (city) {
          locationCount[city] = (locationCount[city] || 0) + 1;
        }
      }
    }

    if (latitude !== undefined && longitude !== undefined) {
      locationCount['Near you'] = await this.countNearbyLocations(
        latitude,
        longitude,
        radius || 10,
      );
    }

    const categories: FilterOptionDto[] = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count, selected: false }))
      .sort((a, b) => b.count - a.count);

    const locations: FilterOptionDto[] = Object.entries(locationCount)
      .map(([name, count]) => ({ name, count, selected: false }))
      .sort((a, b) => b.count - a.count);

    const priceRanges = await this.getPriceRangeCounts(query);

    return {
      categories,
      locations,
      price_ranges: priceRanges,
    };
  }

  /**
   * Get search suggestions for autocomplete
   */
  async getSearchSuggestions(query: string): Promise<SearchSuggestionsDto> {
    if (!query || query.length < 2) {
      return {
        query,
        service_suggestions: [],
        category_suggestions: [],
      };
    }

    const [services, categories] = await Promise.all([
      this.prisma.service.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: { title: true },
      }),
      this.prisma.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: 3,
        select: { name: true },
      }),
    ]);

    return {
      query,
      service_suggestions: services.map((s) => s.title),
      category_suggestions: categories.map((c) => c.name),
    };
  }

  /**
   * Get popular services for homepage
   * FIX: Use Prisma.sql`` tagged template to ensure proper parameter typing
   */
  async getPopularServices(limit: number = 6): Promise<PopularServiceDto[]> {
    // Ensure limit is a proper integer
    const safeLimit = Math.max(1, Math.min(Number(limit) || 6, 50));

    const results = await this.prisma.$queryRaw<Array<any>>(
      Prisma.sql`
    SELECT 
      s.id AS service_id,
      s.title AS service_name,
      c.name AS category_name,

      COUNT(DISTINCT bs.business_id)::int AS provider_count,

      MIN(bs.price)::float AS min_price,

      COALESCE(AVG(r.rating), 0)::float AS average_rating

    FROM services s
    JOIN categories c 
      ON s.category_id = c.id

    JOIN business_services bs 
      ON s.id = bs.service_id

    LEFT JOIN bookings b 
      ON bs.id = b.business_service_id

    LEFT JOIN reviews r 
      ON b.id = r.booking_id

    WHERE bs.is_active = true

    GROUP BY s.id, s.title, c.name

    ORDER BY provider_count DESC, average_rating DESC

    LIMIT ${Prisma.sql`${safeLimit}`}
  `,
    );
    // const results = await this.prisma.$queryRaw<Array<any>>(
    //   Prisma.sql`
    //     SELECT
    //       s.id AS service_id,
    //       s.title AS service_name,
    //       c.name AS category_name,
    //       COUNT(DISTINCT bs.business_id)::int AS provider_count,
    //       (MIN(bs.price) / 100.0)::float AS min_price,
    //       COALESCE(AVG(r.rating), 0)::float AS average_rating
    //     FROM services s
    //     JOIN categories c ON s.category_id = c.id
    //     JOIN business_services bs ON s.id = bs.service_id
    //     LEFT JOIN bookings b ON bs.id = b.business_service_id
    //     LEFT JOIN reviews r ON b.id = r.booking_id
    //     WHERE bs.is_active = true
    //     GROUP BY s.id, s.title, c.name
    //     ORDER BY provider_count DESC, average_rating DESC
    //     LIMIT ${safeLimit}
    //   `,
    // );

    return results.map((r) => ({
      service_id: r.service_id,
      service_name: r.service_name,
      category_name: r.category_name,
      provider_count: Number(r.provider_count),
      min_price: parseFloat(r.min_price),
      average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
    }));
  }

  /**
   * Get single service details with all providers
   */
  async getServiceWithProviders(
    serviceId: string,
    userId: string | null,
    latitude?: number,
    longitude?: number,
  ): Promise<ServiceDiscoveryResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: true,
        businessServices: {
          where: { isActive: true },
          include: {
            business: {
              include: {
                statusHistory: {
                  include: { status: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                operatingHours: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    let userLat = latitude !== undefined ? Number(latitude) : undefined;
    let userLng = longitude !== undefined ? Number(longitude) : undefined;

    if (userId && userLat === undefined && userLng === undefined) {
      const clientLocation = await this.getClientLocation(userId);
      if (clientLocation) {
        userLat = clientLocation.latitude;
        userLng = clientLocation.longitude;
      }
    }

    const approvedOffers = service.businessServices.filter((bs) => {
      const latestStatus = bs.business.statusHistory[0]?.status?.context;
      return latestStatus === 'APPROVED';
    });

    const offers = await Promise.all(
      approvedOffers.map(async (bs) => {
        let distance = 0;

        if (userLat !== undefined && userLng !== undefined) {
          const businessLocation = await this.getBusinessLocation(
            bs.businessId,
          );
          if (businessLocation) {
            distance = this.calculateDistance(
              userLat!,
              userLng!,
              businessLocation.latitude,
              businessLocation.longitude,
            );
          }
        }

        const [ratingSummary, isOpen, isVerified] = await Promise.all([
          this.getBusinessRatingSummary(bs.businessId),
          this.isBusinessOpen(bs.businessId, new Date()),
          this.isBusinessVerified(bs.businessId),
        ]);

        const operatingHoursToday = this.getOperatingHoursToday(
          bs.business.operatingHours,
        );

        return {
          business_service_id: bs.id,
          business_id: bs.businessId,
          business_name: bs.business.businessName,
          business_address: bs.business.address,
          business_phone: bs.business.contactPhone || undefined,
          distance_km: Math.round(distance * 10) / 10,
          price: Number(bs.price),
          duration_minutes: bs.averageDuration,
          average_rating: ratingSummary.average_rating,
          total_reviews: ratingSummary.total_reviews,
          is_open: isOpen,
          is_verified: isVerified,
          operating_hours_today: operatingHoursToday,
        } as ServiceOfferDto;
      }),
    );

    offers.sort((a, b) => a.price - b.price);

    const prices = offers.map((o) => o.price);

    return {
      service_id: service.id,
      service_name: service.title,
      service_description: service.description || undefined,
      category_id: service.categoryId,
      category_name: service.category.name,
      total_offers: offers.length,
      provider_count: offers.length,
      from_price: prices.length > 0 ? Math.min(...prices) : 0,
      price_range: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
      offers,
    };
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * FIX: Use Prisma.sql with explicit ::uuid cast to avoid "uuid = text" operator error
   */
  private async getClientLocation(
    userId: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    if (!userId) return null;
    const result = await this.prisma.$queryRaw<
      Array<{ latitude: number; longitude: number }>
    >(
      Prisma.sql`
        SELECT
          ST_Y(location::geometry) AS latitude,
          ST_X(location::geometry) AS longitude
        FROM clients
        WHERE user_id = ${userId}::uuid
      `,
    );

    if (!result || result.length === 0) return null;

    return {
      latitude: Number(result[0].latitude),
      longitude: Number(result[0].longitude),
    };
  }

  /**
   * FIX: Use Prisma.sql with explicit ::uuid cast to avoid "uuid = text" operator error
   */
  private async getBusinessLocation(
    businessId: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    if (!businessId) return null;

    const result = await this.prisma.$queryRaw<
      Array<{ latitude: number; longitude: number }>
    >(
      Prisma.sql`
    SELECT
      ST_Y(location::geometry) AS latitude,
      ST_X(location::geometry) AS longitude
    FROM businesses
    WHERE id = ${businessId}::uuid
    LIMIT 1
  `,
    );

    if (!result || result.length === 0) return null;

    return {
      latitude: Number(result[0].latitude),
      longitude: Number(result[0].longitude),
    };
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private async getBusinessRatingSummary(
    businessId: string,
  ): Promise<{ average_rating: number; total_reviews: number }> {
    const result = await this.prisma.review.aggregate({
      where: {
        booking: { businessId },
      },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return {
      average_rating: Math.round((result._avg?.rating || 0) * 10) / 10,
      total_reviews: result._count?._all || 0,
    };
  }

  private async isBusinessOpen(
    businessId: string,
    dateTime: Date,
  ): Promise<boolean> {
    const dayOfWeek = dateTime.getDay();
    const timeStr = dateTime.toTimeString().slice(0, 5);

    const hours = await this.prisma.operatingHour.findFirst({
      where: {
        businessId,
        dayOfWeek,
      },
    });

    if (!hours?.openTime || !hours?.closeTime) return false;

    return timeStr >= hours.openTime && timeStr <= hours.closeTime;
  }

  private getOperatingHoursToday(operatingHours: any[]): string {
    const today = new Date().getDay();
    const todayHours = operatingHours.find((h) => h.dayOfWeek === today);

    if (!todayHours?.openTime || !todayHours?.closeTime) return 'Closed';

    return `${todayHours.openTime} - ${todayHours.closeTime}`;
  }

  private async isBusinessVerified(businessId: string): Promise<boolean> {
    const count = await this.prisma.businessDocument.count({
      where: {
        businessId,
        status: {
          context: 'DOC_ACCEPTED',
        },
      },
    });

    return count >= 2;
  }

  /**
   * Lightweight fallback: extract a usable city label from a freeform address
   * string when the structured `city` column is empty.
   * Returns the first comma-separated token that looks like a place name,
   * or an empty string so callers can decide how to handle it.
   */
  private extractCityFromAddress(address: string): string {
    if (!address) return '';
    // Take the first non-numeric, non-empty token separated by commas or slashes
    const parts = address.split(/[,\/]/).map((s) => s.trim()).filter(Boolean);
    // Skip pure number / street-number tokens and pick the first meaningful word
    const city = parts.find((p) => isNaN(Number(p)) && p.length > 2);
    return city ?? '';
  }

  /**
   * FIX: Use Prisma.sql for proper UUID and numeric parameter handling
   */
  private async countNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<number> {
    const radiusMeters = radiusKm * 1000;
    if (!latitude || !longitude || !radiusMeters) return 0;

    const result = await this.prisma.$queryRaw<Array<{ count: number }>>(
      Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM businesses b
    JOIN business_status bs ON bs.business_id = b.id
    JOIN statuses s ON bs.status_id = s.id
    WHERE s.context = 'APPROVED'
      AND ST_DWithin(
        b.location::geography,
        ST_SetSRID(
          ST_MakePoint(${longitude}::float8, ${latitude}::float8),
          4326
        )::geography,
        ${radiusMeters}::float8
      )
  `,
    );

    return Number(result[0]?.count) || 0;
  }

  private async getPriceRangeCounts(
    query?: string,
  ): Promise<FilterOptionDto[]> {
    const serviceWhere: Prisma.ServiceWhereInput = {};
    if (query) {
      serviceWhere.title = { contains: query, mode: 'insensitive' };
    }

    const ranges = [
      { name: 'Under EGP 100', min: 0, max: 100 },
      { name: 'EGP 100 - 300', min: 100, max: 300 },
      { name: 'EGP 300 - 500', min: 300, max: 500 },
      { name: 'EGP 500 - 1000', min: 500, max: 1000 },
      { name: 'Above EGP 1000', min: 1000, max: null },
    ];

    const priceRanges = await Promise.all(
      ranges.map(async (range) => {
        const count = await this.prisma.service.count({
          where: {
            ...serviceWhere,
            businessServices: {
              some: {
                isActive: true,
                price: {
                  gte: range.min,
                  ...(range.max !== null && { lte: range.max }),
                },
                business: {
                  statusHistory: {
                    some: {
                      status: { context: 'APPROVED' },
                    },
                  },
                },
              },
            },
          },
        });
        return { name: range.name, count, selected: false };
      }),
    );

    return priceRanges;
  }

  private sortOffers(offers: ServiceOfferDto[], sortBy: SortBy): void {
    switch (sortBy) {
      case SortBy.PRICE_ASC:
        offers.sort((a, b) => a.price - b.price);
        break;
      case SortBy.PRICE_DESC:
        offers.sort((a, b) => b.price - a.price);
        break;
      case SortBy.DISTANCE_ASC:
        offers.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case SortBy.RATING_DESC:
        offers.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case SortBy.POPULARITY:
        offers.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
    }
  }

  private sortResults(
    results: ServiceDiscoveryResponseDto[],
    sortBy: SortBy,
  ): void {
    switch (sortBy) {
      case SortBy.PRICE_ASC:
        results.sort((a, b) => a.from_price - b.from_price);
        break;
      case SortBy.PRICE_DESC:
        results.sort((a, b) => b.from_price - a.from_price);
        break;
      case SortBy.RATING_DESC:
        results.sort((a, b) => {
          const avgA =
            a.offers.length > 0
              ? a.offers.reduce((s, o) => s + o.average_rating, 0) /
                a.offers.length
              : 0;
          const avgB =
            b.offers.length > 0
              ? b.offers.reduce((s, o) => s + o.average_rating, 0) /
                b.offers.length
              : 0;
          return avgB - avgA;
        });
        break;
      default:
        break;
    }
  }
}

// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import {
//   SearchServicesDto,
//   SortBy,
//   ServiceDiscoveryResponseDto,
//   ServiceOfferDto,
//   SearchSuggestionsDto,
//   PopularServiceDto,
//   FilterCategoriesResponseDto,
//   FilterOptionDto,
//   SearchMetaDto,
// } from './dto/service-discovery.dto';

// @Injectable()
// export class ServiceDiscoveryService {
//   private readonly logger = new Logger(ServiceDiscoveryService.name);

//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Search services across all providers with full filters
//    */
//   async searchServices(
//     userId: string | null,
//     dto: SearchServicesDto,
//   ): Promise<{ data: ServiceDiscoveryResponseDto[]; meta: SearchMetaDto; filters: FilterCategoriesResponseDto }> {
//     const {
//       query,
//       category,
//       latitude,
//       longitude,
//       filters,
//       sort_by = SortBy.PRICE_ASC,
//       page = 1,
//       limit = 20,
//     } = dto;

//     const skip = (page - 1) * limit;
//     const take = Math.min(limit, 50);

//     // Get client location if authenticated
//     let userLat = latitude;
//     let userLng = longitude;

//     if (userId && !userLat && !userLng) {
//       const clientLocation = await this.getClientLocation(userId);
//       if (clientLocation) {
//         userLat = clientLocation.latitude;
//         userLng = clientLocation.longitude;
//       }
//     }

//     // Apply filters from nested filters object or top-level params
//     const minPrice = filters?.min_price;
//     const maxPrice = filters?.max_price;
//     const radius = filters?.radius || 20;
//     const minRating = filters?.min_rating;
//     const openNow = filters?.open_now;
//     const verifiedOnly = filters?.verified_only;
//     const selectedCategories = filters?.categories || (category ? [category] : []);
//     const selectedLocations = filters?.locations || [];

//     // Build service search query
//     const serviceWhere: any = {};

//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }

//     if (selectedCategories.length > 0) {
//       serviceWhere.category = {
//         name: {
//           in: selectedCategories,
//           mode: 'insensitive',
//         },
//       };
//     }

//     // Get matching services
//     const services = await this.prisma.service.findMany({
//       where: serviceWhere,
//       include: {
//         category: true,
//         businessServices: {
//           where: {
//             isActive: true,
//             ...(minPrice !== undefined && { price: { gte: minPrice * 100 } }),
//             ...(maxPrice !== undefined && { price: { lte: maxPrice * 100 } }),
//           },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//                 operatingHours: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // Process each service and its offers
//     const results: ServiceDiscoveryResponseDto[] = [];
//     let totalOffersCount = 0;

//     for (const service of services) {
//       // Filter businesses by approval status
//       let activeOffers = service.businessServices.filter(bs => {
//         const latestStatus = bs.business.statusHistory[0]?.status?.context;
//         return latestStatus === 'APPROVED';
//       });

//       if (activeOffers.length === 0) continue;

//       // Calculate distance and details for each offer
//       let offersWithDetails = await Promise.all(
//         activeOffers.map(async (bs) => {
//           let distance = 0;
//           let isOpen = false;
//           let operatingHoursToday = '';
//           let isVerified = false;

//           // Get business location and calculate distance
//           if (userLat && userLng) {
//             const businessLocation = await this.getBusinessLocation(bs.businessId);
//             if (businessLocation) {
//               distance = this.calculateDistance(
//                 userLat,
//                 userLng,
//                 businessLocation.latitude,
//                 businessLocation.longitude,
//               );
//             }
//           }

//           // Check if open
//           isOpen = await this.isBusinessOpen(bs.businessId, new Date());
//           operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);

//           // Check if verified
//           isVerified = await this.isBusinessVerified(bs.businessId);

//           const ratingSummary = await this.getBusinessRatingSummary(bs.businessId);

//           // Apply radius filter
//           if (userLat && userLng && radius && distance > radius) {
//             return null;
//           }

//           // Apply min rating filter
//           if (minRating && ratingSummary.average_rating < minRating) {
//             return null;
//           }

//           // Apply open now filter
//           if (openNow && !isOpen) {
//             return null;
//           }

//           // Apply verified only filter
//           if (verifiedOnly && !isVerified) {
//             return null;
//           }

//           // Apply location filter (by area name)
//           if (selectedLocations.length > 0) {
//             const businessArea = this.extractLocationArea(bs.business.address);
//             if (!selectedLocations.includes(businessArea) && !selectedLocations.includes('Near you')) {
//               return null;
//             }
//             // Special "Near you" filter - within 5km
//             if (selectedLocations.includes('Near you') && distance > 5) {
//               return null;
//             }
//           }

//           return {
//             business_service_id: bs.id,
//             business_id: bs.businessId,
//             business_name: bs.business.businessName,
//             business_address: bs.business.address,
//             business_phone: bs.business.contactPhone || undefined,
//             distance_km: Math.round(distance * 10) / 10,
//             price: Number(bs.price) / 100,
//             duration_minutes: bs.averageDuration,
//             average_rating: ratingSummary.average_rating,
//             total_reviews: ratingSummary.total_reviews,
//             is_open: isOpen,
//             is_verified: isVerified,
//             operating_hours_today: operatingHoursToday,
//           };
//         }),
//       );

//       // Remove null offers
//       const validOffers = offersWithDetails.filter(o => o !== null) as ServiceOfferDto[];

//       if (validOffers.length === 0) continue;

//       // Apply sorting to offers
//       this.sortOffers(validOffers, sort_by);

//       // Paginate offers for this service
//       const paginatedOffers = validOffers.slice(0, take);
//       const totalOffers = validOffers.length;
//       totalOffersCount += totalOffers;

//       // Calculate price range
//       const prices = validOffers.map(o => o.price);
//       const fromPrice = Math.min(...prices);

//       results.push({
//         service_id: service.id,
//         service_name: service.title,
//         service_description: service.description || undefined,
//         category_id: service.categoryId,
//         category_name: service.category.name,
//         total_offers: totalOffers,
//         provider_count: validOffers.length,
//         from_price: fromPrice,
//         price_range: {
//           min: Math.min(...prices),
//           max: Math.max(...prices),
//         },
//         offers: paginatedOffers,
//       });
//     }

//     // Sort results
//     this.sortResults(results, sort_by);

//     // Apply pagination to results
//     const paginatedResults = results.slice(skip, skip + take);
//     const totalServices = results.length;

//     // Get filter options
//     const filterOptions = await this.getFilterOptions(query, userLat, userLng, radius);

//     return {
//       data: paginatedResults,
//       meta: {
//         total_services: totalServices,
//         total_offers: totalOffersCount,
//         page,
//         limit,
//         total_pages: Math.ceil(totalServices / limit),
//         location_used: !!(userLat && userLng),
//         latitude: userLat,
//         longitude: userLng,
//       },
//       filters: filterOptions,
//     };
//   }

//   /**
//    * Get filter options (categories, locations, price ranges)
//    */
//   async getFilterOptions(
//     query?: string,
//     latitude?: number,
//     longitude?: number,
//     radius?: number,
//   ): Promise<FilterCategoriesResponseDto> {
//     // Build base query for services
//     const serviceWhere: any = {};
//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }

//     // Get services with their business_services
//     const services = await this.prisma.service.findMany({
//       where: serviceWhere,
//       include: {
//         category: true,
//         businessServices: {
//           where: { isActive: true },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // Count categories
//     const categoryCount: Record<string, number> = {};
//     const locationCount: Record<string, number> = {};

//     for (const service of services) {
//       for (const bs of service.businessServices) {
//         const latestStatus = bs.business.statusHistory[0]?.status?.context;
//         if (latestStatus !== 'APPROVED') continue;

//         // Count category
//         const categoryName = service.category.name;
//         categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;

//         // Count location
//         const locationArea = this.extractLocationArea(bs.business.address);
//         if (locationArea) {
//           locationCount[locationArea] = (locationCount[locationArea] || 0) + 1;
//         }
//       }
//     }

//     // Add "Near you" location if coordinates provided
//     if (latitude && longitude) {
//       locationCount['Near you'] = await this.countNearbyLocations(latitude, longitude, radius || 10);
//     }

//     // Format categories
//     const categories: FilterOptionDto[] = Object.entries(categoryCount)
//       .map(([name, count]) => ({ name, count, selected: false }))
//       .sort((a, b) => b.count - a.count);

//     // Format locations
//     const locations: FilterOptionDto[] = Object.entries(locationCount)
//       .map(([name, count]) => ({ name, count, selected: false }))
//       .sort((a, b) => b.count - a.count);

//     // Price ranges with counts
//     const priceRanges = await this.getPriceRangeCounts(query);

//     return {
//       categories,
//       locations,
//       price_ranges: priceRanges,
//     };
//   }

//   /**
//    * Get search suggestions for autocomplete
//    */
//   async getSearchSuggestions(query: string): Promise<SearchSuggestionsDto> {
//     if (!query || query.length < 2) {
//       return {
//         query,
//         service_suggestions: [],
//         category_suggestions: [],
//       };
//     }

//     // Search services
//     const services = await this.prisma.service.findMany({
//       where: {
//         title: {
//           contains: query,
//           mode: 'insensitive',
//         },
//       },
//       take: 5,
//     });

//     // Search categories
//     const categories = await this.prisma.category.findMany({
//       where: {
//         name: {
//           contains: query,
//           mode: 'insensitive',
//         },
//       },
//       take: 3,
//     });

//     return {
//       query,
//       service_suggestions: services.map(s => s.title),
//       category_suggestions: categories.map(c => c.name),
//     };
//   }

//   /**
//    * Get popular services for homepage
//    */
//   async getPopularServices(limit: number = 6): Promise<PopularServiceDto[]> {
//     const results = await this.prisma.$queryRaw<Array<any>>`
//       SELECT
//         s.id as service_id,
//         s.title as service_name,
//         c.name as category_name,
//         COUNT(DISTINCT bs.business_id) as provider_count,
//         MIN(bs.price) / 100 as min_price,
//         COALESCE(AVG(r.rating), 0) as average_rating
//       FROM services s
//       JOIN categories c ON s.category_id = c.id
//       JOIN business_service bs ON s.id = bs.service_id
//       LEFT JOIN bookings b ON bs.id = b.business_service_id
//       LEFT JOIN reviews r ON b.id = r.booking_id
//       WHERE bs.is_active = true
//       GROUP BY s.id, c.name
//       ORDER BY provider_count DESC, average_rating DESC
//       LIMIT ${limit}
//     `;

//     return results.map(r => ({
//       service_id: r.service_id,
//       service_name: r.service_name,
//       category_name: r.category_name,
//       provider_count: parseInt(r.provider_count, 10),
//       min_price: parseFloat(r.min_price),
//       average_rating: Math.round(parseFloat(r.average_rating) * 10) / 10,
//     }));
//   }

//   /**
//    * Get single service details with all providers
//    */
//   async getServiceWithProviders(
//     serviceId: string,
//     userId: string | null,
//     latitude?: number,
//     longitude?: number,
//   ): Promise<ServiceDiscoveryResponseDto> {
//     const service = await this.prisma.service.findUnique({
//       where: { id: serviceId },
//       include: {
//         category: true,
//         businessServices: {
//           where: { isActive: true },
//           include: {
//             business: {
//               include: {
//                 statusHistory: {
//                   include: { status: true },
//                   orderBy: { createdAt: 'desc' },
//                   take: 1,
//                 },
//                 operatingHours: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!service) {
//       throw new Error('Service not found');
//     }

//     // Get client location if not provided
//     let userLat = latitude;
//     let userLng = longitude;

//     if (userId && !userLat && !userLng) {
//       const clientLocation = await this.getClientLocation(userId);
//       if (clientLocation) {
//         userLat = clientLocation.latitude;
//         userLng = clientLocation.longitude;
//       }
//     }

//     // Filter approved businesses
//     const approvedOffers = service.businessServices.filter(bs => {
//       const latestStatus = bs.business.statusHistory[0]?.status?.context;
//       return latestStatus === 'APPROVED';
//     });

//     // Build offers with details
//     const offers = await Promise.all(
//       approvedOffers.map(async (bs) => {
//         let distance = 0;

//         if (userLat && userLng) {
//           const businessLocation = await this.getBusinessLocation(bs.businessId);
//           if (businessLocation) {
//             distance = this.calculateDistance(
//               userLat,
//               userLng,
//               businessLocation.latitude,
//               businessLocation.longitude,
//             );
//           }
//         }

//         const ratingSummary = await this.getBusinessRatingSummary(bs.businessId);
//         const isOpen = await this.isBusinessOpen(bs.businessId, new Date());
//         const operatingHoursToday = this.getOperatingHoursToday(bs.business.operatingHours);
//         const isVerified = await this.isBusinessVerified(bs.businessId);

//         return {
//           business_service_id: bs.id,
//           business_id: bs.businessId,
//           business_name: bs.business.businessName,
//           business_address: bs.business.address,
//           business_phone: bs.business.contactPhone || undefined,
//           distance_km: Math.round(distance * 10) / 10,
//           price: Number(bs.price) / 100,
//           duration_minutes: bs.averageDuration,
//           average_rating: ratingSummary.average_rating,
//           total_reviews: ratingSummary.total_reviews,
//           is_open: isOpen,
//           is_verified: isVerified,
//           operating_hours_today: operatingHoursToday,
//         };
//       }),
//     );

//     // Sort by price by default
//     offers.sort((a: ServiceOfferDto, b: ServiceOfferDto) => a.price - b.price);

//     const prices = offers.map((o: ServiceOfferDto) => o.price);

//     return {
//       service_id: service.id,
//       service_name: service.title,
//       service_description: service.description || undefined,
//       category_id: service.categoryId,
//       category_name: service.category.name,
//       total_offers: offers.length,
//       provider_count: offers.length,
//       from_price: prices.length > 0 ? Math.min(...prices) : 0,
//       price_range: {
//         min: prices.length > 0 ? Math.min(...prices) : 0,
//         max: prices.length > 0 ? Math.max(...prices) : 0,
//       },
//       offers,
//     };
//   }

//   // ==================== PRIVATE HELPERS ====================

//   private async getClientLocation(userId: string): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number }>>`
//       SELECT
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM clients
//       WHERE user_id = ${userId}
//     `;

//     if (!result || result.length === 0) {
//       return null;
//     }

//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }

//   private async getBusinessLocation(businessId: string): Promise<{ latitude: number; longitude: number } | null> {
//     const result = await this.prisma.$queryRaw<Array<{ latitude: number; longitude: number }>>`
//       SELECT
//         ST_Y(location::geometry) as latitude,
//         ST_X(location::geometry) as longitude
//       FROM businesses
//       WHERE id = ${businessId}
//     `;

//     if (!result || result.length === 0) {
//       return null;
//     }

//     return {
//       latitude: result[0].latitude,
//       longitude: result[0].longitude,
//     };
//   }

//   private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//     const R = 6371;
//     const dLat = this.toRadians(lat2 - lat1);
//     const dLon = this.toRadians(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   private toRadians(degrees: number): number {
//     return degrees * (Math.PI / 180);
//   }

//   private async getBusinessRatingSummary(businessId: string): Promise<{ average_rating: number; total_reviews: number }> {
//     const result = await this.prisma.review.aggregate({
//       where: {
//         booking: { businessId: businessId },
//       },
//       _avg: { rating: true },
//       _count: { _all: true },
//     });

//     return {
//       average_rating: Math.round((result._avg?.rating || 0) * 10) / 10,
//       total_reviews: result._count?._all || 0,
//     };
//   }

//   private async isBusinessOpen(businessId: string, dateTime: Date): Promise<boolean> {
//     const dayOfWeek = dateTime.getDay();
//     const timeStr = dateTime.toTimeString().slice(0, 5);

//     const hours = await this.prisma.operatingHour.findFirst({
//       where: {
//         businessId: businessId,
//         dayOfWeek: dayOfWeek,
//       },
//     });

//     if (!hours || !hours.openTime || !hours.closeTime) {
//       return false;
//     }

//     return timeStr >= hours.openTime && timeStr <= hours.closeTime;
//   }

//   private getOperatingHoursToday(operatingHours: any[]): string {
//     const today = new Date().getDay();
//     const todayHours = operatingHours.find(h => h.dayOfWeek === today);

//     if (!todayHours || !todayHours.openTime || !todayHours.closeTime) {
//       return 'Closed';
//     }

//     return `${todayHours.openTime} - ${todayHours.closeTime}`;
//   }

//   private async isBusinessVerified(businessId: string): Promise<boolean> {
//     const documents = await this.prisma.businessDocument.findMany({
//       where: {
//         businessId: businessId,
//         status: {
//           context: 'DOC_ACCEPTED',
//         },
//       },
//     });

//     return documents.length >= 2;
//   }

//   private extractLocationArea(address: string): string {
//     const areas = ['Zamalek', 'Maadi', 'Heliopolis', 'Downtown', 'Mohandessin', 'Nasr City', 'New Cairo'];
//     for (const area of areas) {
//       if (address.toLowerCase().includes(area.toLowerCase())) {
//         return area;
//       }
//     }
//     return 'Other';
//   }

//   private async countNearbyLocations(latitude: number, longitude: number, radiusKm: number): Promise<number> {
//     const radiusMeters = radiusKm * 1000;
//     const result = await this.prisma.$queryRaw<Array<{ count: number }>>`
//       SELECT COUNT(*)::int as count
//       FROM businesses b
//       WHERE EXISTS (
//         SELECT 1 FROM business_status bs
//         WHERE bs.business_id = b.id
//           AND bs.status_id = (SELECT id FROM statuses WHERE context = 'APPROVED')
//       )
//       AND ST_DWithin(
//         b.location,
//         ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
//         ${radiusMeters}
//       )
//     `;
//     return result[0]?.count || 0;
//   }

//   private async getPriceRangeCounts(query?: string): Promise<FilterOptionDto[]> {
//     const serviceWhere: any = {};
//     if (query) {
//       serviceWhere.title = {
//         contains: query,
//         mode: 'insensitive',
//       };
//     }

//     const ranges = [
//       { name: 'Under EGP 100', min: 0, max: 100 },
//       { name: 'EGP 100 - 300', min: 100, max: 300 },
//       { name: 'EGP 300 - 500', min: 300, max: 500 },
//       { name: 'EGP 500 - 1000', min: 500, max: 1000 },
//       { name: 'Above EGP 1000', min: 1000, max: null },
//     ];

//     const priceRanges: FilterOptionDto[] = [];

//     for (const range of ranges) {
//       const whereCondition: any = {
//         ...serviceWhere,
//         businessServices: {
//           some: {
//             isActive: true,
//             price: {
//               ...(range.min !== undefined && { gte: range.min * 100 }),
//               ...(range.max != null && { lte: range.max * 100 }),
//             },
//             business: {
//               statusHistory: {
//                 some: {
//                   status: { context: 'APPROVED' },
//                 },
//               },
//             },
//           },
//         },
//       };

//       const count = await this.prisma.service.count({ where: whereCondition });
//       priceRanges.push({
//         name: range.name,
//         count,
//         selected: false,
//       });
//     }

//     return priceRanges;
//   }

//   private sortOffers(offers: ServiceOfferDto[], sortBy: SortBy): void {
//     switch (sortBy) {
//       case SortBy.PRICE_ASC:
//         offers.sort((a, b) => a.price - b.price);
//         break;
//       case SortBy.PRICE_DESC:
//         offers.sort((a, b) => b.price - a.price);
//         break;
//       case SortBy.DISTANCE_ASC:
//         offers.sort((a, b) => a.distance_km - b.distance_km);
//         break;
//       case SortBy.RATING_DESC:
//         offers.sort((a, b) => b.average_rating - a.average_rating);
//         break;
//       case SortBy.POPULARITY:
//         offers.sort((a, b) => b.total_reviews - a.total_reviews);
//         break;
//     }
//   }

//   private sortResults(results: ServiceDiscoveryResponseDto[], sortBy: SortBy): void {
//     switch (sortBy) {
//       case SortBy.PRICE_ASC:
//         results.sort((a, b) => a.from_price - b.from_price);
//         break;
//       case SortBy.PRICE_DESC:
//         results.sort((a, b) => b.from_price - a.from_price);
//         break;
//       case SortBy.RATING_DESC:
//         results.sort((a, b) => {
//           const avgRatingA = a.offers.reduce((sum, o) => sum + o.average_rating, 0) / a.offers.length;
//           const avgRatingB = b.offers.reduce((sum, o) => sum + o.average_rating, 0) / b.offers.length;
//           return avgRatingB - avgRatingA;
//         });
//         break;
//       default:
//         break;
//     }
//   }
// }
