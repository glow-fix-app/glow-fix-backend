import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingStateMachineService } from './booking-state-machine.service';
import { BookingFinancialsService } from './booking-financials.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';

@Injectable()
export class BookingClientService {
  private readonly logger = new Logger(BookingClientService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
    private readonly stateMachine: BookingStateMachineService,
    private readonly financials: BookingFinancialsService,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
      include: { user: true }
    });
    if (!client) throw new ForbiddenException('User is not registered as a client');

    const vehicle = await this.prisma.clientVehicle.findFirst({
      where: { id: dto.vehicleId, clientId: client.id }
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found or does not belong to you');

    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
      include: { manager: true, operatingHours: true }
    });
    if (!business) throw new NotFoundException('Business/Provider not found');

    const businessServices = await this.prisma.businessService.findMany({
      where: { id: { in: dto.items.map(item => item.businessServiceId) }, businessId: dto.businessId, isActive: true },
      include: { service: true }
    });
    if (businessServices.length !== dto.items.length) {
      throw new BadRequestException('Some selected services are invalid, inactive, or not offered by this provider');
    }

    const scheduledAt = new Date(dto.scheduledAt);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);
    maxDate.setHours(23, 59, 59, 999);

    if (isNaN(scheduledAt.getTime())) throw new BadRequestException('Invalid scheduled date/time');
    if (scheduledAt.getTime() <= now.getTime()) throw new BadRequestException('Scheduled time must be in the future');
    if (scheduledAt.getTime() > maxDate.getTime()) throw new BadRequestException('Scheduled time cannot be more than 7 days in advance');

    if (business.operatingHours && business.operatingHours.length > 0) {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Cairo',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(scheduledAt);

      const dayName = parts.find(p => p.type === 'weekday')?.value;
      const hour = parts.find(p => p.type === 'hour')?.value;
      const minute = parts.find(p => p.type === 'minute')?.value;
      const dayMap: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
      const dayOfWeek = dayName ? dayMap[dayName] : scheduledAt.getDay();
      const timeString = hour && minute ? `${hour}:${minute}` : `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`;
      const hoursForDay = business.operatingHours.find(h => h.dayOfWeek === dayOfWeek);
      if (!hoursForDay || (!hoursForDay.openTime && !hoursForDay.closeTime)) throw new BadRequestException('The provider is closed on the selected day');
      if (hoursForDay.openTime && hoursForDay.closeTime) {
        if (timeString < hoursForDay.openTime || timeString > hoursForDay.closeTime) throw new BadRequestException(`The selected time is outside the provider's operating hours (${hoursForDay.openTime} - ${hoursForDay.closeTime})`);
      }
    }

    const subTotal = businessServices.reduce((sum, bs) => sum + Number(bs.price), 0);
    const fin = await this.financials.calculateFinancials(subTotal);

    const booking = await this.bookingsRepository.createBooking({
      userId,
      clientId: client.id,
      vehicleId: dto.vehicleId,
      businessId: dto.businessId,
      scheduledAt: new Date(dto.scheduledAt),
      expectedDeliveryAt: dto.expectedDeliveryAt ? new Date(dto.expectedDeliveryAt) : undefined,
      note: dto.note,
      images: dto.images,
      businessServices,
      subTotal: fin.subTotal,
      platformFee: fin.platformFee,
      commission: fin.commission,
      totalPrice: fin.totalPrice
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'New Booking Request',
        body: `Client ${client.user.fullName} requested a booking for ${vehicle.licensePlate} scheduled at ${new Date(dto.scheduledAt).toLocaleString()}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    return this.bookingMapper.toResponseDto(booking, dto.images?.map(img => img.url) || []);
  }

  async getClientBookings(userId: string, query: BookingQueryDto) {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const [bookings, total] = await this.bookingsRepository.findClientBookings(client.id, query);
    return this.bookingMapper.toPaginatedResponse(bookings, total, query.page ?? 1, query.limit ?? 20, undefined, (id) => []); // Assuming getImagesForBooking is done later if needed
  }

  async getClientBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.bookingsRepository.findClientBooking(client.id, bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const loc = await this.bookingsRepository.resolveBusinessLocation(booking.businessId);
    if (loc) {
      booking.business.latitude = loc.latitude;
      booking.business.longitude = loc.longitude;
    }
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(booking, images);
  }

  async cancelBookingByClient(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: { business: true, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const cancellableStates = ['PENDING', 'CONFIRMED', 'VEHICLE_RECEIVED'];
    if (!cancellableStates.includes(currentStatus)) {
      throw new BadRequestException(`Booking cannot be cancelled once work has started. Current status: ${currentStatus}`);
    }

    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'CANCELLED', async (tx) => {
      await tx.bookingCancellation.create({
        data: { bookingId, cancelledBy: userId, reason: dto.reason ?? 'Cancelled by client' }
      });
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Client',
        body: `Booking ${booking.id.slice(0,8)} has been cancelled. Reason: ${dto.reason ?? 'Client request'}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    const images = await this.bookingsRepository.getBookingImages(booking.id);
    return this.bookingMapper.toResponseDto(updatedBooking, images);
  }

  async rescheduleBookingByClient(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new ForbiddenException('User is not registered as a client');
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, vehicle: { clientId: client.id } },
      include: { business: true, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
      throw new BadRequestException(`Cannot reschedule booking in status: ${currentStatus}`);
    }

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) throw new BadRequestException('New scheduled date must be in the future');

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const pendingStatus = await tx.status.findFirst({ where: { context: 'PENDING' } });
      if (!pendingStatus) throw new Error('PENDING status row missing');

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { scheduledAt: newDate, expectedDeliveryAt: null }
      });

      if (currentStatus !== 'PENDING') {
        await tx.bookingStatus.create({
          data: { bookingId, statusId: pendingStatus.id }
        });
      }
      return updated;
    });

    const fullBooking = await this.bookingsRepository.findClientBooking(client.id, bookingId);

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.business.managerId,
        actorUserId: userId,
        typeCode: 'BOOKING_REQUESTED',
        title: 'Booking Rescheduled by Client',
        body: `Client requested to reschedule Booking ${booking.id.slice(0,8)} to ${newDate.toLocaleString()}`,
        actionUrl: `/manager/bookings/${booking.id}`
      });
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    const images = await this.bookingsRepository.getBookingImages(bookingId);
    return this.bookingMapper.toResponseDto(fullBooking, images);
  }
}
