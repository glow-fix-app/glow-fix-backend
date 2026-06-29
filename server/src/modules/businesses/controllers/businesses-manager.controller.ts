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
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { BusinessesService } from '../businesses.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { UpdateOperatingHoursDto } from '../dto/operating-hours.dto';
import {
  UploadBusinessDocumentDto,
} from '../dto/business-document.dto';
import {
  BusinessResponseDto,
  BusinessStatsDto,
} from '../dto/business-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Businesses (Manager)')
@ApiBearerAuth()
@Roles('MANAGER')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesManagerController {
  constructor(private readonly businessesService: BusinessesService) { }

  // ==================== BUSINESS CRUD ====================

  @Post()
  @ApiOperation({ summary: 'Register a new business (manager only)' })
  @ApiResponse({ status: 201, type: BusinessResponseDto })
  async createBusiness(
    @CurrentUser() user: any,
    @Body() dto: CreateBusinessDto,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.createBusiness(user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my business' })
  @ApiResponse({ status: 200, type: BusinessResponseDto })
  async getMyBusiness(@CurrentUser() user: any): Promise<BusinessResponseDto> {
    return this.businessesService.getMyBusiness(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update my business' })
  @ApiResponse({ status: 200, type: BusinessResponseDto })
  async updateMyBusiness(
    @CurrentUser() user: any,
    @Body() dto: UpdateBusinessDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.updateBusiness(user.id, business.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close my business' })
  @ApiResponse({ status: 200 })
  async deleteMyBusiness(
    @CurrentUser() user: any,
  ): Promise<{ success: boolean; message: string }> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.deleteBusiness(user.id, business.id);
  }

  // ==================== OPERATING HOURS ====================

  @Get('me/hours')
  @ApiOperation({ summary: 'Get my business operating hours' })
  async getMyHours(@CurrentUser() user: any): Promise<any[]> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.getOperatingHours(business.id);
  }

  @Put('me/hours')
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
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
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
          enum: ['BUSINESS_REGISTRATION', 'OWNER_ID', 'INSURANCE_CERTIFICATE', 'SERVICE_LICENSE'],
        },
      },
    },
  })
  async uploadDocument(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadBusinessDocumentDto,
  ): Promise<any> {
    if (!file) throw new BadRequestException('File is required');
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.uploadDocument(user.id, business.id, file, dto);
  }

  @Get('me/documents')
  @ApiOperation({ summary: 'Get my business documents' })
  async getMyDocuments(@CurrentUser() user: any): Promise<any[]> {
    const business = await this.businessesService.getMyBusiness(user.id);
    const fullBusiness = await this.businessesService.getBusinessWithDetails(business.id);
    return fullBusiness.documents;
  }

  @Delete('me/documents/:documentId')
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
  @ApiOperation({ summary: 'Get my business statistics' })
  @ApiResponse({ status: 200, type: BusinessStatsDto })
  async getMyStats(@CurrentUser() user: any): Promise<BusinessStatsDto> {
    const business = await this.businessesService.getMyBusiness(user.id);
    return this.businessesService.getBusinessStats(business.id);
  }

  // ==================== MEDIA (LOGO / COVER / GALLERY) ====================

  @Put('me/logo')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload or replace business logo' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) throw new BadRequestException('File is required');
    return this.businessesService.uploadBusinessImage(user.id, file, 'logo');
  }

  @Put('me/cover')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload or replace business cover photo' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadCover(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) throw new BadRequestException('File is required');
    return this.businessesService.uploadBusinessImage(user.id, file, 'cover');
  }

  @Post('me/gallery')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image to business gallery' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadGalleryImage(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BusinessResponseDto> {
    if (!file) throw new BadRequestException('File is required');
    return this.businessesService.uploadBusinessImage(user.id, file, 'gallery');
  }

  @Delete('me/gallery')
  @ApiOperation({ summary: 'Delete a gallery image by URL' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['url'],
      properties: { url: { type: 'string' } },
    },
  })
  async deleteGalleryImage(
    @CurrentUser() user: any,
    @Body('url') url: string,
  ): Promise<BusinessResponseDto> {
    if (!url) throw new BadRequestException('URL is required');
    return this.businessesService.deleteGalleryImage(user.id, url);
  }

  @Put('me/gallery/reorder')
  @ApiOperation({ summary: 'Reorder business gallery images' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urls'],
      properties: { urls: { type: 'array', items: { type: 'string' } } },
    },
  })
  async reorderGallery(
    @CurrentUser() user: any,
    @Body('urls') urls: string[],
  ): Promise<BusinessResponseDto> {
    if (!urls || !Array.isArray(urls)) throw new BadRequestException('URLs array is required');
    return this.businessesService.reorderGallery(user.id, urls);
  }
}
