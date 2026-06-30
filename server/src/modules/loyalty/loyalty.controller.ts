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
import { LoyaltyService } from './services/loyalty.service';
import { LoyaltyConfigService } from './services/loyalty-config.service';
import { LoyaltyRedemptionService } from './services/loyalty-redemption.service';
import { LoyaltyRepository } from './repositories/loyalty.repository';
import { UpdateLoyaltyConfigDto } from './dto/request/update-loyalty-config.dto';
import { LoyaltyConfigResponseDto } from './dto/response/loyalty-config-response.dto';
import { RedeemPointsDto } from './dto/request/redeem-points.dto';
import { CalculateRedemptionDto } from './dto/request/calculate-redemption.dto';
import { RedemptionResultDto, RedemptionCalculationResponseDto, QuickRedeemResponseDto } from './dto/response/redemption-response.dto';
import { LoyaltySummaryResponseDto } from './dto/response/loyalty-summary-response.dto';
import { LoyaltyTransactionResponseDto } from './dto/response/loyalty-transaction-response.dto';
import { AdminLoyaltyStatsResponseDto } from './dto/response/admin-stats-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtPayload } from '@glow-fix/types';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Loyalty')
@ApiBearerAuth()
@Controller({ path: 'loyalty', version: '1' })
export class LoyaltyController {
  constructor(
    private readonly loyaltyService: LoyaltyService,
    private readonly configService: LoyaltyConfigService,
    private readonly redemptionService: LoyaltyRedemptionService,
    private readonly repository: LoyaltyRepository,
  ) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Get('summary')
  @ApiOperation({ summary: 'Get loyalty summary (points balance, tier, etc.)' })
  @ApiResponse({ status: 200, description: 'Loyalty summary', type: LoyaltySummaryResponseDto })
  async getSummary(@CurrentUser() user: JwtPayload): Promise<LoyaltySummaryResponseDto> {
    const clientId = await this.getClientId(user.sub);
    return this.loyaltyService.getClientSummary(clientId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get loyalty transaction history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'type', required: false, enum: ['EARNED', 'REDEEMED'] })
  async getTransactions(
    @CurrentUser() user: JwtPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('type') type?: string,
  ): Promise<{ data: LoyaltyTransactionResponseDto[]; meta: any }> {
    const clientId = await this.getClientId(user.sub);
    return this.loyaltyService.getTransactionHistory(clientId, page, limit, type);
  }

  @Get('quick-redeem')
  @ApiOperation({ summary: 'Get quick redeem options (UI: 100 pts → EGP 10)' })
  @ApiResponse({ status: 200, description: 'Quick redeem options', type: QuickRedeemResponseDto })
  async getQuickRedeemOptions(): Promise<QuickRedeemResponseDto> {
    return this.redemptionService.getQuickRedeemOptions();
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate potential redemption for a booking' })
  @ApiResponse({ status: 200, description: 'Redemption calculation', type: RedemptionCalculationResponseDto })
  async calculateRedemption(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CalculateRedemptionDto,
  ): Promise<RedemptionCalculationResponseDto> {
    const clientId = await this.getClientId(user.sub);
    return this.redemptionService.calculateRedemption(clientId, dto.total_amount, dto.points_to_redeem);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redeem points for booking discount or quick coupon' })
  @ApiResponse({ status: 200, description: 'Redemption result', type: RedemptionResultDto })
  async redeemPoints(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RedeemPointsDto,
  ): Promise<RedemptionResultDto> {
    const clientId = await this.getClientId(user.sub);
    
    if (dto.booking_id) {
      return this.redemptionService.redeemPointsForBooking(clientId, dto.booking_id, dto.points);
    } else if (dto.points) {
      return this.redemptionService.quickRedeem(clientId, dto.points);
    } else {
      // Default to quick redeem with 100 points
      return this.redemptionService.quickRedeem(clientId, 100);
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
    // We map it within the service for the get config endpoint
    // Actually the easiest way is to use the configService then map it.
    // Wait, let's just do it cleanly:
    const config = await this.configService.getConfig();
    return {
      id: config.id,
      points_per_100_egp: config.points_per_100_egp,
      egp_per_point: config.egp_per_point,
      max_redeem_pct: config.max_redeem_pct,
      min_points_to_redeem: config.min_points_to_redeem,
      points_expiry_days: config.points_expiry_days || undefined,
      is_active: config.is_active,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  @Put('config')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update loyalty configuration (admin only)' })
  @ApiResponse({ status: 200, description: 'Updated config', type: LoyaltyConfigResponseDto })
  async updateConfig(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateLoyaltyConfigDto,
  ): Promise<LoyaltyConfigResponseDto> {
    return this.configService.updateConfig(user.sub, dto);
  }

  @Get('admin/stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get loyalty stats for admin dashboard' })
  async getAdminStats(): Promise<AdminLoyaltyStatsResponseDto> {
    return this.loyaltyService.getAdminStats();
  }

  @Post('admin/adjust/:clientId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Manually adjust client points (admin only)' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  async adjustPoints(
    @CurrentUser() user: JwtPayload,
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body('points') points: number,
    @Body('reason') reason: string,
  ): Promise<{ success: boolean; new_balance: number; message: string }> {
    return this.loyaltyService.adjustPoints(user.sub, clientId, points, reason);
  }

  // ==================== PRIVATE HELPERS ====================

  private async getClientId(userId: string): Promise<string> {
    const client = await this.repository.findClientByUserId(userId);
    if (!client) {
      throw new NotFoundException('Client profile not found');
    }
    return client.id;
  }
}