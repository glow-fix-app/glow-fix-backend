import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { UpdateLoyaltyConfigDto, LoyaltyConfigResponseDto } from './dto/loyalty-config.dto';
import { RedeemPointsDto, CalculateRedemptionDto, RedemptionResultDto, RedemptionCalculationResponseDto } from './dto/redeem-points.dto';
import { LoyaltySummaryResponseDto, LoyaltyTransactionResponseDto, QuickRedeemResponseDto } from './dto/loyalty-transaction.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../core/prisma/prisma.service';

@ApiTags('Loyalty')
@ApiBearerAuth()
@Controller({ path: 'loyalty', version: '1' })
export class LoyaltyController {
  constructor(
    private readonly loyaltyService: LoyaltyService,
    private readonly prisma: PrismaService,
  ) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Get('summary')
  @ApiOperation({ summary: 'Get loyalty summary (points balance, tier, etc.)' })
  @ApiResponse({ status: 200, description: 'Loyalty summary', type: LoyaltySummaryResponseDto })
  async getSummary(@CurrentUser() user: any): Promise<LoyaltySummaryResponseDto> {
    const client = await this.getClientByUserId(user.id);
    return this.loyaltyService.getClientSummary(client.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get loyalty transaction history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'type', required: false, enum: ['EARNED', 'REDEEMED'] })
  async getTransactions(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('type') type?: string,
  ): Promise<{ data: LoyaltyTransactionResponseDto[]; meta: any }> {
    const client = await this.getClientByUserId(user.id);
    return this.loyaltyService.getTransactionHistory(client.id, page, limit, type);
  }

  @Get('quick-redeem')
  @ApiOperation({ summary: 'Get quick redeem options (UI: 100 pts → EGP 10)' })
  @ApiResponse({ status: 200, description: 'Quick redeem options', type: QuickRedeemResponseDto })
  async getQuickRedeemOptions(): Promise<QuickRedeemResponseDto> {
    return this.loyaltyService.getQuickRedeemOptions();
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate potential redemption for a booking' })
  @ApiResponse({ status: 200, description: 'Redemption calculation', type: RedemptionCalculationResponseDto })
  async calculateRedemption(
    @CurrentUser() user: any,
    @Body() dto: CalculateRedemptionDto,
  ): Promise<RedemptionCalculationResponseDto> {
    const client = await this.getClientByUserId(user.id);
    return this.loyaltyService.calculateRedemption(client.id, dto.total_amount, dto.points_to_redeem);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redeem points for booking discount or quick coupon' })
  @ApiResponse({ status: 200, description: 'Redemption result', type: RedemptionResultDto })
  async redeemPoints(
    @CurrentUser() user: any,
    @Body() dto: RedeemPointsDto,
  ): Promise<RedemptionResultDto> {
    const client = await this.getClientByUserId(user.id);
    
    if (dto.booking_id) {
      return this.loyaltyService.redeemPointsForBooking(client.id, dto.booking_id, dto.points);
    } else if (dto.points) {
      return this.loyaltyService.quickRedeem(client.id, dto.points);
    } else {
      // Default to quick redeem with 100 points
      return this.loyaltyService.quickRedeem(client.id, 100);
    }
  }

  @Get('leaderboard')
  @Public()
  @ApiOperation({ summary: 'Get loyalty points leaderboard' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  async getLeaderboard(@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 50): Promise<Array<{
    rank: number;
    client_id: string;
    client_name: string;
    total_points: number;
    avatar_url?: string;
  }>> {
    return this.loyaltyService.getLeaderboard(limit);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Get('config')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get loyalty configuration (admin only)' })
  @ApiResponse({ status: 200, description: 'Loyalty config', type: LoyaltyConfigResponseDto })
  async getConfig(): Promise<LoyaltyConfigResponseDto> {
    const config = await this.loyaltyService.getConfig();
    return this.loyaltyService.formatConfigResponse(config);
  }

  @Put('config')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update loyalty configuration (admin only)' })
  @ApiResponse({ status: 200, description: 'Updated config', type: LoyaltyConfigResponseDto })
  async updateConfig(
    @CurrentUser() user: any,
    @Body() dto: UpdateLoyaltyConfigDto,
  ): Promise<LoyaltyConfigResponseDto> {
    return this.loyaltyService.updateConfig(user.id, dto);
  }

  @Get('admin/stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get loyalty stats for admin dashboard' })
  async getAdminStats(): Promise<{
    total_points_issued: number;
    total_points_redeemed: number;
    active_clients_with_points: number;
    average_points_per_client: number;
    total_redemptions: number;
    total_discount_value: number;
  }> {
    return this.loyaltyService.getAdminStats();
  }

  @Post('admin/adjust/:clientId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Manually adjust client points (admin only)' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  async adjustPoints(
    @CurrentUser() user: any,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body('points') points: number,
    @Body('reason') reason: string,
  ): Promise<{ success: boolean; new_balance: number; message: string }> {
    return this.loyaltyService.adjustPoints(user.id, clientId, points, reason);
  }

  // ==================== PRIVATE HELPERS ====================

  private async getClientByUserId(userId: string): Promise<{ id: string }> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }
}