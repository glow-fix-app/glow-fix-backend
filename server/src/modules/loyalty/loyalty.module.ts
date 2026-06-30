import { Module } from '@nestjs/common';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './services/loyalty.service';
import { LoyaltyConfigService } from './services/loyalty-config.service';
import { LoyaltyRedemptionService } from './services/loyalty-redemption.service';
import { LoyaltyNotificationService } from './services/loyalty-notification.service';
import { LoyaltyRepository } from './repositories/loyalty.repository';
import { LoyaltyMapper } from './mappers/loyalty.mapper';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [LoyaltyController],
  providers: [
    LoyaltyService,
    LoyaltyConfigService,
    LoyaltyRedemptionService,
    LoyaltyNotificationService,
    LoyaltyRepository,
    LoyaltyMapper,
  ],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}