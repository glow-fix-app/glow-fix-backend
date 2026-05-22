// // modules/payments/payments.controller.ts
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Query,
//   UseGuards,
//   Res,
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
// } from '@nestjs/swagger';
// import { Response } from 'express';
// import { PaymentsService } from './payments.service';
// import { ProcessPaymentDto } from './dto/process-payment.dto';
// import { PaymentWebhookDto } from './dto/payment-webhook.dto';
// import { CreateDisputeDto } from './dto/dispute-payment.dto';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Public } from '../../common/decorators/public.decorator';
// import { Roles } from '../auth/decorators/roles.decorator';

// @ApiTags('payments')
// @ApiBearerAuth()
// @Controller('payments')
// export class PaymentsController {
//   constructor(private readonly paymentsService: PaymentsService) {}

//   @Post()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Process payment for a booking' })
//   @ApiResponse({ status: 200, description: 'Payment processed successfully' })
//   @ApiResponse({ status: 400, description: 'Invalid payment request' })
//   @ApiResponse({ status: 404, description: 'Booking not found' })
//   async processPayment(
//     @CurrentUser() user: any,
//     @Body() dto: ProcessPaymentDto,
//   ) {
//     return this.paymentsService.processPayment(user.id, dto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get user payment history' })
//   @ApiQuery({ name: 'page', required: false, example: 1 })
//   @ApiQuery({ name: 'limit', required: false, example: 20 })
//   async getUserPayments(
//     @CurrentUser() user: any,
//     @Query('page') page: number = 1,
//     @Query('limit') limit: number = 20,
//   ) {
//     return this.paymentsService.getUserPayments(user.id, page, limit);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get payment by ID' })
//   @ApiResponse({ status: 200, description: 'Payment details' })
//   @ApiResponse({ status: 404, description: 'Payment not found' })
//   async getPayment(
//     @Param('id', ParseUUIDPipe) id: string,
//     @CurrentUser() user: any,
//   ) {
//     return this.paymentsService.getPayment(id, user.id, user.role);
//   }

//   @Get('booking/:bookingId')
//   @ApiOperation({ summary: 'Get payment for a booking' })
//   async getBookingPayment(
//     @Param('bookingId', ParseUUIDPipe) bookingId: string,
//     @CurrentUser() user: any,
//   ) {
//     return this.paymentsService.getBookingPayment(bookingId, user.id);
//   }

//   @Get(':id/receipt')
//   @ApiOperation({ summary: 'Get payment receipt' })
//   async getReceipt(
//     @Param('id', ParseUUIDPipe) id: string,
//     @CurrentUser() user: any,
//   ) {
//     return this.paymentsService.getReceipt(id, user.id);
//   }

//   @Post('webhook/:provider')
//   @Public()
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Payment provider webhook endpoint' })
//   async handleWebhook(
//     @Param('provider') provider: string,
//     @Body() payload: any,
//   ) {
//     return this.paymentsService.handleWebhook(provider, payload);
//   }

//   // ==================== DISPUTES ====================

//   @Post('disputes')
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Create a payment dispute' })
//   async createDispute(
//     @CurrentUser() user: any,
//     @Body() dto: CreateDisputeDto,
//   ) {
//     return this.paymentsService.createDispute(user.id, dto);
//   }

//   @Post('disputes/:id/resolve')
//   @Roles('ADMIN')
//   @ApiOperation({ summary: 'Resolve a dispute (admin only)' })
//   async resolveDispute(
//     @Param('id') id: string,
//     @Body('resolution') resolution: string,
//     @Body('outcome') outcome: 'refund' | 'reject',
//     @Body('refundAmount') refundAmount?: number,
//   ) {
//     return this.paymentsService.resolveDispute(id, resolution, outcome, refundAmount);
//   }
// }