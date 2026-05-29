// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { NotificationsService } from '../notifications/notifications.service';

// @Injectable()
// export class LoyaltyJobs {
//   private readonly logger = new Logger(LoyaltyJobs.name);

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly notificationsService: NotificationsService,
//   ) {}

//   /**
//    * Daily job to check for expiring points and send reminders
//    * Runs every day at 9 AM
//    */
//   @Cron(CronExpression.EVERY_DAY_AT_9AM)
//   async checkExpiringPoints() {
//     this.logger.log('Checking for expiring loyalty points');

//     const expiryDays = 30; // Configurable
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + expiryDays);

//     // Find clients with points earned before expiry date
//     const expiringClients = await this.prisma.loyaltyTransaction.groupBy({
//       by: ['clientId'],
//       where: {
//         type: 'EARNED',
//         createdAt: { lt: expiryDate },
//       },
//       _sum: {
//         points: true,
//       },
//     });

//     for (const client of expiringClients) {
//       const expiringPoints = client._sum.points || 0;
      
//       if (expiringPoints > 0) {
//         await this.notificationsService.send({
//           user_id: client.clientId,
//           type: 'LOYALTY_POINTS_EXPIRING',
//           title: 'Your points are expiring soon!',
//           body: `You have ${expiringPoints} points expiring in ${expiryDays} days. Redeem them before they're gone!`,
//           metadata: { expiring_points: expiringPoints, expires_in_days: expiryDays },
//         });
//       }
//     }
//   }

//   /**
//    * Monthly job to expire old points (if configured)
//    * Runs on the 1st of every month at 2 AM
//    */
//   @Cron('0 2 1 * *')
//   async expireOldPoints() {
//     this.logger.log('Expiring old loyalty points');

//     const expiryDays = 365; // 1 year expiry
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() - expiryDays);

//     // This would mark points as expired - implementation depends on your schema
//     this.logger.log(`Points earned before ${expiryDate.toISOString()} would be expired`);
//   }
// }