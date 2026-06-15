import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { ProviderDiscoveryService } from './provider-discovery.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BusinessesController],
  providers: [BusinessesService, ProviderDiscoveryService],
  exports: [BusinessesService, ProviderDiscoveryService],
})
export class BusinessesModule {}