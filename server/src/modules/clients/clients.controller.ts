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
    return this.clientsService.updateLocation(user.id, dto);
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


// import {
//   Controller,
//   Get,
//   Put,
//   Delete,
//   Body,
//   Param,
//   Query,
//   HttpCode,
//   HttpStatus,
//   ParseUUIDPipe,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiQuery,
//   ApiParam,
// } from '@nestjs/swagger';
// import { ClientsService } from './clients.service';
// import { UpdateClientLocationDto } from './dto/client-location.dto';
// import { ClientResponseDto, NearbyClientDto } from './dto/client-response.dto';
// import { ClientStatsDto } from './dto/client-stats.dto';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Public } from '../../common/decorators/public.decorator';

// @ApiTags('Clients')
// @ApiBearerAuth()
// @Controller({ path: 'clients', version: '1' })
// export class ClientsController {
//   constructor(private readonly clientsService: ClientsService) {}

//   // ==================== CLIENT SELF-SERVICE ENDPOINTS ====================

//   @Get('me')
//   @ApiOperation({ summary: 'Get current client profile' })
//   @ApiResponse({ status: 200, description: 'Client profile returned', type: ClientResponseDto })
//   async getMyProfile(@CurrentUser() user: any): Promise<ClientResponseDto> {
//     return this.clientsService.getClientByUserId(user.id);
//   }

//   @Get('me/stats')
//   @ApiOperation({ summary: 'Get current client statistics' })
//   @ApiResponse({ status: 200, description: 'Client statistics', type: ClientStatsDto })
//   async getMyStats(@CurrentUser() user: any): Promise<ClientStatsDto> {
//     const client = await this.clientsService.getClientByUserId(user.id);
//     return this.clientsService.getClientStats(client.id);
//   }

//   @Get('me/location')
//   @ApiOperation({ summary: 'Get current client location' })
//   @ApiResponse({ status: 200, description: 'Client location' })
//   async getMyLocation(@CurrentUser() user: any): Promise<{ latitude: number; longitude: number } | null> {
//     return this.clientsService.getLocation(user.id);
//   }

//   @Put('me/location')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Update current client location' })
//   @ApiResponse({ status: 200, description: 'Location updated' })
//   async updateMyLocation(
//     @CurrentUser() user: any,
//     @Body() dto: UpdateClientLocationDto,
//   ): Promise<{ success: boolean; location: { latitude: number; longitude: number } }> {
//     return this.clientsService.updateLocation(user.id, dto);
//   }

//   @Get('me/bookings')
//   @ApiOperation({ summary: 'Get current client booking history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
//   async getMyBookings(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('status') status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     return this.clientsService.getBookingHistory(user.id, page, limit, status);
//   }

//   @Get('me/favorite-services')
//   @ApiOperation({ summary: 'Get client favorite services' })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   async getMyFavoriteServices(
//     @CurrentUser() user: any,
//     @Query('limit') limit: number = 10,
//   ): Promise<Array<{ service_id: string; service_name: string; category: string; booking_count: number }>> {
//     return this.clientsService.getFavoriteServices(user.id, limit);
//   }

//   @Get('me/loyalty')
//   @ApiOperation({ summary: 'Get client loyalty points history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   async getMyLoyaltyHistory(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//   ): Promise<{ data: any[]; meta: any }> {
//     return this.clientsService.getLoyaltyHistory(user.id, page, limit);
//   }

//   @Delete('me')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete current client account' })
//   @ApiResponse({ status: 200, description: 'Account deleted' })
//   async deleteMyAccount(@CurrentUser() user: any): Promise<{ success: boolean; message: string }> {
//     return this.clientsService.deleteClient(user.id, user.id, user.role);
//   }

//   // ==================== ADMIN/MANAGER ENDPOINTS ====================

//   @Get()
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get all clients with filters (admin/manager only)' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or phone' })
//   async getAllClients(
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('search') search?: string,
//   ): Promise<{ data: ClientResponseDto[]; meta: any }> {
//     if (search) {
//       return this.clientsService.searchClients(search, page, limit);
//     }
//     // Return all clients with pagination
//     return this.clientsService.searchClients('', page, limit);
//   }

//   @Get('nearby')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get nearby clients based on location (admin/manager only)' })
//   @ApiQuery({ name: 'lat', required: true, type: Number })
//   @ApiQuery({ name: 'lng', required: true, type: Number })
//   @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km', example: 10 })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 50 })
//   async getNearbyClients(
//     @Query('lat') lat: string,
//     @Query('lng') lng: string,
//     @Query('radius') radius: string = '10',
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 50,
//   ): Promise<{ data: NearbyClientDto[]; total: number; page: number; limit: number; totalPages: number }> {
//     return this.clientsService.getNearbyClients(
//       parseFloat(lat),
//       parseFloat(lng),
//       parseFloat(radius),
//       limit,
//       page,
//     );
//   }

//   @Get('top-spenders')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Get top clients by spending (admin only)' })
//   @ApiQuery({ name: 'limit', required: false, example: 10 })
//   @ApiQuery({ name: 'startDate', required: false, type: String })
//   @ApiQuery({ name: 'endDate', required: false, type: String })
//   async getTopSpenders(
//     @Query('limit') limit: number = 10,
//     @Query('startDate') startDate?: string,
//     @Query('endDate') endDate?: string,
//   ): Promise<ClientResponseDto[]> {
//     return this.clientsService.getTopClientsBySpending(
//       limit,
//       startDate ? new Date(startDate) : undefined,
//       endDate ? new Date(endDate) : undefined,
//     );
//   }

//   @Get(':clientId')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client profile', type: ClientResponseDto })
//   @ApiResponse({ status: 404, description: 'Client not found' })
//   async getClientById(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//   ): Promise<ClientResponseDto> {
//     const client = await this.clientsService.getClientById(clientId);
//     const stats = await this.clientsService.getClientStats(client.id);
//     return {
//       id: client.id,
//       user_id: client.user_id,
//       full_name: client.user.full_name,
//       email: client.user.email,
//       phone: client.user.phone,
//       avatar_url: client.user.avatar_url,
//       email_verified: client.user.email_verified,
//       phone_verified: client.user.phone_verified,
//       total_bookings: stats.total_bookings,
//       total_spent: stats.total_spent,
//       loyalty_points: stats.loyalty_points,
//       vehicles_count: stats.vehicles_count,
//       created_at: client.created_at,
//       updated_at: client.updated_at,
//     };
//   }

//   @Get(':clientId/stats')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client statistics by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client statistics', type: ClientStatsDto })
//   async getClientStatsById(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//   ): Promise<ClientStatsDto> {
//     return this.clientsService.getClientStats(clientId);
//   }

//   @Get(':clientId/bookings')
//   @Roles('ADMIN', 'MANAGER')
//   @ApiOperation({ summary: 'Get client booking history by ID (admin/manager only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'status', required: false })
//   async getClientBookings(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('status') status?: string,
//   ): Promise<{ data: any[]; meta: any }> {
//     const client = await this.clientsService.getClientById(clientId);
//     return this.clientsService.getBookingHistory(client.user_id, page, limit, status);
//   }

//   @Delete(':clientId')
//   @Roles('ADMIN')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Delete client by ID (admin only)' })
//   @ApiParam({ name: 'clientId', description: 'Client UUID' })
//   @ApiResponse({ status: 200, description: 'Client deleted' })
//   async deleteClient(
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//     @CurrentUser() user: any,
//   ): Promise<{ success: boolean; message: string }> {
//     const client = await this.clientsService.getClientById(clientId);
//     return this.clientsService.deleteClient(client.user_id, user.id, user.role);
//   }
// }