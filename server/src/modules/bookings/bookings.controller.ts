import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input / outside operating hours' })
  @ApiResponse({ status: 403, description: 'Forbidden — only clients can book' })
  async createBooking(
    @CurrentUser() user: any,
    @Body() dto: CreateBookingDto,
  ) {
    if (user.role !== 'CLIENT') {
      throw new ForbiddenException('Only clients can create bookings');
    }
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List bookings with pagination' })
  @ApiResponse({ status: 200, description: 'List of bookings returned' })
  async getBookings(
    @CurrentUser() user: any,
    @Query() query: GetBookingsQueryDto,
  ) {
    return this.bookingsService.getBookings(user.id, user.role, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific booking' })
  @ApiResponse({ status: 200, description: 'Booking details returned' })
  @ApiResponse({ status: 403, description: 'Forbidden — unauthorized access' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingDetails(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.bookingsService.getBookingDetails(user.id, user.role, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an upcoming booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Too late to cancel / already inactive' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.cancelBooking(user.id, user.role, id, reason);
  }
}
