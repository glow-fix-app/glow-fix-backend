import { Controller, Get, Param, ParseUUIDPipe, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CategoriesService } from './categories.service';
import { BusinessCategoriesResponseDto, CategoryWithServicesDto } from './dto/category-response.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all available service categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getAllCategories(): Promise<Array<{ id: string; name: string }>> {
    return this.categoriesService.getAllCategories();
  }

  @Get('business/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get all service categories for a specific business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, description: 'Categories with services', type: BusinessCategoriesResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessCategories(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessCategoriesResponseDto> {
    return this.categoriesService.getBusinessCategories(businessId);
  }

  @Get('business/:businessId/category/:categoryName')
  @Public()
  @ApiOperation({ summary: 'Get services by category for a specific business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiParam({ name: 'categoryName', description: 'Category name (e.g., WASH, REPAIR)', example: 'WASH' })
  @ApiResponse({ status: 200, description: 'Services in category', type: CategoryWithServicesDto })
  async getServicesByCategory(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('categoryName') categoryName: string,
  ): Promise<CategoryWithServicesDto | null> {
    return this.categoriesService.getServicesByCategory(businessId, categoryName);
  }

  @Get('service/:businessServiceId')
  @Public()
  @ApiOperation({ summary: 'Get service details by business_service_id' })
  @ApiParam({ name: 'businessServiceId', description: 'Business Service UUID' })
  async getServiceDetails(
    @Param('businessServiceId', ParseUUIDPipe) businessServiceId: string,
  ): Promise<any> {
    return this.categoriesService.getServiceDetails(businessServiceId);
  }
}