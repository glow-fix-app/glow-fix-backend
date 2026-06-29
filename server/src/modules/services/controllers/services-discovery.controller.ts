import {
  Controller,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ServiceDiscoveryService } from '../service-discovery.service';
import {
  FilterCategoriesResponseDto,
  PopularServiceDto,
  SearchServicesDto,
  SearchSuggestionsDto,
  ServiceDiscoveryResponseDto,
  SortBy,
} from '../dto/service-discovery.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Services')
@Controller({ path: 'services', version: '1' })
export class ServicesDiscoveryController {
  constructor(private readonly serviceDiscoveryService: ServiceDiscoveryService) { }

  // ==================== SERVICE DISCOVERY (CLIENT SEARCH) ====================

  @Get('discover/search')
  @Public()
  @ApiOperation({ summary: 'Search services across all providers (client discovery)' })
  @ApiQuery({ name: 'query', required: false, description: 'Service name to search' })
  @ApiQuery({ name: 'category', required: false, description: 'Single category filter (shorthand)' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'User latitude' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'User longitude' })
  @ApiQuery({ name: 'filters[radius]', required: false, type: Number, description: 'Search radius in km (default: 20)' })
  @ApiQuery({ name: 'filters[min_price]', required: false, type: Number, description: 'Minimum price (EGP)' })
  @ApiQuery({ name: 'filters[max_price]', required: false, type: Number, description: 'Maximum price (EGP)' })
  @ApiQuery({ name: 'filters[min_rating]', required: false, type: Number, description: 'Minimum rating (0-5)' })
  @ApiQuery({ name: 'filters[open_now]', required: false, type: Boolean, description: 'Only show open businesses' })
  @ApiQuery({ name: 'filters[verified_only]', required: false, type: Boolean, description: 'Only verified providers' })
  @ApiQuery({ name: 'filters[categories][]', required: false, type: [String], description: 'Category filter list' })
  @ApiQuery({ name: 'filters[locations][]', required: false, type: [String], description: 'Location filter list' })
  @ApiQuery({ name: 'sort_by', required: false, enum: SortBy, description: 'Sort order' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 50)' })
  async searchServices(
    @CurrentUser() user: any,
    @Query() dto: SearchServicesDto,
  ): Promise<{ data: ServiceDiscoveryResponseDto[]; meta: any; filters: FilterCategoriesResponseDto }> {
    return this.serviceDiscoveryService.searchServices(user?.id || null, dto);
  }

  @Get('discover/filters')
  @Public()
  @ApiOperation({ summary: 'Get available filter options (categories, locations, price ranges)' })
  @ApiQuery({ name: 'query', required: false, description: 'Optional search query to scope filters' })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  async getFilterOptions(
    @Query('query') query?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('radius') radius?: string,
  ): Promise<FilterCategoriesResponseDto> {
    return this.serviceDiscoveryService.getFilterOptions(
      query,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
      radius ? parseFloat(radius) : undefined,
    );
  }

  @Get('discover/suggestions')
  @Public()
  @ApiOperation({ summary: 'Get search suggestions for autocomplete' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query (min 2 chars)' })
  async getSearchSuggestions(
    @Query('q') query: string,
  ): Promise<SearchSuggestionsDto> {
    return this.serviceDiscoveryService.getSearchSuggestions(query);
  }

  @Get('discover/popular')
  @Public()
  @ApiOperation({ summary: 'Get popular services for homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results (default: 6)' })
  async getPopularServices(
    @Query('limit') limit?: string,
  ): Promise<PopularServiceDto[]> {
    return this.serviceDiscoveryService.getPopularServices(limit ? parseInt(limit, 10) : 6);
  }
}
