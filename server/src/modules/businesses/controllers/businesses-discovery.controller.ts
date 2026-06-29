import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ProviderDiscoveryService } from '../provider-discovery.service';
import {
  SearchProvidersDto,
  ProviderDiscoveryResponseDto,
  ProviderFilterOptionsDto,
} from '../dto/provider-discovery.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Businesses (Discovery)')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesDiscoveryController {
  constructor(private readonly providerDiscoveryService: ProviderDiscoveryService) { }

  @Get('discover')
  @Public()
  @ApiOperation({ summary: 'Discover providers with search, filters, and sorting' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by business name' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'User latitude' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'User longitude' })
  @ApiQuery({ name: 'filters[service]', required: false, enum: ['Wash', 'Repair', 'both'], description: 'Service type filter' })
  @ApiQuery({ name: 'filters[max_distance]', required: false, type: Number, description: 'Maximum distance in km' })
  @ApiQuery({ name: 'filters[min_rating]', required: false, type: Number, description: 'Minimum rating (0-5)' })
  @ApiQuery({ name: 'filters[open_now]', required: false, type: Boolean, description: 'Only show open now' })
  @ApiQuery({ name: 'filters[verified_only]', required: false, type: Boolean, description: 'Only verified providers' })
  @ApiQuery({ name: 'sort_by', required: false, enum: ['highest_rated', 'nearest', 'most_reviews', 'newest', 'oldest'], description: 'Sort order' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: ProviderDiscoveryResponseDto })
  async discoverProviders(
    @CurrentUser() user: any,
    @Query() dto: SearchProvidersDto,
  ): Promise<ProviderDiscoveryResponseDto> {
    return this.providerDiscoveryService.searchProviders(user?.id || null, dto);
  }

  @Get('discover/filters')
  @Public()
  @ApiOperation({ summary: 'Get filter options for provider discovery' })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiResponse({ status: 200 })
  async getDiscoveryFilters(
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ): Promise<ProviderFilterOptionsDto> {
    return this.providerDiscoveryService.getFilterOptions(
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
    );
  }
}
