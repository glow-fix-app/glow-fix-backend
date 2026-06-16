// modules/admin/admin.controller.ts
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
import { AdminService } from './admin.service';
import {
  DashboardStatsDto,
  RevenueStatsDto,
  TopPerformersDto,
  PlatformHealthDto,
} from './dto/admin-stats.dto';
import {
  GetUsersAdminDto,
  CreateUserAdminDto,
  UpdateUserAdminDto,
  UserResponseAdminDto,
} from './dto/admin-users.dto';
import {
  GetBusinessesAdminDto,
  ApproveBusinessDto,
  RejectBusinessDto,
  RejectDocumentDto,
  BusinessResponseAdminDto,
} from './dto/admin-businesses.dto';
import {
  UpdateSystemSettingsDto,
  SystemSettingsResponseDto,
} from './dto/admin-settings.dto';
import {
  GetPayoutsAdminDto,
  ProcessPayoutDto,
} from './dto/admin-payouts.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics', type: DashboardStatsDto })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/revenue')
  @ApiOperation({ summary: 'Get revenue statistics' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Number of months for monthly data' })
  @ApiResponse({ status: 200, description: 'Revenue statistics', type: RevenueStatsDto })
  async getRevenueStats(
    @Query('period') period?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    @Query('months') months?: string,
  ): Promise<RevenueStatsDto> {
    return this.adminService.getRevenueStats(period, months ? parseInt(months) : 12);
  }

  @Get('dashboard/top-performers')
  @ApiOperation({ summary: 'Get top performing businesses and clients' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of top performers to return' })
  @ApiResponse({ status: 200, description: 'Top performers', type: TopPerformersDto })
  async getTopPerformers(@Query('limit') limit?: string): Promise<TopPerformersDto> {
    return this.adminService.getTopPerformers(limit ? parseInt(limit) : 10);
  }

  @Get('dashboard/health')
  @ApiOperation({ summary: 'Get platform health status' })
  @ApiResponse({ status: 200, description: 'Platform health', type: PlatformHealthDto })
  async getPlatformHealth(): Promise<PlatformHealthDto> {
    return this.adminService.getPlatformHealth();
  }

  // ==================== USER MANAGEMENT ====================

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers(@Query() query: GetUsersAdminDto): Promise<{ data: UserResponseAdminDto[]; meta: any }> {
    return this.adminService.getAllUsers(query);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseAdminDto })
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseAdminDto> {
    return this.adminService.getUserById(userId);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseAdminDto })
  async createUser(@Body() dto: CreateUserAdminDto): Promise<UserResponseAdminDto> {
    return this.adminService.createUser(dto);
  }

  @Put('users/:userId')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseAdminDto })
  async updateUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateUserAdminDto,
  ): Promise<UserResponseAdminDto> {
    return this.adminService.updateUser(userId, dto);
  }

  @Delete('users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ message: string }> {
    return this.adminService.deleteUser(userId);
  }

  // ==================== BUSINESS MANAGEMENT ====================

  @Get('businesses')
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiResponse({ status: 200, description: 'List of businesses' })
  async getAllBusinesses(@Query() query: GetBusinessesAdminDto): Promise<{ data: BusinessResponseAdminDto[]; meta: any }> {
    return this.adminService.getAllBusinesses(query);
  }

  @Get('businesses/:businessId')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiResponse({ status: 200, description: 'Business details' })
  async getBusinessById(@Param('businessId', ParseUUIDPipe) businessId: string): Promise<any> {
    return this.adminService.getBusinessById(businessId);
  }

  @Put('businesses/:businessId')
  @ApiOperation({ summary: 'Update business details' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  async updateBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() data: any,
  ): Promise<any> {
    return this.adminService.updateBusiness(businessId, data);
  }

  @Get('businesses/:businessId/bookings')
  @ApiOperation({ summary: 'Get bookings for a business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBusinessBookings(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<any> {
    return this.adminService.getBusinessBookings(
      businessId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('businesses/:businessId/reviews')
  @ApiOperation({ summary: 'Get reviews for a business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBusinessReviews(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<any> {
    return this.adminService.getBusinessReviews(
      businessId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Post('businesses/:businessId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  async approveBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: ApproveBusinessDto,
  ): Promise<{ message: string }> {
    return this.adminService.approveBusiness(businessId, dto);
  }

  @Post('businesses/:businessId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a business' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  async rejectBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: RejectBusinessDto,
  ): Promise<{ message: string }> {
    return this.adminService.rejectBusiness(businessId, dto);
  }

  @Post('businesses/:businessId/documents/:documentId/approve')
  @ApiOperation({ summary: 'Approve a business document' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiParam({ name: 'documentId', description: 'Document UUID' })
  async approveDocument(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<any> {
    return this.adminService.approveDocument(businessId, documentId);
  }

  @Post('businesses/:businessId/documents/:documentId/reject')
  @ApiOperation({ summary: 'Reject a business document' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiParam({ name: 'documentId', description: 'Document UUID' })
  async rejectDocument(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: RejectDocumentDto,
  ): Promise<any> {
    return this.adminService.rejectDocument(businessId, documentId, dto.reason);
  }

  // ==================== SYSTEM SETTINGS ====================

  @Get('settings')
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({ status: 200, description: 'System settings', type: SystemSettingsResponseDto })
  async getSettings(): Promise<SystemSettingsResponseDto> {
    return this.adminService.getSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({ status: 200, description: 'Settings updated', type: SystemSettingsResponseDto })
  async updateSettings(@Body() dto: UpdateSystemSettingsDto): Promise<SystemSettingsResponseDto> {
    return this.adminService.updateSettings(dto);
  }

  // ==================== PAYMENT & PAYOUT MANAGEMENT ====================

  @Get('payments')
  @ApiOperation({ summary: 'Get all platform payments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of payments' })
  async getAllPayments(@Query() query: any): Promise<{ data: any[]; meta: any }> {
    return this.adminService.getAllPayments(query);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get all payouts' })
  @ApiResponse({ status: 200, description: 'List of payouts' })
  async getAllPayouts(@Query() query: GetPayoutsAdminDto): Promise<{ data: any[]; meta: any }> {
    return this.adminService.getAllPayouts(query);
  }

  @Post('payouts/:payoutId/process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process a payout' })
  @ApiParam({ name: 'payoutId', description: 'Payout UUID' })
  async processPayout(
    @Param('payoutId', ParseUUIDPipe) payoutId: string,
    @Body() dto: ProcessPayoutDto,
  ): Promise<{ message: string }> {
    return this.adminService.processPayout(payoutId, dto);
  }

  @Get('payouts/:payoutId/receipt')
  @ApiOperation({ summary: 'Get payout receipt' })
  @ApiParam({ name: 'payoutId', description: 'Payout UUID' })
  async getPayoutReceipt(@Param('payoutId', ParseUUIDPipe) payoutId: string): Promise<any> {
    // TODO: Implement receipt generation/retrieval
    return { message: 'Receipt feature coming soon' };
  }

  // ==================== REVIEWS MANAGEMENT ====================

  @Get('reviews')
  @ApiOperation({ summary: 'Get all platform reviews' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of all reviews' })
  async getAllReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<{ data: any[]; meta: any }> {
    return this.adminService.getAllReviews({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }
}