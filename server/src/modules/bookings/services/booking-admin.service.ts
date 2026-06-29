import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';

@Injectable()
export class BookingAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
  ) {}

  async getAdminBookings(query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findAdminBookings(query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }

  async getAdminBooking(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.bookingsRepository.findAdminBooking(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(booking, images);
  }

  async getBookingsByManager(managerId: string, query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findManagerBookings(managerId, query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }

  async getBookingsByUser(clientUserId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId: clientUserId } });
    if (!client) throw new NotFoundException('Client user profile not found');

    const [bookings, total] = await this.bookingsRepository.findClientBookings(client.id, query);
    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        return this.bookingMapper.toResponseDto(b, images);
      })
    );
    return { data: formatted, meta: { total, page: query.page ?? 1, limit: query.limit ?? 20, totalPages: Math.ceil(total / (query.limit ?? 20)) } };
  }
}
