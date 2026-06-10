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
import { UserRole } from '@glow-fix/types';
import { ServicesService } from './services.service';
import { ServicesPresenter } from './services.presenter';
import { ServiceDiscoveryService } from './service-discovery.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  AssignServiceToBusinessDto,
  BulkAssignServicesDto,
} from './dto/assign-service-to-business.dto';
import { UpdateBusinessServiceDto } from './dto/update-business-service.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  FilterCategoriesResponseDto,
  PopularServiceDto,
  SearchServicesDto,
  SearchSuggestionsDto,
  ServiceDiscoveryResponseDto,
  SortBy,
} from './dto/service-discovery.dto';
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

@ApiTags('Services')
@Controller({ path: 'services', version: '1' })
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly servicesPresenter: ServicesPresenter,
    private readonly serviceDiscoveryService: ServiceDiscoveryService,
  ) {}

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all service categories' })
  @ApiResponse({ status: 200, type: [CategorySummaryEntity] })
  async getAllCategories(): Promise<CategorySummaryEntity[]> {
    const categories = await this.servicesService.getAllCategories();
    return this.servicesPresenter.toCategoryEntities(categories);
  }

  @Get('categories/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, type: CategorySummaryEntity })
  async getCategoryById(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<CategorySummaryEntity> {
    const category = await this.servicesService.getCategoryById(categoryId);
    return this.servicesPresenter.toCategoryEntity(category);
  }

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  @ApiResponse({ status: 201, type: CategorySummaryEntity })
  async createCategory(
    @CurrentUser() user: any,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategorySummaryEntity> {
    const category = await this.servicesService.createCategory(user.sub ?? user.id, dto);
    return this.servicesPresenter.toCategoryEntity(category);
  }

  @Delete('categories/:categoryId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category (admin only)' })
  @ApiResponse({ status: 200, type: ActionMessageEntity })
  async deleteCategory(
    @CurrentUser() user: any,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<ActionMessageEntity> {
    return this.servicesService.deleteCategory(user.sub ?? user.id, categoryId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services from catalog (no prices)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, type: [ServiceEntity] })
  async getAllServices(
    @Query('categoryId') categoryId?: string,
  ): Promise<ServiceEntity[]> {
    const services = await this.servicesService.getAllServices(categoryId);
    return this.servicesPresenter.toServiceEntities(services);
  }

  @Get(':serviceId')
  @Public()
  @ApiOperation({ summary: 'Get service by ID from catalog' })
  @ApiResponse({ status: 200, type: ServiceEntity })
  async getServiceById(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<ServiceEntity> {
    const service = await this.servicesService.getServiceById(serviceId);
    return this.servicesPresenter.toServiceEntity(service);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new service in catalog (admin only - no price)',
  })
  @ApiResponse({ status: 201, type: ServiceEntity })
  async createService(
    @CurrentUser() user: any,
    @Body() dto: CreateServiceDto,
  ): Promise<ServiceEntity> {
    const service = await this.servicesService.createService(user.sub ?? user.id, dto);
    return this.servicesPresenter.toServiceEntity(service);
  }

  @Put(':serviceId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update service in catalog (admin only)' })
  @ApiResponse({ status: 200, type: ServiceEntity })
  async updateService(
    @CurrentUser() user: any,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceEntity> {
    const service = await this.servicesService.updateService(user.sub ?? user.id, serviceId, dto);
    return this.servicesPresenter.toServiceEntity(service);
  }

  @Delete(':serviceId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete service from catalog (admin only)' })
  @ApiResponse({ status: 200, type: ActionMessageEntity })
  async deleteService(
    @CurrentUser() user: any,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<ActionMessageEntity> {
    return this.servicesService.deleteService(user.sub ?? user.id, serviceId);
  }

  @Get('business/:businessId/unassigned')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get unassigned services for my business (manager only)',
  })
  @ApiResponse({ status: 200, type: [UnassignedServiceEntity] })
  async getUnassignedServices(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<UnassignedServiceEntity[]> {
    const services = await this.servicesService.getUnassignedBusinessServices(
      user.sub ?? user.id,
      businessId,
    );
    return this.servicesPresenter.toUnassignedServiceEntities(services);
  }

  @Get('business/:businessId')
  @Public()
  @ApiOperation({
    summary: 'Get available services for a business (public - with prices)',
  })
  @ApiResponse({ status: 200, type: [AvailableServiceEntity] })
  async getBusinessServices(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<AvailableServiceEntity[]> {
    const services = await this.servicesService.getAvailableServicesForBusiness(businessId);
    return this.servicesPresenter.toAvailableServiceEntities(services);
  }

  @Get('business/:businessId/category/:categoryName')
  @Public()
  @ApiOperation({ summary: 'Get services by category for a business (public)' })
  @ApiResponse({ status: 200, type: [AvailableServiceEntity] })
  async getBusinessServicesByCategory(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('categoryName') categoryName: string,
  ): Promise<AvailableServiceEntity[]> {
    const services = await this.servicesService.getAvailableServicesByCategory(
      businessId,
      categoryName,
    );
    return this.servicesPresenter.toAvailableServiceEntities(services);
  }

  @Get('business/:businessId/assigned')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Get all assigned services with prices for my business (manager only)',
  })
  @ApiResponse({ status: 200, type: [AssignedBusinessServiceEntity] })
  async getMyAssignedServices(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<AssignedBusinessServiceEntity[]> {
    const services = await this.servicesService.getAssignedBusinessServices(
      user.sub ?? user.id,
      businessId,
    );
    return this.servicesPresenter.toAssignedBusinessServiceEntities(services);
  }

  @Post('business/:businessId/assign')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Assign a service to my business with price (manager only)',
  })
  @ApiResponse({ status: 201, type: AssignedBusinessServiceEntity })
  async assignServiceToBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: AssignServiceToBusinessDto,
  ): Promise<AssignedBusinessServiceEntity> {
    const businessService = await this.servicesService.assignServiceToBusiness(
      user.sub ?? user.id,
      businessId,
      dto,
    );
    return this.servicesPresenter.toAssignedBusinessServiceEntity(businessService);
  }

  @Post('business/:businessId/assign/bulk')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Bulk assign services to my business (manager only)',
  })
  @ApiResponse({ status: 201, type: BulkAssignBusinessServicesResponseEntity })
  async bulkAssignServicesToBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: BulkAssignServicesDto,
  ): Promise<BulkAssignBusinessServicesResponseEntity> {
    const businessServices = await this.servicesService.bulkAssignServicesToBusiness(
      user.sub ?? user.id,
      businessId,
      dto,
    );
    return this.servicesPresenter.toBulkAssignResponseEntity(businessServices);
  }

  @Get('assigned/:businessServiceId')
  @Public()
  @ApiOperation({ summary: 'Get assigned service details by ID' })
  @ApiResponse({ status: 200, type: AssignedBusinessServiceEntity })
  async getBusinessServiceById(
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<AssignedBusinessServiceEntity> {
    const businessService = await this.servicesService.getBusinessServiceById(businessServiceId);
    return this.servicesPresenter.toAssignedBusinessServiceEntity(businessService);
  }

  @Put('business/:businessId/assigned/:businessServiceId')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update assigned service price/duration (manager only)',
  })
  @ApiResponse({ status: 200, type: AssignedBusinessServiceEntity })
  async updateBusinessService(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
    @Body() dto: UpdateBusinessServiceDto,
  ): Promise<AssignedBusinessServiceEntity> {
    const businessService = await this.servicesService.updateAssignedBusinessService(
      user.sub ?? user.id,
      businessId,
      businessServiceId,
      dto,
    );
    return this.servicesPresenter.toAssignedBusinessServiceEntity(businessService);
  }

  @Patch('business/:businessId/assigned/:businessServiceId/toggle')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle service active status (manager only)' })
  @ApiResponse({ status: 200, type: ToggleBusinessServiceResponseEntity })
  async toggleServiceStatus(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<ToggleBusinessServiceResponseEntity> {
    const businessService = await this.servicesService.toggleAssignedBusinessService(
      user.sub ?? user.id,
      businessId,
      businessServiceId,
    );
    return this.servicesPresenter.toToggleBusinessServiceResponseEntity(businessService);
  }

  @Delete('business/:businessId/assigned/:businessServiceId')
  @Roles(UserRole.MANAGER)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove service from business (manager only)' })
  @ApiResponse({ status: 200, type: ActionMessageEntity })
  async removeServiceFromBusiness(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<ActionMessageEntity> {
    return this.servicesService.removeAssignedBusinessService(
      user.sub ?? user.id,
      businessId,
      businessServiceId,
    );
  }

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
      user?.sub ?? user?.id ?? null,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
    );
  }

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
