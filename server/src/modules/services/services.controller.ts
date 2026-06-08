import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  AssignServiceToBusinessDto,
  BulkAssignServicesDto,
} from './dto/assign-service-to-business.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
import {
  ServiceCatalogResponseDto,
  AssignedBusinessServiceResponseDto,
  CategoryResponseDto,
  BulkAssignResponseDto,
  AvailableServiceDto,
} from './dto/service-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  FilterCategoriesResponseDto,
  PopularServiceDto,
  SearchServicesDto,
  SearchSuggestionsDto,
  ServiceDiscoveryResponseDto,
  SortBy,
} from './dto/service-discovery.dto';
import { ServiceDiscoveryService } from './service-discovery.service';

@ApiTags('Services')
@Controller({ path: 'services', version: '1' })
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly serviceDiscoveryService: ServiceDiscoveryService,
  ) {}

  // ==================== CATEGORY ENDPOINTS (Admin) ====================

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all service categories' })
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.servicesService.getAllCategories();
  }

  @Get('categories/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategoryById(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<CategoryResponseDto> {
    return this.servicesService.getCategoryById(categoryId);
  }

  @Post('categories')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  async createCategory(
    @CurrentUser() user: any,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.servicesService.createCategory(user.id, dto);
  }

  @Delete('categories/:categoryId')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category (admin only)' })
  async deleteCategory(
    @CurrentUser() user: any,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.deleteCategory(user.id, categoryId);
  }

  // ==================== SERVICE CATALOG ENDPOINTS (Admin only) ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services from catalog (no prices)' })
  @ApiQuery({ name: 'categoryId', required: false })
  async getAllServices(
    @Query('categoryId') categoryId?: string,
  ): Promise<ServiceCatalogResponseDto[]> {
    return this.servicesService.getAllServices(categoryId);
  }

  @Get(':serviceId')
  @Public()
  @ApiOperation({ summary: 'Get service by ID from catalog' })
  async getServiceById(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<ServiceCatalogResponseDto> {
    return this.servicesService.getServiceById(serviceId);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new service in catalog (admin only - no price)',
  })
  async createService(
    @CurrentUser() user: any,
    @Body() dto: CreateServiceDto,
  ): Promise<ServiceCatalogResponseDto> {
    return this.servicesService.createService(user.id, dto);
  }

  @Put(':serviceId')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service in catalog (admin only)' })
  async updateService(
    @CurrentUser() user: any,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceCatalogResponseDto> {
    return this.servicesService.updateService(user.id, serviceId, dto);
  }

  @Delete(':serviceId')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete service from catalog (admin only)' })
  async deleteService(
    @CurrentUser() user: any,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.deleteService(user.id, serviceId);
  }

  // ==================== BUSINESS SERVICE ASSIGNMENT (Manager - adds price) ====================

  @Get('business/:businessId/unassigned')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get unassigned services for my business (manager only)',
  })
  async getUnassignedServices(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<ServiceCatalogResponseDto[]> {
    return this.servicesService.getUnassignedServicesForBusiness(
      user.id,
      businessId,
    );
  }

  @Get('business/:businessId')
  @Public()
  @ApiOperation({
    summary: 'Get available services for a business (public - with prices)',
  })
  async getBusinessServices(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<AvailableServiceDto[]> {
    return this.servicesService.getAvailableServicesForBusiness(businessId);
  }

  @Get('business/:businessId/category/:categoryName')
  @Public()
  @ApiOperation({ summary: 'Get services by category for a business (public)' })
  async getBusinessServicesByCategory(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('categoryName') categoryName: string,
  ): Promise<AvailableServiceDto[]> {
    return this.servicesService.getAvailableServicesByCategory(
      businessId,
      categoryName,
    );
  }

  @Get('business/:businessId/assigned')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all assigned services with prices for my business (manager only)',
  })
  async getMyAssignedServices(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<AssignedBusinessServiceResponseDto[]> {
    await this.servicesService.verifyBusinessOwnership(user.id, businessId);
    return this.servicesService.getBusinessServices(businessId, true);
  }

  @Post('business/:businessId/assign')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Assign a service to my business with price (manager only)',
  })
  async assignServiceToBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: AssignServiceToBusinessDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.assignServiceToBusiness(
      user.id,
      businessId,
      dto,
    );
  }

  @Post('business/:businessId/assign/bulk')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bulk assign services to my business (manager only)',
  })
  async bulkAssignServicesToBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: BulkAssignServicesDto,
  ): Promise<BulkAssignResponseDto> {
    return this.servicesService.bulkAssignServicesToBusiness(
      user.id,
      businessId,
      dto,
    );
  }

  @Get('assigned/:businessServiceId')
  @Public()
  @ApiOperation({ summary: 'Get assigned service details by ID' })
  async getBusinessServiceById(
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.getBusinessServiceById(businessServiceId);
  }

  @Put('business/:businessId/assigned/:businessServiceId')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update assigned service price/duration (manager only)',
  })
  async updateBusinessService(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
    @Body() dto: UpdateBusinessServiceDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.updateBusinessService(
      user.id,
      businessId,
      businessServiceId,
      dto,
    );
  }

  @Patch('business/:businessId/assigned/:businessServiceId/toggle')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle service active status (manager only)' })
  async toggleServiceStatus(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<{ is_active: boolean; message: string }> {
    return this.servicesService.toggleServiceStatus(
      user.id,
      businessId,
      businessServiceId,
    );
  }

  @Delete('business/:businessId/assigned/:businessServiceId')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove service from business (manager only)' })
  async removeServiceFromBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.removeServiceFromBusiness(
      user.id,
      businessId,
      businessServiceId,
    );
  }

  // ==================== SERVICE DISCOVERY (CLIENT SEARCH) ====================

  @Get('discover/search')
  @ApiOperation({
    summary: 'Search services across all providers (client discovery)',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Service name to search',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category filter',
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    description: 'User latitude',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    description: 'User longitude',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Search radius in km',
  })
  @ApiQuery({
    name: 'min_price',
    required: false,
    type: Number,
    description: 'Minimum price',
  })
  @ApiQuery({
    name: 'max_price',
    required: false,
    type: Number,
    description: 'Maximum price',
  })
  @ApiQuery({
    name: 'min_rating',
    required: false,
    type: Number,
    description: 'Minimum rating (0-5)',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: SortBy,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async searchServices(
    @CurrentUser() user: any,
    @Query() dto: SearchServicesDto,
  ): Promise<{ data: ServiceDiscoveryResponseDto[]; meta: any }> {
    return this.serviceDiscoveryService.searchServices(user?.id || null, dto);
  }

  @Get('discover/suggestions')
  @Public()
  @ApiOperation({ summary: 'Get search suggestions for autocomplete' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  async getSearchSuggestions(
    @Query('q') query: string,
  ): Promise<SearchSuggestionsDto> {
    return this.serviceDiscoveryService.getSearchSuggestions(query);
  }

  @Get('discover/popular')
  @Public()
  @ApiOperation({ summary: 'Get popular services for homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPopularServices(
    @Query('limit') limit: number = 6,
  ): Promise<PopularServiceDto[]> {
    return this.serviceDiscoveryService.getPopularServices(limit);
  }

  @Get(':serviceId/providers')
  @Public()
  @ApiOperation({ summary: 'Get all providers for a specific service' })
  @ApiParam({ name: 'serviceId', description: 'Service UUID' })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  async getServiceWithProviders(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @CurrentUser() user: any,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ): Promise<ServiceDiscoveryResponseDto> {
    return this.serviceDiscoveryService.getServiceWithProviders(
      serviceId,
      user?.id || null,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
    );
  }

  // ==================== FILTERS ====================

  @Get('discover/filters')
  @Public()
  @ApiOperation({ summary: 'Get available filter options (categories, locations, price ranges)' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
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
}
