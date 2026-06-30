import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ReviewBookingDto } from './dto/review-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { BookingClientService } from './services/booking-client.service';
import { BookingManagerService } from './services/booking-manager.service';
import { BookingAdminService } from './services/booking-admin.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingClientService: BookingClientService,
    private readonly bookingManagerService: BookingManagerService,
    private readonly bookingAdminService: BookingAdminService,
  ) {}

  // ==================== CLIENT WORKFLOWS ====================
  async createBooking(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.createBooking(userId, dto);
  }
  async getClientBookings(userId: string, query: BookingQueryDto) {
    return this.bookingClientService.getClientBookings(userId, query);
  }
  async getClientBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    return this.bookingClientService.getClientBooking(userId, bookingId);
  }
  async cancelBookingByClient(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.cancelBookingByClient(userId, bookingId, dto);
  }
  async rescheduleBookingByClient(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    return this.bookingClientService.rescheduleBookingByClient(userId, bookingId, dto);
  }

  // ==================== MANAGER WORKFLOWS ====================
  async getManagerBookings(userId: string, query: BookingQueryDto) {
    return this.bookingManagerService.getManagerBookings(userId, query);
  }
  async getManagerBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    return this.bookingManagerService.getManagerBooking(userId, bookingId);
  }
  async reviewBookingByManager(userId: string, bookingId: string, dto: ReviewBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.reviewBookingByManager(userId, bookingId, dto);
  }
  async updateBookingStatusByManager(userId: string, bookingId: string, dto: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.updateBookingStatusByManager(userId, bookingId, dto);
  }
  async rescheduleBookingByManager(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.rescheduleBookingByManager(userId, bookingId, dto);
  }
  async cancelBookingByManager(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    return this.bookingManagerService.cancelBookingByManager(userId, bookingId, dto);
  }

  // ==================== ADMIN WORKFLOWS ====================
  async getAdminBookings(query: BookingQueryDto) {
    return this.bookingAdminService.getAdminBookings(query);
  }
  async getAdminBooking(bookingId: string): Promise<BookingResponseDto> {
    return this.bookingAdminService.getAdminBooking(bookingId);
  }
  async getBookingsByManager(managerId: string, query: BookingQueryDto) {
    return this.bookingAdminService.getBookingsByManager(managerId, query);
  }
  async getBookingsByUser(clientUserId: string, query: BookingQueryDto) {
    return this.bookingAdminService.getBookingsByUser(clientUserId, query);
  }
}
