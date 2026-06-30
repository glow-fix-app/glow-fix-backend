import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { PaymentsService } from '../../payments/services/payments.service';
import { PaymentPayoutService } from '../../payments/services/payment-payout.service';
import { BookingsRepository } from '../repositories/bookings.repository';
import { BookingMapper } from '../mappers/booking.mapper';
import { BookingStateMachineService } from './booking-state-machine.service';
import { BookingQueryDto } from '../dto/booking-query.dto';
import { UpdateBookingStatusDto } from '../dto/update-booking-status.dto';
import { ReviewBookingDto, ReviewStatus } from '../dto/review-booking.dto';
import { RescheduleBookingDto } from '../dto/reschedule-booking.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { Prisma } from '@prisma/client';
import { BOOKING_MANAGER_ADMIN_INCLUDE } from '../entities/booking.entity';

@Injectable()
export class BookingManagerService {
  private readonly logger = new Logger(BookingManagerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
    private readonly paymentPayoutService: PaymentPayoutService,
    private readonly bookingsRepository: BookingsRepository,
    private readonly bookingMapper: BookingMapper,
    private readonly stateMachine: BookingStateMachineService,
  ) {}

  async getManagerBookings(userId: string, query: BookingQueryDto) {
    const [bookings, total] = await this.bookingsRepository.findManagerBookings(userId, query);
    
    const userIds = bookings.map((b) => b.vehicle?.client?.user?.id).filter(Boolean) as string[];
    const avatars = userIds.length > 0 ? await this.prisma.image.findMany({
      where: { entityType: 'USER_AVATAR', entityId: { in: userIds } },
      select: { entityId: true, url: true }
    }) : [];
    const avatarMap = new Map<string, string>(avatars.map((a) => [a.entityId, a.url]));

    const formatted = await Promise.all(
      bookings.map(async (b) => {
        const images = await this.bookingsRepository.getBookingImages(b.id);
        const uId = b.vehicle?.client?.user?.id;
        const avatarUrl = uId ? (avatarMap.get(uId) || null) : null;
        return this.bookingMapper.toResponseDto(b, images, avatarUrl);
      })
    );

    return {
      data: formatted,
      meta: {
        total,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        totalPages: Math.ceil(total / (query.limit ?? 20))
      }
    };
  }

