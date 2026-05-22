// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Body,
//   Param,
//   Query,
//   UseGuards,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiQuery,
// } from '@nestjs/swagger';
// import { LoyaltyService } from './loyalty.service';
// import { RedeemPointsDto, CalculateRedemptionDto, RedemptionCalculationResponseDto, RedemptionResultDto } from './dto/redeem-points.dto';
// import { UpdateLoyaltyConfigDto, LoyaltyConfigResponseDto } from './dto/loyalty-config.dto';
// import { LoyaltySummaryResponseDto, LoyaltyTransactionResponseDto, LoyaltyLeaderboardEntryDto } from './dto/loyalty-transaction.dto';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Public } from '../../common/decorators/public.decorator';

// @ApiTags('loyalty')
// @ApiBearerAuth()
// @Controller('loyalty')
// export class LoyaltyController {
//   constructor(private readonly loyaltyService: LoyaltyService) {}

//   // ==================== CLIENT ENDPOINTS ====================

//   @Get('summary')
//   @ApiOperation({ summary: 'Get user loyalty summary (balance, value, stats)' })
//   @ApiResponse({ status: 200, description: 'Loyalty summary', type: LoyaltySummaryResponseDto })
//   async getSummary(@CurrentUser() user: any): Promise<LoyaltySummaryResponseDto> {
//     return this.loyaltyService.getClientSummary(user.id);
//   }

//   @Get('transactions')
//   @ApiOperation({ summary: 'Get loyalty transaction history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   @ApiQuery({ name: 'type', required: false, enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'ADJUSTED'] })
//   async getTransactions(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//     @Query('type') type?: string,
//   ): Promise<{ data: LoyaltyTransactionResponseDto[]; meta: any }> {
//     return this.loyaltyService.getTransactionHistory(user.id, page, limit, type);
//   }

//   @Post('calculate')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Calculate potential redemption for a booking' })
//   @ApiResponse({ status: 200, description: 'Redemption calculation', type: RedemptionCalculationResponseDto })
//   async calculateRedemption(
//     @CurrentUser() user: any,
//     @Body() dto: CalculateRedemptionDto,
//   ): Promise<RedemptionCalculationResponseDto> {
//     return this.loyaltyService.calculateRedemption(user.id, dto.total_amount, dto.points_to_redeem);
//   }

//   @Post('redeem')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Redeem points for booking discount or coupon' })
//   @ApiResponse({ status: 200, description: 'Redemption result', type: RedemptionResultDto })
//   async redeemPoints(
//     @CurrentUser() user: any,
//     @Body() dto: RedeemPointsDto,
//   ): Promise<RedemptionResultDto> {
//     if (dto.booking_id) {
//       return this.loyaltyService.redeemPointsForBooking(user.id, dto.booking_id, dto.points);
//     } else {
//       return this.loyaltyService.redeemPointsForCoupon(user.id, dto.points);
//     }
//   }

//   // ==================== ADMIN ENDPOINTS ====================

//   @Get('config')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Get loyalty configuration (admin only)' })
//   @ApiResponse({ status: 200, description: 'Loyalty config', type: LoyaltyConfigResponseDto })
//   async getConfig(): Promise<LoyaltyConfigResponseDto> {
//     return this.loyaltyService.getConfig();
//   }

//   @Put('config')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Update loyalty configuration (admin only)' })
//   @ApiResponse({ status: 200, description: 'Updated config', type: LoyaltyConfigResponseDto })
//   async updateConfig(
//     @CurrentUser() user: any,
//     @Body() dto: UpdateLoyaltyConfigDto,
//   ): Promise<LoyaltyConfigResponseDto> {
//     return this.loyaltyService.updateConfig(user.id, dto);
//   }

//   @Get('leaderboard')
//   @Public()
//   @ApiOperation({ summary: 'Get loyalty points leaderboard' })
//   @ApiResponse({ status: 200, description: 'Leaderboard', type: [LoyaltyLeaderboardEntryDto] })
//   async getLeaderboard(@Query('limit') limit: number = 50): Promise<LoyaltyLeaderboardEntryDto[]> {
//     return this.loyaltyService.getLeaderboard(limit);
//   }

//   @Post('adjust/:clientId')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Manually adjust client points (admin only)' })
//   async adjustPoints(
//     @CurrentUser() user: any,
//     @Param('clientId', ParseUUIDPipe) clientId: string,
//     @Body('points') points: number,
//     @Body('reason') reason: string,
//   ): Promise<{ success: boolean; points: number; message: string }> {
//     const adjustedPoints = await this.loyaltyService.adjustPoints(user.id, clientId, points, reason);
//     return {
//       success: true,
//       points: adjustedPoints,
//       message: `Successfully adjusted ${points} points for client`,
//     };
//   }
// }