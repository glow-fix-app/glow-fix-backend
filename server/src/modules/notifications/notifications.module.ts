import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { NotificationsRepository } from './repositories/notifications.repository';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { MetricsModule } from '../../core/metrics/metrics.module';

@Module({
  imports: [AuthModule, PrismaModule, MetricsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway, NotificationsRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}