  async getManagerBooking(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.bookingsRepository.findManagerBooking(userId, bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    const images = await this.bookingsRepository.getBookingImages(booking.id);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(booking.vehicleId);
    return this.bookingMapper.toResponseDto(booking, images, avatarUrl);
  }

  async reviewBookingByManager(userId: string, bookingId: string, dto: ReviewBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } }, items: true }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    if (currentStatus !== 'PENDING') throw new BadRequestException(`Booking is already reviewed or processed. Current status: ${currentStatus}`);

    let updatedBooking;

    if (dto.status === ReviewStatus.REJECTED) {
      updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'REJECTED', async (tx) => {
        await tx.bookingCancellation.create({
          data: { bookingId, cancelledBy: userId, reason: dto.rejectionReason ?? 'Rejected by manager' }
        });
      });
      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CANCELLED',
          title: 'Booking Request Rejected',
          body: `Your booking request ${booking.id.slice(0,8)} has been rejected by the provider. Reason: ${dto.rejectionReason ?? 'Provider choice'}`,
          actionUrl: `/client/bookings/${booking.id}`
        });
      } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }
    } else {
      updatedBooking = await this.prisma.$transaction(async (tx) => {
        const acceptedStatus = await tx.status.findFirst({ where: { context: 'ACCEPTED' } });
        if (!acceptedStatus) throw new Error('ACCEPTED status missing');

        if (dto.items && dto.items.length > 0) {
          const activeItemBsIds = booking.items.map(i => i.businessServiceId);
          for (const item of dto.items) {
            if (!activeItemBsIds.includes(item.businessServiceId)) throw new BadRequestException(`Item ${item.businessServiceId} is not in the original booking request`);
            if (item.price !== undefined) {
              await tx.bookingItem.updateMany({
                where: { bookingId, businessServiceId: item.businessServiceId },
                data: { price: new Prisma.Decimal(item.price.toString()) }
              });
            }
          }
        }

        const finalItems = await tx.bookingItem.findMany({ where: { bookingId } });
        const subTotal = finalItems.reduce((sum, item) => sum + Number(item.price), 0);
        const setting = await tx.setting.findFirst();
        const feePct = setting?.businessFeePct ? Number(setting.businessFeePct) : 10.0;
        const commission = (subTotal * feePct) / 100;
        const platformFee = Number((booking as any).platformFee || 0);
        const totalPrice = subTotal + platformFee;

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            subTotal: new Prisma.Decimal(subTotal.toString()),
            commission: new Prisma.Decimal(commission.toString()),
            totalPrice: new Prisma.Decimal(totalPrice.toString()),
            ...(dto.expectedDeliveryAt && { expectedDeliveryAt: new Date(dto.expectedDeliveryAt) }),
          }
        });

        await tx.bookingStatus.create({
          data: { bookingId, statusId: acceptedStatus.id }
        });

        const pendingPaymentStatus = await tx.status.findFirst({ where: { context: 'PAYMENT_PENDING' } });
        let defaultPaymentMethod = await tx.paymentMethod.findFirst({ where: { name: 'CASH' } });
        if (!defaultPaymentMethod) {
          defaultPaymentMethod = await tx.paymentMethod.create({ data: { name: 'CASH', isEnabled: true } });
        }
        if (pendingPaymentStatus && defaultPaymentMethod) {
          await tx.payment.upsert({
            where: { bookingId },
            create: { bookingId, amount: new Prisma.Decimal(totalPrice.toString()), currency: 'EGP', statusId: pendingPaymentStatus.id, paymentMethodId: defaultPaymentMethod.id, provider: 'system' },
            update: { amount: new Prisma.Decimal(totalPrice.toString()) }
          });
        }
        return tx.booking.findUnique({ where: { id: bookingId }, include: BOOKING_MANAGER_ADMIN_INCLUDE });
      }, { maxWait: 5000, timeout: 20000 });

      try {
        await this.notificationsService.createNotification({
          recipientUserId: booking.vehicle.client.userId,
          actorUserId: userId,
          typeCode: 'BOOKING_CONFIRMED',
          title: 'Booking Request Approved',
          body: `Your booking request ${booking.id.slice(0,8)} has been accepted by the provider! Please proceed to payment.`,
          actionUrl: `/client/bookings/${booking.id}`
        });
      } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }
    }

    if (!updatedBooking) throw new Error('Failed to retrieve updated booking');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async updateBookingStatusByManager(userId: string, bookingId: string, dto: UpdateBookingStatusDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } }, payment: { include: { status: true } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const targetStatus = dto.status === 'READY' ? 'READY_FOR_PICKUP' : dto.status;

    if (targetStatus === 'CONFIRMED' || targetStatus === 'ACCEPTED') throw new BadRequestException('Booking cannot be manually changed to ACCEPTED or CONFIRMED.');
    if (targetStatus === 'COMPLETED') {
      const paymentStatus = booking.payment?.status?.context;
      if (paymentStatus !== 'PAID') throw new BadRequestException('Booking cannot be marked as COMPLETED until payment is fully paid.');
    }

    this.stateMachine.validateTransition(currentStatus, targetStatus);
    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, targetStatus);

    try {
      const clientUserId = booking.vehicle.client.userId;
      const ref = booking.id.slice(0, 8);
      switch (targetStatus) {
        case 'VEHICLE_RECEIVED':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'VEHICLE_RECEIVED', title: 'Vehicle Received', body: `Your vehicle is received by the workshop for Booking ${ref}`, actionUrl: `/client/bookings/${bookingId}` });
          break;
        case 'IN_PROGRESS':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'SERVICE_IN_PROGRESS', title: 'Service In Progress', body: `The service has officially started on your vehicle for Booking ${ref}`, actionUrl: `/client/bookings/${bookingId}` });
          break;
        case 'READY_FOR_PICKUP':
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'READY_FOR_PICKUP', title: 'Ready for Pickup', body: `Your vehicle is ready! Please complete payment and pick up your vehicle. Booking ${ref}`, actionUrl: `/client/bookings/${bookingId}` });
          break;
        case 'COMPLETED':
          try {
            await this.paymentPayoutService.createPayoutForCompletedBooking(bookingId);
          } catch (err: unknown) {
            this.logger.error(`Payout failed: ${(err as Error).message}`);
          }
          const config = await this.prisma.loyaltyConfig.findFirst();
          if (booking.payment && Number(booking.payment.amount) > 0 && config?.isActive) {
            const amount = Number(booking.payment.amount);
            const pointsEarned = Math.floor((amount / 100) * config.pointsPer100Egp);
            await this.prisma.loyaltyTransaction.create({
              data: { clientId: booking.vehicle.clientId, bookingId: booking.id, type: 'EARNED', points: pointsEarned, reason: `Earned ${pointsEarned} points from booking (${amount} EGP)`, },
            });
            await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'POINTS_EARNED', title: 'Loyalty Points Earned!', body: `You just earned ${pointsEarned} points for completing Booking ${ref}!`, actionUrl: `/client/loyalty` });
          }
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'BOOKING_COMPLETED', title: 'Booking Completed', body: `Thank you for choosing us! Booking ${ref} is now completed.`, actionUrl: `/client/bookings/${bookingId}` });
          await this.notificationsService.createNotification({ recipientUserId: clientUserId, actorUserId: userId, typeCode: 'NEW_REVIEW', title: 'Rate Your Service', body: `Please take a moment to rate and review your completed booking ${ref}.`, actionUrl: `/client/bookings/${bookingId}` });
          break;
      }
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    if (!updatedBooking) throw new NotFoundException('Updated booking not found');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async rescheduleBookingByManager(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const restrictedRescheduleStates = ['READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'REJECTED'];
    if (restrictedRescheduleStates.includes(currentStatus)) throw new BadRequestException(`Cannot reschedule booking in status: ${currentStatus}`);

    const newDate = new Date(dto.scheduledAt);
    if (newDate.getTime() <= Date.now()) throw new BadRequestException('New scheduled date must be in the future');

    const updatedBooking = await this.bookingsRepository.updateBookingData(bookingId, { scheduledAt: newDate });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CONFIRMED',
        title: 'Booking Rescheduled by Provider',
        body: `The provider rescheduled Booking ${booking.id.slice(0,8)} to ${newDate.toLocaleString()}`,
        actionUrl: `/client/bookings/${bookingId}`
      });
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }

  async cancelBookingByManager(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, business: { managerId: userId } },
      include: { vehicle: { include: { client: { include: { user: true } } } }, statusHistory: { include: { status: true }, orderBy: { createdAt: 'asc' } } }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);
    const uncancelableStates = ['COMPLETED', 'CANCELLED', 'REJECTED'];
    if (uncancelableStates.includes(currentStatus)) throw new BadRequestException(`Cannot cancel booking from its current status: ${currentStatus}`);

    const updatedBooking = await this.bookingsRepository.transitionStatus(bookingId, 'CANCELLED', async (tx) => {
      await tx.bookingCancellation.create({
        data: { bookingId, cancelledBy: userId, reason: dto.reason ?? 'Cancelled by manager' }
      });
    });

    try {
      await this.notificationsService.createNotification({
        recipientUserId: booking.vehicle.client.userId,
        actorUserId: userId,
        typeCode: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled by Provider',
        body: `Your booking ${booking.id.slice(0,8)} has been cancelled by the provider. Reason: ${dto.reason ?? 'Provider request'}`,
        actionUrl: `/client/bookings/${bookingId}`
      });
    } catch (err) { this.logger.error(`Notification failed: ${(err as any).message}`); }

    if (!updatedBooking) throw new NotFoundException('Updated booking not found');
    const images = await this.bookingsRepository.getBookingImages(bookingId);
    const avatarUrl = await this.bookingsRepository.getUserAvatarByVehicleId(updatedBooking.vehicleId);
    return this.bookingMapper.toResponseDto(updatedBooking, images, avatarUrl);
  }
}
