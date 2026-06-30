import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ServicesService } from '../services.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import {
  ServiceCatalogResponseDto,
  CategoryResponseDto,
} from '../dto/service-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Services')
@Controller({ path: 'services', version: '1' })
export class ServicesCatalogController {
  constructor(private readonly servicesService: ServicesService) { }

  // ==================== CATEGORY ENDPOINTS ====================

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
    @Param('categoryId') categoryId: string,
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
    @Param('categoryId') categoryId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.deleteCategory(user.id, categoryId);
  }

  // ==================== SERVICE CATALOG ENDPOINTS ====================

  @Get()
  @Public()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all services from catalog (no prices)' })
  @ApiQuery({ name: 'categoryId', required: false })
  async getAllServices(
    @Query('categoryId') categoryId?: string,
  ): Promise<ServiceCatalogResponseDto[]> {
    return this.servicesService.getAllServices(categoryId);
  }

  // NOTE: @Get(':serviceId') comes AFTER all /discover/* and /business/* routes
  // to prevent NestJS from swallowing those literal paths as UUID params.
  @Get(':serviceId')
  @Public()
  @ApiOperation({ summary: 'Get service by ID from catalog' })
  async getServiceById(
    @Param('serviceId') serviceId: string,
  ): Promise<ServiceCatalogResponseDto> {
    return this.servicesService.getServiceById(serviceId);
  }

  @Post()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service in catalog (admin only - no price)' })
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
    @Param('serviceId') serviceId: string,
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
    @Param('serviceId') serviceId: string,
  ): Promise<{ message: string }> {
    return this.servicesService.deleteService(user.id, serviceId);
  }
}
