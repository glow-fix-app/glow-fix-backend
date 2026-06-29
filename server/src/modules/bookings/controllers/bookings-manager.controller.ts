import { Controller, Get, Patch, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from '../bookings.service';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto';
import { ReviewBookingDto } from '../dto/review-booking.dto';
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Bookings (Manager)')
@ApiBearerAuth()
@Roles('MANAGER')
@Controller({ path: 'manager/bookings', version: '1' })
export class BookingsManagerController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List provider\'s bookings (Manager)' })
  @ApiResponse({ status: 200 })
  async getManagerBookings(
    @CurrentUser() user: any,
    @Query() query: BookingQueryDto
  ) {
    return this.bookingsService.getManagerBookings(user.id, query);
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get details of a booking (Manager)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async getManagerBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getManagerBooking(user.id, bookingId);
  }

  @Patch(':bookingId/review')
  @ApiOperation({ summary: 'Accept or reject booking request and optionally negotiate prices (Manager)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async reviewBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: ReviewBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.reviewBookingByManager(user.id, bookingId, dto);
  }

  @Patch(':bookingId/status')
  @ApiOperation({ summary: 'Update progress status of a booking (Manager)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async updateStatus(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: UpdateBookingStatusDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.updateBookingStatusByManager(user.id, bookingId, dto);
  }

  @Patch(':bookingId/reschedule')
  @ApiOperation({ summary: 'Reschedule booking date & time (Manager)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async rescheduleBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: RescheduleBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.rescheduleBookingByManager(user.id, bookingId, dto);
  }

  @Patch(':bookingId/cancel')
  @ApiOperation({ summary: 'Cancel booking (Manager)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async cancelBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: CancelBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.cancelBookingByManager(user.id, bookingId, dto);
  }
}
