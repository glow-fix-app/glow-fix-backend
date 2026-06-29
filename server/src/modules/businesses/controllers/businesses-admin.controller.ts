import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BusinessesService } from '../businesses.service';
import {
  UpdateBusinessStatusDto,
} from '../dto/business-status.dto';
import {
  UpdateDocumentStatusDto,
} from '../dto/business-document.dto';
import { BusinessStatsDto } from '../dto/business-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Businesses (Admin)')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesAdminController {
  constructor(private readonly businessesService: BusinessesService) { }

  @Get('admin/all')
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
  @ApiOperation({ summary: 'Update business status (admin only)' })
  async updateBusinessStatus(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: UpdateBusinessStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.businessesService.updateBusinessStatus(businessId, dto);
  }

  @Put('admin/documents/:documentId/status')
  @ApiOperation({ summary: 'Update document verification status (admin only)' })
  async updateDocumentStatus(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateDocumentStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.businessesService.updateDocumentStatus(documentId, dto);
  }

  @Get('admin/:businessId/stats')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get business statistics (admin/manager)' })
  async getBusinessStats(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessStatsDto> {
    return this.businessesService.getBusinessStats(businessId);
  }
}
