import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './services/payments.service';
import { PaymentWebhookService } from './services/payment-webhook.service';
import { PaymentPayoutService } from './services/payment-payout.service';
import { ProcessPaymentDto, ConfirmPaymentDto } from './dto/request/process-payment.dto';
import { CreateDisputeDto } from './dto/request/create-dispute.dto';
import { ProcessPaymentResponseDto } from './dto/response/process-payment-response.dto';
import { PaymentResponseDto, ReceiptResponseDto } from './dto/response/payment-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '@glow-fix/types';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentWebhookService: PaymentWebhookService,
    private readonly paymentPayoutService: PaymentPayoutService,
  ) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process payment for a booking' })
  @ApiResponse({ status: 200, description: 'Payment processed', type: ProcessPaymentResponseDto })
  async processPayment(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ProcessPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    return this.paymentsService.processPayment(user.sub, dto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment after Stripe confirmation' })
  @ApiResponse({ status: 200, description: 'Payment confirmed', type: ProcessPaymentResponseDto })
  async confirmPayment(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ConfirmPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    return this.paymentsService.confirmPayment(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user payment history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getUserPayments(
    @CurrentUser() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: PaymentResponseDto[]; meta: any }> {
    return this.paymentsService.getUserPayments(user.sub, page, limit);
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'paymentId', description: 'Payment UUID' })
  async getPayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.getPayment(paymentId, user.sub, user.role);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payment for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async getBookingPayment(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<PaymentResponseDto | null> {
    return this.paymentsService.getBookingPayment(bookingId, user.sub);
  }

  @Get(':paymentId/receipt')
  @ApiOperation({ summary: 'Get payment receipt' })
  @ApiParam({ name: 'paymentId', description: 'Payment UUID' })
  async getReceipt(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<ReceiptResponseDto> {
    return this.paymentsService.getReceipt(paymentId, user.sub);
  }

  // ==================== DISPUTES ====================

  @Post('disputes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment dispute' })
  async createDispute(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDisputeDto,
  ): Promise<{ success: boolean; dispute_id: string }> {
    return this.paymentsService.createDispute(user.sub, dto);
  }

  // ==================== STRIPE WEBHOOK (Public) ====================

  @Post('webhook/stripe')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    // Express raw body is needed for signature verification
    const rawPayload = Buffer.isBuffer(req.body) ? req.body : (req as any).rawBody;
    
    if (!rawPayload) {
      throw new Error('Webhook requires raw body parsing. Check your NestJS raw body configuration.');
    }
    
    return this.paymentWebhookService.handleStripeWebhook(Buffer.from(rawPayload), signature);
  }

  // ==================== BUSINESS/MANAGER ENDPOINTS ====================

  @Get('business/:businessId/payouts')
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Get business payouts (manager only)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getBusinessPayouts(
    @CurrentUser() user: JwtPayload,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    return this.paymentPayoutService.getBusinessPayouts(user.sub, businessId, page, limit);
  }
}