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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto, ProcessPaymentResponseDto } from './dto/process-payment.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { CreateDisputeDto, DisputeResponseDto } from './dto/dispute-payment.dto';
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
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
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

  // ==================== WEBHOOK (Public) ====================

  @Post('webhook/:provider')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment provider webhook endpoint' })
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
  ): Promise<{ received: boolean }> {
    return this.paymentsService.handleWebhook(provider, payload);
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