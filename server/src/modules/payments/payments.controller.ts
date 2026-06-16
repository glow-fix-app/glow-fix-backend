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
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import {
  ProcessPaymentDto,
  ProcessPaymentResponseDto,
  ConfirmPaymentDto,
} from './dto/process-payment.dto';
import { CreateDisputeDto } from './dto/dispute-payment.dto';
import { PaymentResponseDto, ReceiptResponseDto } from './dto/payment-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ==================== CLIENT ENDPOINTS ====================

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process payment for a booking' })
  @ApiResponse({ status: 200, description: 'Payment processed', type: ProcessPaymentResponseDto })
  async processPayment(
    @CurrentUser() user: any,
    @Body() dto: ProcessPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    return this.paymentsService.processPayment(user.id, dto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment after Stripe confirmation' })
  @ApiResponse({ status: 200, description: 'Payment confirmed', type: ProcessPaymentResponseDto })
  async confirmPayment(
    @CurrentUser() user: any,
    @Body() dto: ConfirmPaymentDto,
  ): Promise<ProcessPaymentResponseDto> {
    return this.paymentsService.confirmPayment(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user payment history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getUserPayments(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: PaymentResponseDto[]; meta: any }> {
    return this.paymentsService.getUserPayments(user.id, page, limit);
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'paymentId', description: 'Payment UUID' })
  async getPayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: any,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.getPayment(paymentId, user.id, user.role);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payment for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking UUID' })
  async getBookingPayment(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: any,
  ): Promise<PaymentResponseDto | null> {
    return this.paymentsService.getBookingPayment(bookingId, user.id);
  }

  @Get(':paymentId/receipt')
  @ApiOperation({ summary: 'Get payment receipt' })
  @ApiParam({ name: 'paymentId', description: 'Payment UUID' })
  async getReceipt(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @CurrentUser() user: any,
  ): Promise<ReceiptResponseDto> {
    return this.paymentsService.getReceipt(paymentId, user.id);
  }

  // ==================== DISPUTES ====================

  @Post('disputes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment dispute' })
  async createDispute(
    @CurrentUser() user: any,
    @Body() dto: CreateDisputeDto,
  ): Promise<{ success: boolean; dispute_id: string }> {
    return this.paymentsService.createDispute(user.id, dto);
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
    const payload = req.body;
    // Express raw body is needed for signature verification
    const rawPayload = Buffer.isBuffer(req.body) ? req.body : (req as any).rawBody;
    
    if (!rawPayload) {
      throw new Error('Webhook requires raw body parsing. Check your NestJS raw body configuration.');
    }
    
    return this.paymentsService.handleStripeWebhook(Buffer.from(rawPayload), signature);
  }

  // ==================== BUSINESS/MANAGER ENDPOINTS ====================

  @Get('business/:businessId/payouts')
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Get business payouts (manager only)' })
  @ApiParam({ name: 'businessId', description: 'Business UUID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getBusinessPayouts(
    @CurrentUser() user: any,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: any[]; meta: any }> {
    return this.paymentsService.getBusinessPayouts(user.id, businessId, page, limit);
  }
}