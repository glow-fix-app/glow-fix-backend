import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { UpdateClientLocationDto } from './dto/client-location.dto';
import { ClientResponseDto, NearbyBusinessDto } from './dto/client-response.dto';
import { ClientStatsDto, LoyaltySummaryDto } from './dto/client-stats.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller({ path: 'clients', version: '1' })
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // ==================== CLIENT PROFILE ====================

  @Get('me')
  @ApiOperation({ summary: 'Get client profile' })
  @ApiResponse({ status: 200, description: 'Client profile', type: ClientResponseDto })
  async getMyProfile(@CurrentUser() user: any): Promise<ClientResponseDto> {
    return this.clientsService.getClientByUserId(user.id);
  }

  // ==================== LOCATION MANAGEMENT ====================

  @Get('me/location')
  @ApiOperation({ summary: 'Get current location' })
  @ApiResponse({ status: 200, description: 'Client location' })
  async getMyLocation(@CurrentUser() user: any): Promise<{ latitude: number; longitude: number } | null> {
    return this.clientsService.getLocation(user.id);
  }

  @Put('me/location')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current location' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  async updateMyLocation(
    @CurrentUser() user: any,
    @Body() dto: UpdateClientLocationDto,
  ): Promise<{ success: boolean; location: { latitude: number; longitude: number } }> {
    const result = await this.clientsService.updateLocation(user.id, dto);
    return {
      success: result.success,
      location: { latitude: result.location.latitude, longitude: result.location.longitude },
    };
  }

  // ==================== STATISTICS ====================

  @Get('me/stats')
  @ApiOperation({ summary: 'Get client statistics' })
  @ApiResponse({ status: 200, description: 'Client statistics', type: ClientStatsDto })
  async getMyStats(@CurrentUser() user: any): Promise<ClientStatsDto> {
    return this.clientsService.getClientStats(user.id);
  }

  // ==================== LOYALTY POINTS ====================

  @Get('me/loyalty')
  @ApiOperation({ summary: 'Get loyalty points summary' })
  @ApiResponse({ status: 200, description: 'Loyalty summary', type: LoyaltySummaryDto })
  async getMyLoyalty(@CurrentUser() user: any): Promise<LoyaltySummaryDto> {
    return this.clientsService.getLoyaltySummary(user.id);
  }

  // ==================== NEARBY DISCOVERY ====================

  @Get('me/nearby')
  @ApiOperation({ summary: 'Find nearby businesses' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km', example: 10 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Nearby businesses', type: [NearbyBusinessDto] })
  async getNearbyBusinesses(
    @CurrentUser() user: any,
    @Query('radius') radius: string = '10',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: NearbyBusinessDto[]; meta: any }> {
    return this.clientsService.getNearbyBusinesses(
      user.id,
      parseFloat(radius),
      page,
      limit,
    );
  }

  // ==================== VEHICLES (Read-only reference) ====================

  @Get('me/vehicles')
  @ApiOperation({ summary: 'Get client vehicles (reference only - full CRUD in Vehicles module)' })
  @ApiResponse({ status: 200, description: 'List of vehicles' })
  async getMyVehicles(@CurrentUser() user: any): Promise<Array<{ id: string; license_plate: string; model?: string; year?: number; color?: string }>> {
    return this.clientsService.getClientVehicles(user.id);
  }
}