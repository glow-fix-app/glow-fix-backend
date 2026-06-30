import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ServicesService } from '../services.service';
import {
  AssignServiceToBusinessDto,
  BulkAssignServicesDto,
} from '../dto/assign-service-to-business.dto';
import { UpdateBusinessServiceDto } from '../dto/update-business-service.dto';
import {
  ServiceCatalogResponseDto,
  AssignedBusinessServiceResponseDto,
  BulkAssignResponseDto,
  AvailableServiceDto,
} from '../dto/service-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { ServiceDiscoveryService } from '../service-discovery.service';
import { ServiceDiscoveryResponseDto } from '../dto/service-discovery.dto';

@ApiTags('Services')
@Controller({ path: 'services', version: '1' })
export class ServicesBusinessController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly serviceDiscoveryService: ServiceDiscoveryService,
  ) { }

  // ==================== BUSINESS SERVICE ASSIGNMENT (Manager) ====================

  @Get('business/:businessId/unassigned')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unassigned services for my business (manager only)' })
  async getUnassignedServices(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
  ): Promise<ServiceCatalogResponseDto[]> {
    return this.servicesService.getUnassignedServicesForBusiness(user.id, businessId);
  }

  @Get('business/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get available services for a business (public - with prices)' })
  async getBusinessServices(
    @Param('businessId') businessId: string,
  ): Promise<AvailableServiceDto[]> {
    return this.servicesService.getAvailableServicesForBusiness(businessId);
  }

  @Get('business/:businessId/category/:categoryName')
  @Public()
  @ApiOperation({ summary: 'Get services by category for a business (public)' })
  async getBusinessServicesByCategory(
    @Param('businessId') businessId: string,
    @Param('categoryName') categoryName: string,
  ): Promise<AvailableServiceDto[]> {
    return this.servicesService.getAvailableServicesByCategory(businessId, categoryName);
  }

  @Get('business/:businessId/assigned')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all assigned services with prices for my business (manager only)' })
  async getMyAssignedServices(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
  ): Promise<AssignedBusinessServiceResponseDto[]> {
    await this.servicesService.verifyBusinessOwnership(user.id, businessId);
    return this.servicesService.getBusinessServices(businessId, true);
  }

  @Post('business/:businessId/assign')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a service to my business with price (manager only)' })
  async assignServiceToBusiness(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
    @Body() dto: AssignServiceToBusinessDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.assignServiceToBusiness(user.id, businessId, dto);
  }

  @Post('business/:businessId/assign/bulk')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk assign services to my business (manager only)' })
  async bulkAssignServicesToBusiness(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
    @Body() dto: BulkAssignServicesDto,
  ): Promise<BulkAssignResponseDto> {
    return this.servicesService.bulkAssignServicesToBusiness(user.id, businessId, dto);
  }

  @Get('assigned/:businessServiceId')
  @Public()
  @ApiOperation({ summary: 'Get assigned service details by ID' })
  async getBusinessServiceById(
    @Param('businessServiceId') businessServiceId: string,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.getBusinessServiceById(businessServiceId);
  }

  @Put('business/:businessId/assigned/:businessServiceId')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update assigned service price/duration (manager only)' })
  async updateBusinessService(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
    @Param('businessServiceId') businessServiceId: string,
    @Body() dto: UpdateBusinessServiceDto,
  ): Promise<AssignedBusinessServiceResponseDto> {
    return this.servicesService.updateBusinessService(user.id, businessId, businessServiceId, dto);
  }

  @Patch('business/:businessId/assigned/:businessServiceId/toggle')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle service active status (manager only)' })
  async toggleServiceStatus(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
    @Param('businessServiceId') businessServiceId: string,
  ): Promise<{ is_active: boolean; message: string }> {
    return this.servicesService.toggleServiceStatus(user.id, businessId, businessServiceId);
  }

  @Delete('business/:businessId/assigned/:businessServiceId')
  @Roles('MANAGER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove service from business (manager only)' })
  async removeServiceFromBusiness(
    @CurrentUser() user: any,
    @Param('businessId') businessId: string,
    @Param('businessServiceId') businessServiceId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.removeServiceFromBusiness(user.id, businessId, businessServiceId);
  }

  // ==================== SERVICE WITH PROVIDERS ====================

  @Get(':serviceId/providers')
  @Public()
  @ApiOperation({ summary: 'Get all providers for a specific service' })
  @ApiParam({ name: 'serviceId', description: 'Service UUID' })
  async getServiceWithProviders(
    @Param('serviceId') serviceId: string,
    @CurrentUser() user: any,
  ): Promise<ServiceDiscoveryResponseDto> {
    return this.serviceDiscoveryService.getServiceWithProviders(
      serviceId,
      user?.id || null,
      undefined,
      undefined,
    );
  }
}
