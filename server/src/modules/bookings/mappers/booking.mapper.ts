import { Injectable } from '@nestjs/common';
import { BookingResponseDto } from '../dto/booking-response.dto';
import { BookingStateMachineService } from '../services/booking-state-machine.service';

@Injectable()
export class BookingMapper {
  constructor(private readonly stateMachine: BookingStateMachineService) { }

  toResponseDto(booking: any, images: string[] = [], clientAvatar: string | null = null): BookingResponseDto {
    const latestStatus = this.stateMachine.getLatestStatusContext(booking.statusHistory);

    const clientName = booking.vehicle?.client?.user?.fullName || null;
    const resolvedAvatar = clientAvatar || booking.vehicle?.client?.user?.profileImageUrl || null;

    return {
      id: booking.id,
      client_name: clientName,
      client_avatar: resolvedAvatar,
      vehicle_id: booking.vehicleId,
      business_id: booking.businessId,
      scheduled_at: booking.scheduledAt,
      expected_delivery_at: booking.expectedDeliveryAt ?? undefined,
      sub_total: Number(booking.subTotal),
      platform_fee: Number(booking.platformFee) || 0,
      discount: Number(booking.discount),
      commission: Number(booking.commission),
      total_price: Number(booking.totalPrice),
      cancellation_reason: latestStatus === 'CANCELLED' ? (booking.cancellation?.reason || undefined) : undefined,
      rejection_reason: latestStatus === 'REJECTED' ? (booking.cancellation?.reason || undefined) : undefined,
      note: booking.notes && booking.notes.length > 0 ? booking.notes[0].body : undefined,
      status: latestStatus,
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
      items: (booking.items || []).map((item: any) => ({
        id: item.id,
        businessServiceId: item.businessServiceId,
        serviceTitle: item.businessService?.service?.title || 'Service',
        serviceDescription: item.businessService?.service?.description || undefined,
        price: Number(item.price),
      })),
      status_history: (booking.statusHistory || []).map((sh: any) => ({
        id: sh.id,
        status: sh.status.context,
        createdAt: sh.createdAt,
      })),
      payment: booking.payment ? {
        id: booking.payment.id,
        amount: Number(booking.payment.amount),
        status: booking.payment.status.context,
        method: booking.payment.paymentMethod.name,
      } : undefined,
      vehicle: {
        id: booking.vehicle.id,
        make: booking.vehicle.make ?? undefined,
        model: booking.vehicle.model ?? undefined,
        licensePlate: booking.vehicle.licensePlate,
        vin: booking.vehicle.vin ?? undefined,
        year: booking.vehicle.year ?? undefined,
        color: booking.vehicle.color ?? undefined,
        client: booking.vehicle.client ? {
          id: booking.vehicle.client.id,
          user: booking.vehicle.client.user ? {
            id: booking.vehicle.client.user.id,
            fullName: booking.vehicle.client.user.fullName,
            phone: booking.vehicle.client.user.phone ?? undefined,
            email: booking.vehicle.client.user.email,
          } : undefined
        } : undefined
      },
      business: {
        id: booking.business.id,
        businessName: booking.business.businessName,
        address: booking.business.address,
        managerId: booking.business.managerId,
        latitude: booking.business.latitude ?? undefined,
        longitude: booking.business.longitude ?? undefined,
      },
      images,
      diagnostic_report: booking.diagnosticReport || undefined,
    };
  }

  toPaginatedResponse(bookings: any[], total: number, page: number, limit: number, avatarMap?: Map<string, string>, getImagesForBooking?: (id: string) => string[]) {
    const formatted = bookings.map(b => {
      const uId = b.vehicle?.client?.user?.id;
      const avatarUrl = uId && avatarMap ? (avatarMap.get(uId) || null) : null;
      const images = getImagesForBooking ? getImagesForBooking(b.id) : [];
      return this.toResponseDto(b, images, avatarUrl);
    });

    return {
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
