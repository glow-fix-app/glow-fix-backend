import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { BookingQueryDto } from './dto/booking-query.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Bookings (Admin)')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller({ path: 'admin/bookings', version: '1' })
export class BookingsAdminController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings in system (Admin)' })
  @ApiResponse({ status: 200 })
  async getAllBookings(@Query() query: BookingQueryDto) {
    return this.bookingsService.getAdminBookings(query);
  }

  @Get('manager/:managerId')
  @ApiOperation({ summary: 'Get all bookings of a manager\'s business (Admin)' })
  @ApiResponse({ status: 200 })
  async getBookingsByManager(
    @Param('managerId', ParseUUIDPipe) managerId: string,
    @Query() query: BookingQueryDto
  ) {
    return this.bookingsService.getBookingsByManager(managerId, query);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings of a user/client (Admin)' })
  @ApiResponse({ status: 200 })
  async getBookingsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: BookingQueryDto
  ) {
    return this.bookingsService.getBookingsByUser(userId, query);
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get details of any booking (Admin)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async getBookingDetails(
    @Param('bookingId') bookingId: string
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getAdminBooking(bookingId);
  }
}
