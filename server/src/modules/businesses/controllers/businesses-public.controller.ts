import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BusinessesService } from '../businesses.service';
import {
  BusinessResponseDto,
  NearbyBusinessDto,
} from '../dto/business-response.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Businesses (Public)')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesPublicController {
  constructor(private readonly businessesService: BusinessesService) { }

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

  @Get('details/:businessId')
  @Public()
  @ApiOperation({ summary: 'Get business by ID (public)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, type: BusinessResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessById(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessesService.getBusinessWithDetails(businessId);
  }

  @Get(':businessId/hours')
  @Public()
  @ApiOperation({ summary: 'Get business operating hours (public)' })
  async getBusinessHours(
    @Param('businessId', ParseUUIDPipe) businessId: string,
  ): Promise<any[]> {
    return this.businessesService.getOperatingHours(businessId);
  }
}
