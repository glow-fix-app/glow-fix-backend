import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class LoyaltyNotificationService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyPointsEarned(clientId: string, points: number) {
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_EARNED',
      title: 'Loyalty Points Earned! 🎉',
      body: `You earned ${points} points from your recent booking. Keep earning!`,
    });
  }

  async notifySignupBonus(clientId: string, points: number) {
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_EARNED',
      title: 'Welcome Bonus! 🎁',
      body: `You received ${points} bonus points for joining Glow Fix!`,
    });
  }

  async notifyPointsRedeemed(clientId: string, points: number, discount: number) {
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_REDEEMED',
      title: 'Points Redeemed! 💰',
      body: `You redeemed ${points} points and saved EGP ${discount.toFixed(2)} on your booking.`,
    });
  }

  async notifyCouponGenerated(clientId: string, points: number, couponCode: string, discount: number) {
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'LOYALTY_POINTS_REDEEMED',
      title: 'Coupon Generated! 🎫',
      body: `You redeemed ${points} points for EGP ${discount.toFixed(2)} off coupon. Code: ${couponCode}`,
    });
  }

  async notifyAdminAdjustment(clientId: string, points: number, reason: string) {
    await this.notificationsService.createNotification({
      recipientUserId: clientId,
      typeCode: 'SYSTEM_MESSAGE',
      title: points > 0 ? 'Points Added ✨' : 'Points Deducted 📉',
      body: points > 0
        ? `${points} points have been added to your account. Reason: ${reason}`
        : `${Math.abs(points)} points have been deducted from your account. Reason: ${reason}`,
    });
  }
}
