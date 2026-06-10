import { Injectable } from '@nestjs/common';
import {
  BookingEntity,
  BookingNoteEntity,
  DiagnosticReportEntity,
  ReportFindingEntity,
  RecommendedRepairEntity,
  PaginatedBookingsEntity,
} from './entities';

@Injectable()
export class BookingsPresenter {
  toBookingEntity(booking: any): BookingEntity | null {
    if (!booking) return null;

    // Sort statusHistory by createdAt desc
    const sortedHistory = [...(booking.statusHistory || [])].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const latestStatusName = sortedHistory[0]?.status?.name || 'PENDING';

    const formattedHistory = sortedHistory.map((h) => ({
      status: h.status?.name || 'PENDING',
      created_at: h.createdAt,
    }));

    const formattedItems = (booking.items || []).map((item: any) => ({
      id: item.id,
      business_service_id: item.businessServiceId,
      service_title: item.businessService?.service?.title || 'Unknown Service',
      category_name: item.businessService?.service?.category?.name || 'Unknown Category',
      price: Number(item.price),
    }));

    const formattedNotes = (booking.notes || [])
      .map((note: any) => this.toBookingNoteEntity(note))
      .filter((n: BookingNoteEntity | null): n is BookingNoteEntity => n !== null);

    const formattedReport = booking.diagnosticReport
      ? this.toDiagnosticReportEntity(booking.diagnosticReport)
      : null;

    const formattedPayment = booking.payment
      ? {
          id: booking.payment.id,
          amount: Number(booking.payment.amount),
          currency: booking.payment.currency,
          status: booking.payment.status?.name || 'PENDING',
          payment_method: booking.payment.paymentMethod?.name || 'CASH',
        }
      : null;

    const formattedReview = booking.review
      ? {
          id: booking.review.id,
          rating: booking.review.rating,
          comment: booking.review.comment,
          created_at: booking.review.createdAt,
        }
      : null;

    const user = booking.vehicle?.client?.user;

    return {
      id: booking.id,
      vehicle_id: booking.vehicleId,
      business_id: booking.businessId,
      scheduled_at: booking.scheduledAt,
      expected_delivery_at: booking.expectedDeliveryAt,
      sub_total: Number(booking.subTotal),
      discount: Number(booking.discount),
      commission: Number(booking.commission),
      total_price: Number(booking.totalPrice),
      created_at: booking.createdAt,
      updated_at: booking.updatedAt,
      status: latestStatusName,
      status_history: formattedHistory,
      vehicle: booking.vehicle
        ? {
            id: booking.vehicle.id,
            model: booking.vehicle.model,
            license_plate: booking.vehicle.licensePlate,
            color: booking.vehicle.color,
            year: booking.vehicle.year,
          }
        : null,
      client: booking.vehicle?.client
        ? {
            id: booking.vehicle.client.id,
            user_id: booking.vehicle.client.userId,
            name: user?.fullName || 'Unknown Client',
            email: user?.email || '',
            phone: user?.phone || '',
          }
        : null,
      business: booking.business
        ? {
            id: booking.business.id,
            business_name: booking.business.businessName,
            address: booking.business.address,
          }
        : null,
      items: formattedItems,
      notes: formattedNotes,
      diagnostic_report: formattedReport,
      payment: formattedPayment,
      review: formattedReview,
    };
  }

  toBookingEntityList(bookings: any[]): BookingEntity[] {
    return bookings
      .map((b) => this.toBookingEntity(b))
      .filter((b): b is BookingEntity => b !== null);
  }

  toBookingNoteEntity(note: any): BookingNoteEntity | null {
    if (!note) return null;
    return {
      id: note.id,
      booking_id: note.bookingId,
      body: note.body,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    };
  }

  toBookingNoteEntityList(notes: any[]): BookingNoteEntity[] {
    return notes
      .map((n) => this.toBookingNoteEntity(n))
      .filter((n): n is BookingNoteEntity => n !== null);
  }

  toDiagnosticReportEntity(report: any): DiagnosticReportEntity | null {
    if (!report) return null;
    return {
      id: report.id,
      booking_id: report.bookingId,
      summary: report.summary,
      valid_until: report.validUntil,
      estimated_duration: report.estimatedDuration,
      created_at: report.createdAt,
      updated_at: report.updatedAt,
      findings: (report.findings || [])
        .map((f: any) => this.toReportFindingEntity(f))
        .filter((f: ReportFindingEntity | null): f is ReportFindingEntity => f !== null),
      recommended_repairs: (report.recommendedRepairs || [])
        .map((r: any) => this.toRecommendedRepairEntity(r))
        .filter((r: RecommendedRepairEntity | null): r is RecommendedRepairEntity => r !== null),
    };
  }

  toReportFindingEntity(finding: any): ReportFindingEntity | null {
    if (!finding) return null;
    return {
      id: finding.id,
      report_id: finding.reportId,
      title: finding.title,
      description: finding.description,
      priority: finding.priority,
      created_at: finding.createdAt,
    };
  }

  toRecommendedRepairEntity(repair: any): RecommendedRepairEntity | null {
    if (!repair) return null;
    return {
      id: repair.id,
      report_id: repair.reportId,
      business_service_id: repair.businessServiceId,
      service_title: repair.businessService?.service?.title || 'Unknown Service',
      price: repair.businessService ? Number(repair.businessService.price) : 0,
      average_duration: repair.businessService ? repair.businessService.averageDuration : 0,
      created_at: repair.createdAt,
    };
  }

  toPaginatedBookingsEntity(
    bookings: any[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedBookingsEntity {
    return {
      data: this.toBookingEntityList(bookings),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
