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
import { UploadBusinessDocumentDto, UpdateDocumentStatusDto } from './dto/business-document.dto';
import { BusinessResponseDto, BusinessStatsDto, NearbyBusinessDto } from './dto/business-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Businesses')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  // ==================== MANAGER ENDPOINTS ====================

  @Post()
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new business (manager only)' })
  @ApiResponse({ status: 201, description: 'Business created', type: BusinessResponseDto })
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
  @ApiResponse({ status: 200, description: 'Business details', type: BusinessResponseDto })
  async getMyBusiness(@CurrentUser() user: any): Promise<BusinessResponseDto> {
    return this.businessesService.getMyBusiness(user.id);
  }

  @Put('me')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my business' })
  @ApiResponse({ status: 200, description: 'Business updated', type: BusinessResponseDto })
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
  async deleteMyBusiness(@CurrentUser() user: any): Promise<{ success: boolean; message: string }> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.deleteBusiness(user.id, business.id);
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
        type: { type: 'string', enum: ['BUSINESS_REGISTRATION', 'OWNER_ID', 'INSURANCE_CERTIFICATE', 'SERVICE_LICENSE'] },
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
    return this.businessesService.uploadDocument(user.id, business.id, file, dto);
  }

  @Get('me/documents')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business documents' })
  async getMyDocuments(@CurrentUser() user: any): Promise<any[]> {
    const business = await this.businessesService.getMyBusiness(user.id);
    const fullBusiness = await this.businessesService.getBusinessWithDetails(business.id);
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
    return this.businessesService.deleteDocument(user.id, business.id, documentId);
  }

  // ==================== BUSINESS STATISTICS ====================

  @Get('me/stats')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my business statistics' })
  @ApiResponse({ status: 200, description: 'Business statistics', type: BusinessStatsDto })
  async getMyStats(@CurrentUser() user: any): Promise<BusinessStatsDto> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.getBusinessStats(business.id);
  }

  // ==================== PUBLIC ENDPOINTS ====================

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all approved businesses (public)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by business name' })
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
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km', example: 10 })
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

  @Get(':businessId')
  @Public()
  @ApiOperation({ summary: 'Get business by ID (public)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, description: 'Business details', type: BusinessResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessById(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.getBusinessWithDetails(businessId);
  }

  @Get(':businessId/hours')
  @Public()
  @ApiOperation({ summary: 'Get business operating hours' })
  async getBusinessHours(@Param('businessId', ParseUUIDPipe) businessId: string): Promise<any[]> {
    return this.businessesService.getOperatingHours(businessId);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get('admin/all')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all businesses with filters (admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'] })
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