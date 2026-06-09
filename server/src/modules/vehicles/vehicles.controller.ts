import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { VehicleResponseDto, VehicleWithStatsResponseDto, VehicleBookingHistoryDto } from './dto/vehicle-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller({ path: 'vehicles', version: '1' })
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: 'Add a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle created', type: VehicleResponseDto })
  @ApiResponse({ status: 409, description: 'License plate already exists' })
  async createVehicle(
    @CurrentUser() user: any,
    @Body() dto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.createVehicle(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my vehicles' })
  @ApiResponse({ status: 200, description: 'List of vehicles', type: [VehicleResponseDto] })
  async getUserVehicles(@CurrentUser() user: any): Promise<VehicleResponseDto[]> {
    return this.vehiclesService.getUserVehicles(user.id);
  }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get vehicle by ID with statistics' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Vehicle details', type: VehicleWithStatsResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async getVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<VehicleWithStatsResponseDto> {
    return this.vehiclesService.getVehicle(user.id, vehicleId);
  }

  @Put(':vehicleId')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Vehicle updated', type: VehicleResponseDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 409, description: 'License plate already exists' })
  async updateVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.updateVehicle(user.id, vehicleId, dto);
  }

  @Delete(':vehicleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete vehicle (only if no bookings)' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted' })
  @ApiResponse({ status: 400, description: 'Vehicle has existing bookings' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async deleteVehicle(
    @CurrentUser() user: any,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.vehiclesService.deleteVehicle(user.id, vehicleId);
  }

  @Get(':vehicleId/bookings')
  @ApiOperation({ summary: 'Get vehicle booking history' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status' })
  async getVehicleBookings(
    @CurrentUser() user: any,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
  ): Promise<{ data: VehicleBookingHistoryDto[]; meta: any }> {
    return this.vehiclesService.getVehicleBookingHistory(user.id, vehicleId, page, limit, status);
  }

  @Get(':vehicleId/upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings for vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  async getUpcomingBookings(
    @CurrentUser() user: any,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Query('limit') limit: number = 5,
  ): Promise<VehicleBookingHistoryDto[]> {
    return this.vehiclesService.getUpcomingBookings(user.id, vehicleId, limit);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get('admin/all')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all vehicles (admin/manager only)' })
  @ApiResponse({ status: 200, description: 'Paginated vehicle list' })
  async getAllVehicles(
    @Query() query: QueryVehiclesDto,
  ): Promise<{ data: any[]; meta: any }> {
    return this.vehiclesService.getAllVehicles(query);
  }

  @Get('admin/most-used')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get most used vehicles across platform (admin only)' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getMostUsedVehicles(
    @Query('limit') limit: number = 10,
  ): Promise<any[]> {
    return this.vehiclesService.getMostUsedVehicles(limit);
  }

  @Get('admin/client/:clientId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get vehicles by client ID (admin/manager only)' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getVehiclesByClient(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: VehicleResponseDto[]; meta: any }> {
    return this.vehiclesService.getVehiclesByClient(clientId, page, limit);
  }

  @Get('admin/:vehicleId')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get vehicle by ID (admin/manager only)' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  async getVehicleByIdAdmin(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<any> {
    return this.vehiclesService.getVehicleByIdAdmin(vehicleId);
  }

  @Put('admin/:vehicleId/archive')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive vehicle (admin only)' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  async archiveVehicle(
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.vehiclesService.archiveVehicle(vehicleId);
  }
}