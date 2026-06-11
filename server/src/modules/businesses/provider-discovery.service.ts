// modules/businesses/provider-discovery.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  SearchProvidersDto,
  ProviderSortBy,
  ServiceType,
  ProviderResponseDto,
  ProviderDiscoveryResponseDto,
  ProviderFilterOptionsDto,
} from './dto/provider-discovery.dto';

@Injectable()
export class ProviderDiscoveryService {
  private readonly logger = new Logger(ProviderDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search and discover providers with filters and sorting
   */
  async searchProviders(
    userId: string | null,
    dto: SearchProvidersDto,
  ): Promise<ProviderDiscoveryResponseDto> {
    const {
      search,
      latitude,
      longitude,
      filters,
      sort_by = ProviderSortBy.HIGHEST_RATED,
      page = 1,
      limit = 20,
    } = dto;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    // Get user location if authenticated and no location provided
    let userLat = latitude;
    let userLng = longitude;

    if (userId && !userLat && !userLng) {
      const clientLocation = await this.getClientLocation(userId);
      if (clientLocation) {
        userLat = clientLocation.latitude;
        userLng = clientLocation.longitude;
      }
    }

    // Get approved status ID
    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          total_pages: 0,
          location_used: false,
        },
        filters: await this.getFilterOptions(userLat, userLng),
      };
    }

    const approvedStatusId = approvedStatus.id;

    // Build the base SELECT clause
    let sql = Prisma.sql`
      SELECT 
        b.id,
        b.business_name,
        b.address,
        b.city,
        b.contact_phone,
        b.contact_email,
        b.created_at,
    `;

    // Add distance calculation if location provided
    if (userLat && userLng) {
      sql = Prisma.sql`
        ${sql}
        ROUND((ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography) / 1000)::numeric, 1) as distance_km,
      `;
    } else {
      sql = Prisma.sql`
        ${sql}
        NULL as distance_km,
      `;
    }

    // Add aggregates, subqueries, FROM, and WHERE — but NO GROUP BY here
    sql = Prisma.sql`
      ${sql}
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(DISTINCT r.id) as total_reviews,
      EXISTS (
        SELECT 1 FROM business_documents bd 
        WHERE bd.business_id = b.id 
        AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)
      ) as is_verified,
      EXISTS (
        SELECT 1 FROM operating_hours oh 
        WHERE oh.business_id = b.id 
        AND oh.day_of_week = EXTRACT(DOW FROM NOW())
        AND oh.open_time::time <= CURRENT_TIME
        AND oh.close_time::time >= CURRENT_TIME
      ) as is_open,
      (
        SELECT COALESCE(json_agg(
          json_build_object(
            'business_service_id', bs.id,
            'service_id', s.id,
            'service_name', s.title,
            'price', bs.price / 100,
            'duration_minutes', bs.average_duration
          )
        ), '[]'::json)
        FROM business_service bs
        JOIN services s ON bs.service_id = s.id
        WHERE bs.business_id = b.id AND bs.is_active = true
      ) as offers
      FROM businesses b
      LEFT JOIN bookings bk ON b.id = bk.business_id
      LEFT JOIN reviews r ON bk.id = r.booking_id
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatusId}::uuid
      )
    `;

    // Apply search filter
    if (search) {
      sql = Prisma.sql`
        ${sql}
        AND b.business_name ILIKE ${`%${search}%`}
      `;
    }

    // Apply service type filter
    if (filters?.service) {
      if (filters.service === ServiceType.WASH) {
        sql = Prisma.sql`
          ${sql}
          AND EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Wash'
          )
          AND NOT EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Repair'
          )
        `;
      } else if (filters.service === ServiceType.REPAIR) {
        sql = Prisma.sql`
          ${sql}
          AND EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Repair'
          )
          AND NOT EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Wash'
          )
        `;
      } else if (filters.service === ServiceType.BOTH) {
        sql = Prisma.sql`
          ${sql}
          AND EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Wash'
          )
          AND EXISTS (
            SELECT 1 FROM business_service bs 
            JOIN services s ON bs.service_id = s.id 
            JOIN categories c ON s.category_id = c.id 
            WHERE bs.business_id = b.id 
            AND c.name = 'Repair'
          )
        `;
      }
    }

    // Apply city filter (uses the structured `city` column and the freeform `address` as fallback)
    if (filters?.city) {
      sql = Prisma.sql`
        ${sql}
        AND (b.city ILIKE ${`%${filters.city}%`} OR b.address ILIKE ${`%${filters.city}%`})
      `;
    } else if (filters?.locations && filters.locations.length > 0) {
      // Fallback: filter by any of the supplied city names
      const cityConditions = filters.locations.map(
        (loc) => Prisma.sql`(b.city ILIKE ${`%${loc}%`} OR b.address ILIKE ${`%${loc}%`})`,
      );
      sql = Prisma.sql`
        ${sql}
        AND (${Prisma.join(cityConditions, ' OR ')})
      `;
    }

    // Apply open now filter
    if (filters?.open_now) {
      sql = Prisma.sql`
        ${sql}
        AND EXISTS (
          SELECT 1 FROM operating_hours oh 
          WHERE oh.business_id = b.id 
          AND oh.day_of_week = EXTRACT(DOW FROM NOW())
          AND oh.open_time::time <= CURRENT_TIME
          AND oh.close_time::time >= CURRENT_TIME
        )
      `;
    }

    // Apply verified only filter
    if (filters?.verified_only) {
      sql = Prisma.sql`
        ${sql}
        AND EXISTS (
          SELECT 1 FROM business_documents bd 
          WHERE bd.business_id = b.id 
          AND bd.status_id = (SELECT id FROM statuses WHERE context = 'DOC_ACCEPTED' LIMIT 1)
        )
      `;
    }

    // GROUP BY comes after all WHERE/AND conditions
    sql = Prisma.sql`
      ${sql}
      GROUP BY b.id
    `;

    // Apply HAVING filters (aggregate filters)
    const havingConditions: string[] = [];

    if (filters?.min_rating) {
      havingConditions.push(`AVG(r.rating) >= ${filters.min_rating}`);
    }

    if (havingConditions.length > 0) {
      sql = Prisma.sql`
        ${sql}
        HAVING ${Prisma.raw(havingConditions.join(' AND '))}
      `;
    }

    // Apply sorting
    sql = Prisma.sql`
      ${sql}
      ${Prisma.raw(this.getSortingClause(sort_by, userLat, userLng))}
    `;

    // Apply pagination
    sql = Prisma.sql`
      ${sql}
      LIMIT ${take} OFFSET ${skip}
    `;

    // Execute query
    const providers = await this.prisma.$queryRaw<any[]>(sql);

    // Apply max distance filter (post-query, since it's a spatial calculation)
    let filteredProviders = providers;
    if (userLat && userLng && filters?.max_distance) {
      filteredProviders = providers.filter(
        (p) => p.distance_km !== null && p.distance_km <= filters.max_distance!,
      );
    }

    // Get total count
    const total = filteredProviders.length;

    // Get business locations for providers
    const businessIds = filteredProviders.map((p) => p.id);
    const locationsMap = await this.getBusinessLocationsBatch(businessIds);

    // Format response
    const formattedProviders: ProviderResponseDto[] = await Promise.all(
      filteredProviders.map(async (provider) => {
        const coords = locationsMap.get(provider.id) || {
          latitude: 0,
          longitude: 0,
        };

        // Determine service type
        let serviceType: string = 'both';
        const offers = provider.offers || [];
        const hasWash = offers.some((o: any) =>
          o?.service_name?.toLowerCase().includes('wash'),
        );
        const hasRepair = offers.some(
          (o: any) =>
            o?.service_name && !o.service_name.toLowerCase().includes('wash'),
        );

        if (hasWash && !hasRepair) serviceType = 'Wash';
        else if (!hasWash && hasRepair) serviceType = 'Repair';
        else if (hasWash && hasRepair) serviceType = 'both';

        return {
          id: provider.id,
          business_name: provider.business_name,
          address: provider.address,
          city: provider.city ?? null,
          contact_phone: provider.contact_phone || undefined,
          contact_email: provider.contact_email || undefined,
          distance_km: provider.distance_km
            ? parseFloat(provider.distance_km)
            : 0,
          average_rating:
            Math.round(parseFloat(provider.average_rating) * 10) / 10,
          total_reviews: parseInt(provider.total_reviews, 10),
          is_open:
            provider.is_open === true ||
            provider.is_open === 1 ||
            provider.is_open === 't',
          is_verified:
            provider.is_verified === true ||
            provider.is_verified === 1 ||
            provider.is_verified === 't',
          service_type: serviceType,
          offers: (provider.offers || []).map((offer: any) => ({
            business_service_id: offer?.business_service_id,
            service_id: offer?.service_id,
            service_name: offer?.service_name || 'Service',
            price: parseFloat(offer?.price || 0),
            duration_minutes: offer?.duration_minutes || 60,
          })),
          operating_hours_today: await this.getOperatingHoursToday(provider.id),
          latitude: coords.latitude,
          longitude: coords.longitude,
          created_at: provider.created_at,
        };
      }),
    );

    // Fall back to rating sort if nearest requested but no location
    if (sort_by === ProviderSortBy.NEAREST && !userLat && !userLng) {
      formattedProviders.sort((a, b) => b.average_rating - a.average_rating);
    }

    // Get filter options
    const filterOptions = await this.getFilterOptions(userLat, userLng);

    return {
      data: formattedProviders.slice(0, take),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        location_used: !!(userLat && userLng),
        latitude: userLat,
        longitude: userLng,
      },
      filters: filterOptions,
    };
  }

  /**
   * Get filter options for UI
   */
  async getFilterOptions(
    latitude?: number,
    longitude?: number,
  ): Promise<ProviderFilterOptionsDto> {
    const approvedStatus = await this.prisma.status.findFirst({
      where: { context: 'APPROVED' },
    });

    if (!approvedStatus) {
      return {
        service_types: [],
        rating_ranges: [],
        distance_ranges: [],
        locations: [],
      };
    }

    const approvedStatusId = approvedStatus.id;

    // Get service type counts
    const serviceTypeCounts = await this.prisma.$queryRaw<
      Array<{ service_type: string; count: number }>
    >`
      SELECT 
        CASE 
          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')
            AND EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')
          THEN 'both'
          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Wash')
          THEN 'Wash'
          WHEN EXISTS (SELECT 1 FROM business_service bs JOIN services s ON bs.service_id = s.id JOIN categories c ON s.category_id = c.id WHERE bs.business_id = b.id AND c.name = 'Repair')
          THEN 'Repair'
          ELSE 'unknown'
        END as service_type,
        COUNT(*) as count
      FROM businesses b
      WHERE EXISTS (
        SELECT 1 FROM business_status bs 
        WHERE bs.business_id = b.id 
          AND bs.status_id = ${approvedStatusId}::uuid
      )
      GROUP BY service_type
    `;

    // Get rating distribution
    const ratingDistribution = await this.prisma.$queryRaw<
      Array<{ rating_range: string; count: number }>
    >`
      SELECT 
        rating_range,
        COUNT(*) as count
      FROM (
        SELECT 
          b.id,
          CASE 
            WHEN COALESCE(AVG(r.rating), 0) >= 4.5 THEN '4.5+'
            WHEN COALESCE(AVG(r.rating), 0) >= 4 THEN '4+'
            WHEN COALESCE(AVG(r.rating), 0) >= 3 THEN '3+'
            ELSE 'Any'
          END as rating_range
        FROM businesses b
        LEFT JOIN bookings bk ON b.id = bk.business_id
        LEFT JOIN reviews r ON bk.id = r.booking_id
        WHERE EXISTS (
          SELECT 1 FROM business_status bs 
          WHERE bs.business_id = b.id 
            AND bs.status_id = ${approvedStatusId}::uuid
        )
        GROUP BY b.id
      ) sub
      GROUP BY rating_range
    `;

    // Get distance ranges if location provided
    let distanceRanges: Array<{ distance_range: string; count: number }> = [];

    if (latitude && longitude) {
      distanceRanges = await this.prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000 <= 10 THEN '≤ 10 km'
            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000 <= 25 THEN '≤ 25 km'
            WHEN ST_Distance(b.location, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) / 1000 <= 50 THEN '≤ 50 km'
            ELSE '> 50 km'
          END as distance_range,
          COUNT(*) as count
        FROM businesses b
        WHERE EXISTS (
          SELECT 1 FROM business_status bs 
          WHERE bs.business_id = b.id 
            AND bs.status_id = ${approvedStatusId}::uuid
        )
        GROUP BY distance_range
      `;
    }

    // Get distinct cities with provider counts
    const cityCounts = await this.prisma.$queryRaw<
      Array<{ city: string; count: number }>
    >`
      SELECT 
        b.city,
        COUNT(*) as count
      FROM businesses b
      WHERE b.city IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM business_status bs 
          WHERE bs.business_id = b.id 
            AND bs.status_id = ${approvedStatusId}::uuid
        )
      GROUP BY b.city
      ORDER BY count DESC, b.city ASC
    `;

    return {
      service_types: serviceTypeCounts.map((st) => ({
        name: st.service_type === 'both' ? 'Wash & Repair' : st.service_type,
        count: Number(st.count),
        selected: false,
      })),
      rating_ranges: [
        { name: 'Any', min: 0, max: 5, count: 0, selected: false },
        { name: '4.5+', min: 4.5, max: 5, count: 0, selected: false },
        { name: '4+', min: 4, max: 5, count: 0, selected: false },
        { name: '3+', min: 3, max: 5, count: 0, selected: false },
      ].map((range) => {
        const dist = ratingDistribution.find(
          (r) => r.rating_range === range.name,
        );
        return {
          ...range,
          count: dist ? Number(dist.count) : 0,
          selected: false,
        };
      }),
      distance_ranges: distanceRanges.map((dr) => ({
        name: dr.distance_range,
        max_km: parseFloat(dr.distance_range.match(/\d+/)?.toString() || '0'),
        count: Number(dr.count),
        selected: false,
      })),
      locations: cityCounts.map((c) => ({
        name: c.city,
        count: Number(c.count),
        selected: false,
      })),
    };
  }

  /**
   * Get sorting clause for SQL query
   */
  private getSortingClause(
    sortBy: ProviderSortBy,
    latitude?: number,
    longitude?: number,
  ): string {
    switch (sortBy) {
      case ProviderSortBy.HIGHEST_RATED:
        return ' ORDER BY average_rating DESC, total_reviews DESC ';
      case ProviderSortBy.NEAREST:
        if (latitude && longitude) {
          return ' ORDER BY distance_km NULLS LAST ';
        }
        return ' ORDER BY average_rating DESC ';
      case ProviderSortBy.MOST_REVIEWS:
        return ' ORDER BY total_reviews DESC, average_rating DESC ';
      case ProviderSortBy.NEWEST:
        return ' ORDER BY b.created_at DESC ';
      case ProviderSortBy.OLDEST:
        return ' ORDER BY b.created_at ASC ';
      default:
        return ' ORDER BY average_rating DESC ';
    }
  }

  /**
   * Get client location from database
   */
  private async getClientLocation(
    userId: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    const result = await this.prisma.$queryRaw<
      Array<{ latitude: number | null; longitude: number | null }>
    >`
      SELECT 
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM clients 
      WHERE user_id = ${userId}::uuid
    `;

    if (!result || result.length === 0 || result[0].latitude === null || result[0].longitude === null) {
      return null;
    }

    return {
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };
  }

  /**
   * Get business locations in batch
   */
  private async getBusinessLocationsBatch(
    ids: string[],
  ): Promise<Map<string, { latitude: number; longitude: number }>> {
    if (ids.length === 0) return new Map();

    const results = await this.prisma.$queryRaw<
      Array<{ id: string; latitude: number; longitude: number }>
    >`
      SELECT 
        id,
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM businesses
      WHERE id = ANY(${ids}::uuid[])
    `;

    const map = new Map();
    for (const row of results) {
      map.set(row.id, {
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
      });
    }
    return map;
  }

  /**
   * Get operating hours for today as readable string
   */
  private async getOperatingHoursToday(businessId: string): Promise<string> {
    const today = new Date().getDay();
    const hours = await this.prisma.operatingHour.findFirst({
      where: {
        businessId,
        dayOfWeek: today,
      },
    });

    if (!hours || !hours.openTime || !hours.closeTime) {
      return 'Closed';
    }

    return `${hours.openTime} - ${hours.closeTime}`;
  }
}