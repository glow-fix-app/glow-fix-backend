import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtPayload, UserRole } from '@glow-fix/types';

import { BusinessesService, OnboardingStatus, BusinessResponse } from './businesses.service';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  CreateOperatingHoursDto,
  UploadDocumentDto,
  AdminSetBusinessStatusDto,
  AdminSetDocumentStatusDto,
} from './dto';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

// =====================================================================
// Controller
// =====================================================================

@ApiTags('Businesses')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  // ─── MANAGER: Business Profile ─────────────────────────────────────────────

  /**
   * POST /api/v1/businesses
   * MANAGER: Create a business profile.
   */
  @Post()
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a business profile (MANAGER only)' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 409, description: 'Manager already has a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async createBusiness(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateBusinessDto,
  ): Promise<BusinessResponse> {
    return this.businessesService.createBusiness(user.sub ?? (user as any).id, dto);
  }

  /**
   * GET /api/v1/businesses/me
   * MANAGER: Get own business profile.
   */
  @Get('me')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get own business profile (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Business profile retrieved' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async getMyBusiness(@CurrentUser() user: JwtPayload): Promise<BusinessResponse> {
    return this.businessesService.getMyBusiness(user.sub ?? (user as any).id);
  }

  /**
   * PUT /api/v1/businesses/me
   * MANAGER: Update own business profile.
   */
  @Put('me')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update own business profile (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Business profile updated' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async updateMyBusiness(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateBusinessDto,
  ): Promise<BusinessResponse> {
    return this.businessesService.updateMyBusiness(user.sub ?? (user as any).id, dto);
  }

  // ─── MANAGER: Operating Hours ─────────────────────────────────────────────

  /**
   * GET /api/v1/businesses/me/hours
   * MANAGER: Get business operating hours.
   */
  @Get('me/hours')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get business operating hours (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Operating hours retrieved' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async getOperatingHours(@CurrentUser() user: JwtPayload): Promise<Array<{
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
  }>> {
    return this.businessesService.getOperatingHours(user.sub ?? (user as any).id);
  }

  /**
   * PUT /api/v1/businesses/me/hours
   * MANAGER: Update business operating hours.
   */
  @Put('me/hours')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update business operating hours (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Operating hours updated' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async updateOperatingHours(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOperatingHoursDto,
  ): Promise<Array<{ dayOfWeek: number; openTime: string | null; closeTime: string | null }>> {
    return this.businessesService.updateOperatingHours(user.sub ?? (user as any).id, dto);
  }

  // ─── MANAGER: Documents ───────────────────────────────────────────────────

  /**
   * GET /api/v1/businesses/me/documents
   * MANAGER: Get business documents.
   */
  @Get('me/documents')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get business documents (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Documents retrieved' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async getMyDocuments(@CurrentUser() user: JwtPayload): Promise<Array<{
    id: string;
    type: string;
    url: string;
    status: string;
    createdAt: Date;
  }>> {
    return this.businessesService.getMyDocuments(user.sub ?? (user as any).id);
  }

  /**
   * POST /api/v1/businesses/me/documents
   * MANAGER: Upload a business document.
   */
  @Post('me/documents')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a business document (MANAGER only)' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or document type' })
  @ApiResponse({ status: 404, description: 'Manager does not have a business' })
  @ApiResponse({ status: 409, description: 'Document already exists' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async uploadDocument(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ): Promise<{ id: string; type: string; url: string; status: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.businessesService.uploadDocument(user.sub ?? (user as any).id, file, dto);
  }

  /**
   * DELETE /api/v1/businesses/me/documents/:documentId
   * MANAGER: Delete a document.
   */
  @Delete('me/documents/:documentId')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document (MANAGER only)' })
  @ApiResponse({ status: 204, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Document belongs to another manager' })
  async deleteDocument(
    @CurrentUser() user: JwtPayload,
    @Param('documentId') documentId: string,
  ): Promise<void> {
    await this.businessesService.deleteDocument(user.sub ?? (user as any).id, documentId);
  }

  // ─── MANAGER: Onboarding Status ────────────────────────────────────────────

  /**
   * GET /api/v1/businesses/me/onboarding-status
   * MANAGER: Get onboarding progress.
   */
  @Get('me/onboarding-status')
  @Roles(UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get onboarding status (MANAGER only)' })
  @ApiResponse({ status: 200, description: 'Onboarding status retrieved' })
  @ApiResponse({ status: 403, description: 'User is not a manager' })
  async getOnboardingStatus(@CurrentUser() user: JwtPayload): Promise<OnboardingStatus> {
    return this.businessesService.getOnboardingStatus(user.sub ?? (user as any).id);
  }

  // ─── ADMIN: Business Management ────────────────────────────────────────────

  /**
   * GET /api/v1/businesses/admin/all
   * ADMIN: Get all businesses with optional status filter.
   */
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all businesses (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Businesses retrieved' })
  @ApiResponse({ status: 403, description: 'User is not an admin' })
  async getAllBusinessesForAdmin(
    @CurrentUser() _user: JwtPayload,
    @Query('status') status?: string,
  ): Promise<Array<BusinessResponse>> {
    return this.businessesService.getAllBusinessesForAdmin(status);
  }

  /**
   * PUT /api/v1/businesses/admin/:businessId/status
   * ADMIN: Set business status (approve/reject/suspend).
   */
  @Put('admin/:businessId/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Set business status (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User is not an admin' })
  async setBusinessStatus(
    @CurrentUser() _user: JwtPayload,
    @Param('businessId') businessId: string,
    @Body() dto: AdminSetBusinessStatusDto,
  ): Promise<BusinessResponse> {
    return this.businessesService.setBusinessStatus(businessId, dto);
  }

  /**
   * PUT /api/v1/businesses/admin/documents/:documentId/status
   * ADMIN: Set document status (approve/reject).
   */
  @Put('admin/documents/:documentId/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Set document status (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 403, description: 'User is not an admin' })
  async setDocumentStatus(
    @CurrentUser() _user: JwtPayload,
    @Param('documentId') documentId: string,
    @Body() dto: AdminSetDocumentStatusDto,
  ): Promise<{ id: string; type: string; url: string; status: string }> {
    return this.businessesService.setDocumentStatus(documentId, dto);
  }

  // ─── PUBLIC: Approved Businesses ──────────────────────────────────────────

  /**
   * GET /api/v1/businesses
   * PUBLIC: List all approved businesses.
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'List approved businesses (public)' })
  @ApiResponse({ status: 200, description: 'Businesses retrieved' })
  async listApprovedBusinesses(): Promise<Array<BusinessResponse>> {
    return this.businessesService.listApprovedBusinesses();
  }

  /**
   * GET /api/v1/businesses/:id
   * PUBLIC: Get a specific approved business by ID.
   */
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get approved business by ID (public)' })
  @ApiResponse({ status: 200, description: 'Business retrieved' })
  @ApiResponse({ status: 404, description: 'Business not found or not approved' })
  async getApprovedBusiness(
    @Param('id') id: string,
  ): Promise<BusinessResponse> {
    return this.businessesService.getApprovedBusiness(id);
  }
}
