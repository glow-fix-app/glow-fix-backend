import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IPaymentRepository, BookingWithRelations, PaymentWithBooking, PaymentWithFullBooking, PayoutWithRelations } from '../interfaces/payment-repository.interface';
import { Payment, Status, Payout, PayoutBooking, LoyaltyConfig, PaymentMethod, Business, Client, Setting, NotificationType, LoyaltyTransaction, BookingStatus } from '@prisma/client';

@Injectable()
export class PaymentsRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== BOOKING ====================

  async findBookingWithRelations(bookingId: string): Promise<BookingWithRelations | null> {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        business: {
          include: { manager: true },
        },
        vehicle: {
          include: {
            client: { include: { user: true } },
          },
        },
        payment: {
          include: { status: true },
        },
        items: {
          include: {
            businessService: {
              include: { service: true },
            },
          },
        },
      },
    }) as unknown as BookingWithRelations | null;
  }

  async getBookingStatus(bookingId: string): Promise<string> {
    const status = await this.prisma.bookingStatus.findFirst({
      where: { bookingId },
      include: { status: true },
      orderBy: { createdAt: 'desc' },
    });
    return status?.status?.context || 'PENDING';
  }

  async createBookingStatus(bookingId: string, statusId: string): Promise<BookingStatus> {
    return this.prisma.bookingStatus.create({
      data: { bookingId, statusId },
    });
  }

  // ==================== PAYMENT ====================

  async findPaymentById(paymentId: string): Promise<any | null> {
    return this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
            items: {
              include: {
                businessService: {
                  include: { service: true },
                },
              },
            },
          },
        },
        status: true,
        paymentMethod: true,
      },
    });
  }

  async findPaymentByProviderRef(providerRef: string): Promise<(Payment & { status: Status | null }) | null> {
    return this.prisma.payment.findFirst({
      where: { providerRef },
      include: { status: true },
    });
  }

  async findPaymentByBookingId(bookingId: string): Promise<any | null> {
    return this.prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            business: true,
          },
        },
        status: true,
      },
    });
  }

  async upsertPayment(bookingId: string, data: any): Promise<Payment> {
    return this.prisma.payment.upsert({
      where: { bookingId },
      create: data,
      update: data,
    });
  }

  async updatePayment(paymentId: string, data: any): Promise<any> {
    return this.prisma.payment.update({
      where: { id: paymentId },
      data,
      include: {
        booking: {
          include: {
            business: true,
            vehicle: {
              include: {
                client: { include: { user: true } },
              },
            },
            items: {
              include: {
                businessService: {
                  include: { service: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async lockPaymentRow(paymentId: string): Promise<{ id: string; status_id: string } | null> {
    const paymentRows = await this.prisma.$queryRaw<any[]>`
      SELECT id, status_id FROM payments WHERE id = ${paymentId}::uuid FOR UPDATE
    `;
    return paymentRows && paymentRows.length > 0 ? paymentRows[0] : null;
  }

  async findPaymentsByClientId(clientId: string, skip: number, take: number): Promise<any[]> {
    return this.prisma.payment.findMany({
      where: {
        booking: {
          vehicle: { clientId },
        },
      },
      include: {
        status: true,
        booking: {
          include: {
            business: true,
            statusHistory: {
              include: { status: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async countPaymentsByClientId(clientId: string): Promise<number> {
    return this.prisma.payment.count({
      where: {
        booking: {
          vehicle: { clientId },
        },
      },
    });
  }

  // ==================== STATUS ====================

  async findStatusByContext(context: string): Promise<Status | null> {
    return this.prisma.status.findFirst({
      where: { context },
    });
  }

  async findOrCreateStatus(context: string): Promise<Status> {
    let status = await this.findStatusByContext(context);
    if (!status) {
      status = await this.prisma.status.create({
        data: { context },
      });
    }
    return status;
  }

  // ==================== PAYOUT ====================

  async findPayoutBookingByBookingId(bookingId: string): Promise<PayoutBooking | null> {
    return this.prisma.payoutBooking.findFirst({
      where: { bookingId },
    });
  }

  async createPayoutWithBooking(data: { businessId: string; amount: number; statusId: string; bookingId: string }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const payout = await tx.payout.create({
        data: {
          businessId: data.businessId,
          amount: data.amount,
          statusId: data.statusId,
        },
      });

      await tx.payoutBooking.create({
        data: {
          payoutId: payout.id,
          bookingId: data.bookingId,
        },
      });
    });
  }

  async findBusinessPayouts(businessId: string, skip: number, take: number): Promise<PayoutWithRelations[]> {
    return this.prisma.payout.findMany({
      where: { businessId },
      include: {
        status: true,
        payoutBookings: {
          include: {
            booking: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }) as unknown as PayoutWithRelations[];
  }

  async countBusinessPayouts(businessId: string): Promise<number> {
    return this.prisma.payout.count({ where: { businessId } });
  }

  // ==================== NOTIFICATION ====================

  async findOrCreateNotificationType(code: string, label: string): Promise<NotificationType> {
    let type = await this.prisma.notificationType.findFirst({ where: { code } });
    if (!type) {
      type = await this.prisma.notificationType.create({
        data: { code, label },
      });
    }
    return type;
  }

  async createNotification(data: any): Promise<void> {
    await this.prisma.notification.create({ data });
  }

  // ==================== LOYALTY ====================

  async getClientPointsBalance(clientId: string): Promise<number> {
    const balanceResult = await this.prisma.loyaltyTransaction.aggregate({
      where: { clientId },
      _sum: { points: true },
    });
    return balanceResult._sum.points || 0;
  }

  async getLoyaltyConfig(): Promise<LoyaltyConfig | null> {
    return this.prisma.loyaltyConfig.findFirst();
  }

  async createLoyaltyTransaction(data: any): Promise<LoyaltyTransaction> {
    return this.prisma.loyaltyTransaction.create({ data });
  }

  // ==================== SETTINGS & PAYMENT METHODS ====================

  async getSettings(): Promise<Setting | null> {
    return this.prisma.setting.findFirst();
  }

  async findPaymentMethod(name: string): Promise<PaymentMethod | null> {
    return this.prisma.paymentMethod.findUnique({
      where: { name },
    });
  }

  async findOrCreatePaymentMethod(name: string): Promise<PaymentMethod> {
    let method = await this.findPaymentMethod(name);
    if (!method) {
      method = await this.prisma.paymentMethod.create({
        data: { name, isEnabled: true },
      });
    }
    return method;
  }

  // ==================== BUSINESS & CLIENT ====================

  async findBusinessByIdAndManager(businessId: string, managerId: string): Promise<Business | null> {
    return this.prisma.business.findFirst({
      where: { id: businessId, managerId },
    });
  }

  async findClientByUserId(userId: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { userId },
    });
  }

  // ==================== DISPUTE ====================

  async createDispute(data: any): Promise<any> {
    return this.prisma.dispute.create({ data });
  }
}
