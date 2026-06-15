import {
  Controller, Get, Post, Patch, Body, Param, Query,
  ParseUUIDPipe, UseInterceptors, UploadedFiles, BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StorageService } from '../../core/storage/storage.service';

@ApiTags('Bookings (Client)')
@ApiBearerAuth()
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly storageService: StorageService,
  ) {}

  // ── Upload booking problem photos ──────────────────────────────────────────

  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload problem photos for a booking (max 5)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns uploaded image URLs and storage keys' })
  async uploadBookingImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ urls: string[]; images: { url: string; storageKey: string }[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image file is required');
    }

    const uploads = await Promise.all(
      files.map((file) =>
        this.storageService.uploadImage(file.buffer, 'bookings/problems', {
          width: 1200,
          height: 1200,
          quality: 85,
        }),
      ),
    );

    return {
      urls: uploads.map((r) => r.url),
      images: uploads.map((r) => ({ url: r.url, storageKey: r.storageKey })),
    };
  }


  @Post(['', 'create'])
  @ApiOperation({ summary: 'Create a new booking request (Client)' })
  @ApiResponse({ status: 201, type: BookingResponseDto })
  async createBooking(
    @CurrentUser() user: any,
    @Body() dto: CreateBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get(['', 'my-bookings'])
  @ApiOperation({ summary: 'List client\'s own bookings (Client)' })
  @ApiResponse({ status: 200 })
  async getMyBookings(
    @CurrentUser() user: any,
    @Query() query: BookingQueryDto
  ) {
    return this.bookingsService.getClientBookings(user.id, query);
  }

  @Get([':bookingId', 'my-bookings/:bookingId'])
  @ApiOperation({ summary: 'Get details of a client\'s booking (Client)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async getMyBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getClientBooking(user.id, bookingId);
  }

  @Patch([':bookingId/cancel', 'my-bookings/:bookingId/cancel'])
  @ApiOperation({ summary: 'Cancel a booking request (Client)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async cancelBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: CancelBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.cancelBookingByClient(user.id, bookingId, dto);
  }

  @Patch([':bookingId/reschedule', 'my-bookings/:bookingId/reschedule'])
  @ApiOperation({ summary: 'Reschedule a booking request (Client)' })
  @ApiResponse({ status: 200, type: BookingResponseDto })
  async rescheduleBooking(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Body() dto: RescheduleBookingDto
  ): Promise<BookingResponseDto> {
    return this.bookingsService.rescheduleBookingByClient(user.id, bookingId, dto);
  }
}
