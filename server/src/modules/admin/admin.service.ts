import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import {
  DashboardStatsDto,
  RevenueStatsDto,
  TopPerformersDto,
  PlatformHealthDto,
} from './dto/admin-stats.dto';
import {
  GetUsersAdminDto,
  CreateUserAdminDto,
  UpdateUserAdminDto,
  UserResponseAdminDto,
  UserRole,
} from './dto/admin-users.dto';
import {
  GetBusinessesAdminDto,
  ApproveBusinessDto,
  RejectBusinessDto,
  BusinessResponseAdminDto,
  BusinessStatus,
} from './dto/admin-businesses.dto';
import {
  UpdateSystemSettingsDto,
  SystemSettingsResponseDto,
} from './dto/admin-settings.dto';
import {
  GetPayoutsAdminDto,
  ProcessPayoutDto,
  PayoutStatus,
} from './dto/admin-payouts.dto';
import { AdminRepository } from "./admin.repository";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly repository: AdminRepository, private readonly eventEmitter: EventEmitter2,
  ) {}

  // ==================== DASHBOARD STATISTICS ====================

  async getDashboardStats(): Promise<DashboardStatsDto> {
      return this.repository.getDashboardStats();
  }

  async getRevenueStats(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    months: number = 12,
  ): Promise<RevenueStatsDto> {
      return this.repository.getRevenueStats(period, months);
  }

  async getTopPerformers(limit: number = 10): Promise<TopPerformersDto> {
      return this.repository.getTopPerformers(limit);
  }

  async getPlatformHealth(): Promise<PlatformHealthDto> {
      return this.repository.getPlatformHealth();
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(query: GetUsersAdminDto): Promise<{ data: UserResponseAdminDto[]; meta: any }> {
      const { role, search, email_verified, phone_verified, is_active, page = 1, limit = 20 } = query;
          const skip = (page - 1) * limit;
          const take = Math.min(limit, 100);

          const where: any = {};

          if (role) where.role = role;
          if (email_verified !== undefined) where.emailVerified = email_verified;
          if (phone_verified !== undefined) where.phoneVerified = phone_verified;
          if (is_active !== undefined) where.isActive = is_active;

          if (search) {
            where.OR = [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
            ];
          }

          const [users, total] = await Promise.all([
            this.repository.user.findMany({
              where,
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                emailVerified: true,
                phoneVerified: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.user.count({ where }),
          ]);

          let results = users.map((user) => this.mapUserToResponse(user));

          if (role === 'CLIENT') {
            results = await Promise.all(results.map(async (user) => {
              const stats = await this.repository.$queryRaw<Array<any>>`
          SELECT 
            COUNT(DISTINCT bk.id) as total_bookings,
            COALESCE(SUM(p.amount), 0) as total_spent,
            MAX(bk.created_at) as last_booking_date
          FROM users u
          LEFT JOIN clients c ON u.id = c.user_id
          LEFT JOIN client_vehicles v ON c.id = v.client_id
          LEFT JOIN bookings bk ON v.id = bk.vehicle_id
          LEFT JOIN payments p ON bk.id = p.booking_id AND p.status_id = (SELECT id FROM statuses WHERE context = 'PAID')
          WHERE u.id = ${user.id}::uuid
        `;
              
              return {
                ...user,
                total_bookings: Number(stats[0]?.total_bookings || 0),
                total_spent: Number(stats[0]?.total_spent || 0),
                last_booking_date: stats[0]?.last_booking_date || null,
              };
            }));
          }

          return {
            data: results,
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  async getUserById(userId: string): Promise<UserResponseAdminDto> {
      const user = await this.repository.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              emailVerified: true,
              phoneVerified: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          if (!user) {
            throw new NotFoundException('User not found');
          }

          let response = this.mapUserToResponse(user);

          if (user.role === 'CLIENT') {
            const stats = await this.repository.$queryRaw<Array<any>>`
        SELECT 
          COUNT(DISTINCT bk.id) as total_bookings,
          COALESCE(SUM(p.amount), 0) as total_spent,
          MAX(bk.created_at) as last_booking_date
        FROM users u
        LEFT JOIN clients c ON u.id = c.user_id
        LEFT JOIN client_vehicles v ON c.id = v.client_id
        LEFT JOIN bookings bk ON v.id = bk.vehicle_id
        LEFT JOIN payments p ON bk.id = p.booking_id AND p.status_id = (SELECT id FROM statuses WHERE context = 'PAID')
        WHERE u.id = ${user.id}::uuid
      `;
            
            response = {
              ...response,
              total_bookings: Number(stats[0]?.total_bookings || 0),
              total_spent: Number(stats[0]?.total_spent || 0),
              last_booking_date: stats[0]?.last_booking_date || null,
            };
          }

          return response;
  }

  async createUser(dto: CreateUserAdminDto): Promise<UserResponseAdminDto> {
      // Check if email exists
          const existing = await this.repository.user.findUnique({
            where: { email: dto.email.toLowerCase() },
          });

          if (existing) {
            throw new BadRequestException('User with this email already exists');
          }

          const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

          const user = await this.repository.user.create({
            data: {
              fullName: dto.full_name,
              email: dto.email.toLowerCase(),
              phone: dto.phone,
              passwordHash: passwordHash,
              role: dto.role,
              emailVerified: true,
              isActive: true,
            },
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              emailVerified: true,
              phoneVerified: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          // Create client record if role is CLIENT
          if (dto.role === UserRole.CLIENT) {
            await this.repository.client.create({
              data: { userId: user.id },
            });
          }

          this.logger.log(`Admin created user: ${user.email} (${dto.role})`);

          return this.mapUserToResponse(user);
  }

  async updateUser(userId: string, dto: UpdateUserAdminDto): Promise<UserResponseAdminDto> {
      const user = await this.repository.user.findUnique({ where: { id: userId } });
          if (!user) {
            throw new NotFoundException('User not found');
          }

          const updateData: any = { updatedAt: new Date() };
          if (dto.full_name) updateData.fullName = dto.full_name;
          if (dto.email) updateData.email = dto.email.toLowerCase();
          if (dto.phone) updateData.phone = dto.phone;
          if (dto.role) updateData.role = dto.role;
          if (dto.is_active !== undefined) updateData.isActive = dto.is_active;
          if (dto.password) updateData.passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

          const updated = await this.repository.user.update({
            where: { id: userId },
            data: updateData,
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              role: true,
              emailVerified: true,
              phoneVerified: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          this.logger.log(`Admin updated user: ${updated.email}`);

          return this.mapUserToResponse(updated);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
      const user = await this.repository.user.findUnique({ where: { id: userId } });
          if (!user) {
            throw new NotFoundException('User not found');
          }

          await this.repository.user.update({
            where: { id: userId },
            data: {
              isActive: false,
              deletedAt: new Date(),
              updatedAt: new Date(),
            },
          });

          this.logger.log(`Admin deleted (soft) user: ${user.email}`);

          return { message: 'User deleted successfully' };
  }

  // ==================== BUSINESS MANAGEMENT ====================

  async getAllBusinesses(query: GetBusinessesAdminDto): Promise<{ data: BusinessResponseAdminDto[]; meta: any }> {
      const { status, search, page = 1, limit = 20 } = query;
          const skip = (page - 1) * limit;
          const take = Math.min(limit, 100);

          let where: any = {};

          if (status) {
            where.statusHistory = {
              some: { status: { context: status } },
            };
          }

          if (search) {
            where.businessName = { contains: search, mode: 'insensitive' };
          }

          const [businesses, total] = await Promise.all([
            this.repository.business.findMany({
              where,
              include: {
                manager: {
                  select: {
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
                statusHistory: {
                  include: { status: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.business.count({ where }),
          ]);

          const businessesWithStats = await Promise.all(
            businesses.map(async (b) => {
              const stats = await this.getBusinessStats(b.id);
              return {
                id: b.id,
                business_name: b.businessName,
                manager_name: b.manager.fullName,
                manager_email: b.manager.email,
                manager_phone: b.manager.phone || undefined,
                city: b.city || undefined,
                latitude: await this.getBusinessLatitude(b.id),
                longitude: await this.getBusinessLongitude(b.id),
                current_status: b.statusHistory[0]?.status?.context || 'PENDING_REVIEW',
                total_bookings: stats.total_bookings,
                total_revenue: stats.total_revenue,
                average_rating: stats.average_rating,
                created_at: b.createdAt,
              };
            }),
          );

          return {
            data: businessesWithStats,
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  async updateBusiness(businessId: string, data: any): Promise<any> {
      const business = await this.repository.business.findUnique({
            where: { id: businessId },
          });

          if (!business) {
            throw new NotFoundException('Business not found');
          }

          const updated = await this.repository.business.update({
            where: { id: businessId },
            data: {
              businessName: data.businessName !== undefined ? data.businessName : undefined,
              address: data.address !== undefined ? data.address : undefined,
              city: data.city !== undefined ? data.city : undefined,
              contactPhone: data.contactPhone !== undefined ? data.contactPhone : undefined,
              contactEmail: data.contactEmail !== undefined ? data.contactEmail : undefined,
              description: data.description !== undefined ? data.description : undefined,
            },
          });

          this.logger.log(`Admin updated business: ${businessId}`);
          return updated;
  }

  async getBusinessById(businessId: string): Promise<any> {
      const business = await this.repository.business.findUnique({
            where: { id: businessId },
            include: {
              manager: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
              operatingHours: true,
              documents: {
                include: { status: true },
              },
              statusHistory: {
                include: { status: true },
                orderBy: { createdAt: 'desc' },
              },
            },
          });

          if (!business) {
            throw new NotFoundException('Business not found');
          }

          const stats = await this.getBusinessStats(businessId);

          return {
            ...business,
            latitude: await this.getBusinessLatitude(businessId),
            longitude: await this.getBusinessLongitude(businessId),
            total_bookings: stats.total_bookings,
            total_revenue: stats.total_revenue,
            average_rating: stats.average_rating,
            current_status: business.statusHistory[0]?.status?.context || 'PENDING_REVIEW',
          };
  }

  async getBusinessBookings(businessId: string, page = 1, limit = 10): Promise<{ data: any[]; meta: any }> {
      const skip = (page - 1) * limit;
          const take = Math.min(limit, 50);

          const [bookings, total] = await Promise.all([
            this.repository.booking.findMany({
              where: { businessId },
              include: {
                vehicle: {
                  include: {
                    client: {
                      include: {
                        user: { select: { fullName: true, email: true } },
                      },
                    },
                  },
                },
                items: {
                  include: {
                    businessService: {
                      include: { service: true },
                    },
                  },
                },
                statusHistory: {
                  include: { status: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                payment: true,
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.booking.count({ where: { businessId } }),
          ]);

          return {
            data: bookings.map((b) => ({
              id: b.id,
              reference: `BK-${b.createdAt.getFullYear()}-${b.id.slice(0, 4).toUpperCase()}`,
              customer_name: b.vehicle?.client?.user?.fullName || 'Unknown',
              service_name: b.items?.[0]?.businessService?.service?.title || 'Unknown Service',
              scheduled_at: b.scheduledAt,
              total_price: Number(b.totalPrice),
              current_status: b.statusHistory[0]?.status?.context || 'PENDING',
            })),
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  async getBusinessReviews(businessId: string, page = 1, limit = 10): Promise<{ data: any[]; meta: any }> {
      const skip = (page - 1) * limit;
          const take = Math.min(limit, 50);

          const [reviews, total] = await Promise.all([
            this.repository.review.findMany({
              where: { booking: { businessId } },
              include: {
                booking: {
                  include: {
                    vehicle: {
                      include: {
                        client: {
                          include: {
                            user: { select: { fullName: true } },
                          },
                        },
                      },
                    },
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.review.count({ where: { booking: { businessId } } }),
          ]);

          return {
            data: reviews.map((r) => ({
              id: r.id,
              customer_name: r.booking?.vehicle?.client?.user?.fullName || 'Anonymous',
              rating: r.rating,
              comment: r.comment,
              created_at: r.createdAt,
            })),
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  async approveBusiness(businessId: string, dto: ApproveBusinessDto): Promise<{ message: string }> {
      const business = await this.repository.business.findUnique({ where: { id: businessId } });
          if (!business) {
            throw new NotFoundException('Business not found');
          }

          const approvedStatus = await this.repository.status.findFirst({
            where: { context: 'APPROVED' },
          });

          if (!approvedStatus) {
            throw new BadRequestException('APPROVED status not found');
          }

          await this.repository.businessStatus.create({
            data: {
              businessId,
              statusId: approvedStatus.id,
            },
          });

          this.logger.log(`Admin approved business: ${business.businessName} (${businessId})`);

          this.eventEmitter.emit('business.approved', {
            businessId,
            businessName: business.businessName,
            managerId: business.managerId,
          });

          return { message: 'Business approved successfully' };
  }

  async rejectBusiness(businessId: string, dto: RejectBusinessDto): Promise<{ message: string }> {
      const business = await this.repository.business.findUnique({ where: { id: businessId } });
          if (!business) {
            throw new NotFoundException('Business not found');
          }

          const rejectedStatus = await this.repository.status.findFirst({
            where: { context: 'REJECTED' },
          });

          if (!rejectedStatus) {
            throw new BadRequestException('REJECTED status not found');
          }

          await this.repository.businessStatus.create({
            data: {
              businessId,
              statusId: rejectedStatus.id,
            },
          });

          await this.repository.rejectionReason.create({
            data: {
              entityType: 'BUSINESS',
              entityId: businessId,
              reasonText: dto.reason,
            },
          });

          this.logger.log(`Admin rejected business: ${business.businessName} (${businessId})`);

          this.eventEmitter.emit('business.rejected', {
            businessId,
            businessName: business.businessName,
            managerId: business.managerId,
            reason: dto.reason,
          });

          return { message: 'Business rejected successfully' };
  }

  // ==================== SETTINGS MANAGEMENT ====================

  async getSettings(): Promise<SystemSettingsResponseDto> {
      const settings = await this.repository.setting.findFirst();
      return {
        business_fee_pct: settings?.businessFeePct ? Number(settings.businessFeePct) : 10,
        max_cancel_minutes: settings?.maxCancelMinutes || 120,
        max_booking_advance_days: 30,
        min_booking_cancel_hours: 2,
        maintenance_mode: false,
        updated_at: settings?.updatedAt || new Date(),
      };
  }

  async updateSettings(dto: UpdateSystemSettingsDto): Promise<SystemSettingsResponseDto> {
      const existing = await this.repository.setting.findFirst();

          if (existing) {
            await this.repository.setting.update({
              where: { id: existing.id },
              data: {
                businessFeePct: dto.business_fee_pct,
                maxCancelMinutes: dto.max_cancel_minutes,
                updatedAt: new Date(),
              },
            });
          } else {
            await this.repository.setting.create({
              data: {
                businessFeePct: dto.business_fee_pct || 10,
                maxCancelMinutes: dto.max_cancel_minutes || 120,
              },
            });
          }

          this.logger.log('Admin updated system settings');

          return this.getSettings();
  }

  async approveDocument(businessId: string, documentId: string): Promise<{ message: string }> {
      const document = await this.repository.businessDocument.findUnique({
            where: { id: documentId, businessId },
          });

          if (!document) {
            throw new NotFoundException('Document not found');
          }

          const approvedStatus = await this.repository.status.findFirst({
            where: { context: 'APPROVED' },
          });

          if (approvedStatus) {
            await this.repository.businessDocument.update({
              where: { id: documentId },
              data: { statusId: approvedStatus.id },
            });

            // Check if all 4 required documents are now approved
            const allDocs = await this.repository.businessDocument.findMany({
              where: { businessId },
            });
            // Assuming 4 documents are required as per registration logic
            const allApproved = allDocs.length >= 4 && allDocs.every(d => d.statusId === approvedStatus.id);
            
            if (allApproved) {
              // Automatically approve the business (this also emits business.approved event)
              await this.approveBusiness(businessId, {});
            }
          }

          this.logger.log(`Admin approved document ${documentId} for business ${businessId}`);
          return { message: 'Document approved successfully' };
  }

  async rejectDocument(businessId: string, documentId: string, reason?: string): Promise<{ message: string }> {
      const document = await this.repository.businessDocument.findUnique({
            where: { id: documentId, businessId },
          });

          if (!document) {
            throw new NotFoundException('Document not found');
          }

          const rejectedStatus = await this.repository.status.findFirst({
            where: { context: 'REJECTED' },
          });

          if (rejectedStatus) {
            await this.repository.businessDocument.update({
              where: { id: documentId },
              data: { statusId: rejectedStatus.id },
            });
            
            // If any document is rejected, automatically reject the entire business
            const rejectionReason = reason ? `Document rejected: ${reason}` : 'One or more required registration documents were rejected.';
            await this.rejectBusiness(businessId, { reason: rejectionReason });
          }

          this.logger.log(`Admin rejected document ${documentId} for business ${businessId} with reason: ${reason || 'none'}`);
          return { message: 'Document rejected successfully' };
  }

  // ==================== PAYMENT & PAYOUT MANAGEMENT ====================

  async getAllPayments(query: any): Promise<{ data: any[]; meta: any }> {
      const { page = 1, limit = 20, status } = query;
          const skip = (Number(page) - 1) * Number(limit);
          const take = Math.min(Number(limit), 100);

          const where: any = {};
          if (status) {
            where.status = { context: status };
          }

          const [payments, total] = await Promise.all([
            this.repository.payment.findMany({
              where,
              include: {
                booking: {
                  select: {
                    id: true,
                    vehicle: {
                      select: {
                        client: {
                          select: { user: { select: { fullName: true, email: true } } }
                        }
                      }
                    },
                    business: { select: { businessName: true } }
                  }
                },
                status: true,
                paymentMethod: true,
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.payment.count({ where }),
          ]);

          return {
            data: payments.map(p => ({
              id: p.id,
              booking_id: p.bookingId,
              amount: Number(p.amount),
              currency: p.currency,
              status: p.status?.context || 'UNKNOWN',
              payment_method: p.paymentMethod?.name || 'UNKNOWN',
              client_name: p.booking?.vehicle?.client?.user?.fullName,
              business_name: p.booking?.business?.businessName,
              paid_at: p.paidAt,
              created_at: p.createdAt,
            })),
            meta: {
              total,
              page: Number(page),
              limit: Number(limit),
              total_pages: Math.ceil(total / Number(limit)),
            },
          };
  }

  async getAllPayouts(query: GetPayoutsAdminDto): Promise<{ data: any[]; meta: any }> {
      const { status, page = 1, limit = 20 } = query;
          const skip = (page - 1) * limit;
          const take = Math.min(limit, 100);

          const where: any = {};
          if (status) {
            where.status = { context: status };
          }

          const [payouts, total] = await Promise.all([
            this.repository.payout.findMany({
              where,
              include: {
                business: {
                  select: {
                    businessName: true,
                    manager: { select: { fullName: true, email: true } },
                  },
                },
                status: true,
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.payout.count({ where }),
          ]);

          return {
            data: payouts.map(p => ({
              id: p.id,
              business_id: p.businessId,
              business_name: p.business.businessName,
              manager_name: p.business.manager.fullName,
              amount: Number(p.amount),
              status: p.status.context,
              processed_at: p.processedAt,
              created_at: p.createdAt,
            })),
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  async processPayout(payoutId: string, dto: ProcessPayoutDto): Promise<{ message: string }> {
      const payout = await this.repository.payout.findUnique({
            where: { id: payoutId },
            include: { status: true },
          });

          if (!payout) {
            throw new NotFoundException('Payout not found');
          }

          const processedStatus = await this.repository.status.findFirst({
            where: { context: 'PAYOUT_PROCESSED' },
          });

          if (!processedStatus) {
            throw new BadRequestException('PAYOUT_PROCESSED status not found');
          }

          await this.repository.payout.update({
            where: { id: payoutId },
            data: {
              statusId: processedStatus.id,
              processedAt: new Date(),
              amount: dto.amount,
            },
          });

          this.logger.log(`Admin processed payout: ${payoutId} for amount ${dto.amount}`);

          return { message: 'Payout processed successfully' };
  }

  // ==================== REVIEWS MANAGEMENT ====================

  async getAllReviews(query: { page?: number; limit?: number; search?: string }): Promise<{ data: any[]; meta: any }> {
      const { page = 1, limit = 20, search } = query;
          const skip = (page - 1) * limit;
          const take = Math.min(limit, 100);

          const where: any = {};
          if (search) {
            where.OR = [
              { comment: { contains: search, mode: 'insensitive' } },
              { booking: { business: { businessName: { contains: search, mode: 'insensitive' } } } },
            ];
          }

          const [reviews, total] = await Promise.all([
            this.repository.review.findMany({
              where,
              include: {
                booking: {
                  select: {
                    id: true,
                    vehicle: {
                      select: {
                        client: { select: { user: { select: { fullName: true, email: true } } } }
                      }
                    },
                    business: {
                      select: { id: true, businessName: true }
                    }
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              skip,
              take,
            }),
            this.repository.review.count({ where }),
          ]);

          return {
            data: reviews.map(r => ({
              id: r.id,
              rating: r.rating,
              comment: r.comment,
              reply: r.reply,
              replied_at: r.repliedAt,
              created_at: r.createdAt,
              client_name: r.booking?.vehicle?.client?.user?.fullName || 'Unknown',
              business_id: r.booking?.business?.id,
              business_name: r.booking?.business?.businessName || 'Unknown',
              booking_id: r.bookingId,
            })),
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
          };
  }

  // ==================== PRIVATE HELPERS ====================

  private mapUserToResponse(user: any): UserResponseAdminDto {
      return {
        id: user.id,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone ?? undefined,
        role: user.role,
        email_verified: user.emailVerified,
        phone_verified: user.phoneVerified,
        is_active: user.isActive,
        avatar_url: undefined,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      };
  }

  private async getBusinessStats(businessId: string): Promise<{ total_bookings: number; total_revenue: number; average_rating: number }> {
      const bookings = await this.repository.booking.findMany({
            where: { businessId },
            include: {
              payment: {
                include: { status: true },
              },
              review: true,
            },
          });

          let totalRevenue = 0;
          let totalRating = 0;
          let reviewCount = 0;

          for (const booking of bookings) {
            if (booking.payment?.status?.context === 'PAID') {
              totalRevenue += Number(booking.totalPrice);
            }
            if (booking.review) {
              totalRating += booking.review.rating;
              reviewCount++;
            }
          }

          return {
            total_bookings: bookings.length,
            total_revenue: totalRevenue,
            average_rating: reviewCount > 0 ? Math.round((totalRating / reviewCount) * 10) / 10 : 0,
          };
  }

  private async getBusinessLatitude(businessId: string): Promise<number> {
      const result = await this.repository.$queryRaw<Array<{ latitude: number }>>`
      SELECT ST_Y(location::geometry) as latitude FROM businesses WHERE id = ${businessId}::uuid
    `;
      return result[0]?.latitude || 0;
  }

  private async getBusinessLongitude(businessId: string): Promise<number> {
      const result = await this.repository.$queryRaw<Array<{ longitude: number }>>`
      SELECT ST_X(location::geometry) as longitude FROM businesses WHERE id = ${businessId}::uuid
    `;
      return result[0]?.longitude || 0;
  }
}
