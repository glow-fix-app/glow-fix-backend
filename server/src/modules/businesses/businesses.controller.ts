import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProviderDiscoveryService } from './provider-discovery.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateBusinessStatusDto } from './dto/business-status.dto';
import { UpdateOperatingHoursDto } from './dto/operating-hours.dto';
import {
  UploadBusinessDocumentDto,
  UpdateDocumentStatusDto,
} from './dto/business-document.dto';
import {
  BusinessResponseDto,
  BusinessStatsDto,
  NearbyBusinessDto,
} from './dto/business-response.dto';
import {
  SearchProvidersDto,
  ProviderDiscoveryResponseDto,
  ProviderFilterOptionsDto,
} from './dto/provider-discovery.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Businesses')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly providerDiscoveryService: ProviderDiscoveryService,
  ) {}

  // ==================== MANAGER ENDPOINTS ====================

  @Post()
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new business (manager only)' })
  @ApiResponse({
    status: 201,
    description: 'Business created',
    type: BusinessResponseDto,
  })
  async createBusiness(
    @CurrentUser() user: any,
    @Body() dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.createBusiness(user.id, dto);
  }

  @Get('me')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business' })
  @ApiResponse({
    status: 200,
    description: 'Business details',
    type: BusinessResponseDto,
  })
  async getMyBusiness(@CurrentUser() user: any): Promise<BusinessResponseDto> {
    return this.businessesService.getMyBusiness(user.id);
  }

  @Put('me')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my business' })
  @ApiResponse({
    status: 200,
    description: 'Business updated',
    type: BusinessResponseDto,
  })
  async updateMyBusiness(
    @CurrentUser() user: any,
    @Body() dto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.updateBusiness(user.id, business.id, dto);
  }

  @Delete('me')
  @Roles('MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close my business' })
  @ApiResponse({ status: 200, description: 'Business closed' })
  async deleteMyBusiness(
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.deleteBusiness(user.id, business.id);
  }

  // ==================== PROVIDER DISCOVERY (CLIENT) ====================

  @Get('discover')
  @Public()
  @ApiOperation({
    summary: 'Discover providers with search, filters, and sorting',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by business name',
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
    name: 'filters[service]',
    required: false,
    enum: ['Wash', 'Repair', 'both'],
    description: 'Service type filter',
  })
  @ApiQuery({
    name: 'filters[max_distance]',
    required: false,
    type: Number,
    description: 'Maximum distance in km',
  })
  @ApiQuery({
    name: 'filters[min_rating]',
    required: false,
    type: Number,
    description: 'Minimum rating (0-5)',
  })
  @ApiQuery({
    name: 'filters[open_now]',
    required: false,
    type: Boolean,
    description: 'Only show open now',
  })
  @ApiQuery({
    name: 'filters[verified_only]',
    required: false,
    type: Boolean,
    description: 'Only verified providers',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: ['highest_rated', 'nearest', 'most_reviews', 'newest', 'oldest'],
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
    description: 'Page size',
  })
  @ApiResponse({
    status: 200,
    description: 'Providers found',
    type: ProviderDiscoveryResponseDto,
  })
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
  @ApiResponse({ status: 200, description: 'Filter options' })
  async getDiscoveryFilters(
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
  ): Promise<ProviderFilterOptionsDto> {
    return this.providerDiscoveryService.getFilterOptions(
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
    );
  }

  // ==================== OPERATING HOURS ====================

  @Get('me/hours')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business operating hours' })
  async getMyHours(@CurrentUser() user: any): Promise<any[]> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.getOperatingHours(business.id);
  }

  @Put('me/hours')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my business operating hours' })
  async updateMyHours(
    @CurrentUser() user: any,
    @Body() dto: UpdateOperatingHoursDto,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.updateOperatingHours(business.id, dto.hours);
  }

  // ==================== BUSINESS DOCUMENTS ====================

  @Post('me/documents')
  @Roles('MANAGER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload business document' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type'],
      properties: {
        file: { type: 'string', format: 'binary' },
        type: {
          type: 'string',
          enum: [
            'BUSINESS_REGISTRATION',
            'OWNER_ID',
            'INSURANCE_CERTIFICATE',
            'SERVICE_LICENSE',
          ],
        },
      },
    },
  })
  async uploadDocument(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadBusinessDocumentDto,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.uploadDocument(
      user.id,
      business.id,
      file,
      dto,
    );
  }

  @Get('me/documents')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business documents' })
  async getMyDocuments(@CurrentUser() user: any): Promise<any[]> {
    const business = await this.businessesService.getMyBusiness(user.id);
    const fullBusiness = await this.businessesService.getBusinessWithDetails(
      business.id,
    );
    return fullBusiness.documents;
  }

  @Delete('me/documents/:documentId')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete business document' })
  async deleteDocument(
    @CurrentUser() user: any,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.deleteDocument(
      user.id,
      business.id,
      documentId,
    );
  }

  // ==================== BUSINESS STATISTICS ====================

  @Get('me/stats')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business statistics' })
  @ApiResponse({
    status: 200,
    description: 'Business statistics',
    type: BusinessStatsDto,
  })
  async getMyStats(@CurrentUser() user: any): Promise<BusinessStatsDto> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.getBusinessStats(business.id);
  }

  @Put('me/logo')
  @Roles('MANAGER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload or replace business logo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.businessesService.uploadBusinessImage(user.id, file, 'logo');
  }

  @Put('me/cover')
  @Roles('MANAGER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload or replace business cover photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  async uploadCover(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.businessesService.uploadBusinessImage(user.id, file, 'cover');
  }

  @Post('me/gallery')
  @Roles('MANAGER')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image to business gallery' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  async uploadGalleryImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.businessesService.uploadBusinessImage(user.id, file, 'gallery');
  }

  @Delete('me/gallery')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a gallery image by URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
      required: ['url'],
    },
  })
  async deleteGalleryImage(
    @CurrentUser() user: any,
    @Body('url') url: string,
  ): Promise<BusinessResponseDto> {
    if (!url) {
      throw new BadRequestException('URL is required');
    }
    return this.businessesService.deleteGalleryImage(user.id, url);
  }

  @Put('me/gallery/reorder')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder business gallery images' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        urls: { type: 'array', items: { type: 'string' } },
      },
      required: ['urls'],
    },
  })
  async reorderGallery(
    @CurrentUser() user: any,
    @Body('urls') urls: string[],
  ): Promise<BusinessResponseDto> {
    if (!urls || !Array.isArray(urls)) {
      throw new BadRequestException('URLs array is required');
    }
    return this.businessesService.reorderGallery(user.id, urls);
  }

  // ==================== PUBLIC ENDPOINTS ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all approved businesses (public)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by business name',
  })
  async getAllBusinesses(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ): Promise<{ data: any[]; meta: any }> {
    return this.businessesService.getApprovedBusinesses(page, limit, search);
  }

  @Get('nearby')
  @Public()
  @ApiOperation({ summary: 'Find nearby businesses (public)' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Radius in km',
    example: 10,
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getNearbyBusinesses(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string = '10',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: NearbyBusinessDto[]; meta: any }> {
    return this.businessesService.getNearbyBusinesses(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      page,
      limit,
    );
  }

  @Get('details/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get business by ID (public)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({
    status: 200,
    description: 'Business details',
    type: BusinessResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessById(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.getBusinessWithDetails(businessId);
  }

  @Get(':businessId/hours')
  @Public()
  @ApiOperation({ summary: 'Get business operating hours' })
  async getBusinessHours(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<any[]> {
    return this.businessesService.getOperatingHours(businessId);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get('admin/all')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all businesses with filters (admin only)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getAllBusinessesAdmin(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    return this.businessesService.getAllBusinesses(status, page, limit);
  }

  @Put('admin/:businessId/status')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business status (admin only)' })
  async updateBusinessStatus(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: UpdateBusinessStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.businessesService.updateBusinessStatus(businessId, dto);
  }

  @Put('admin/documents/:documentId/status')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update document status (admin only)' })
  async updateDocumentStatus(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateDocumentStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.businessesService.updateDocumentStatus(documentId, dto);
  }

  @Get('admin/:businessId/stats')
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business statistics (admin/manager)' })
  async getBusinessStats(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessStatsDto> {
    return this.businessesService.getBusinessStats(businessId);
  }
}
