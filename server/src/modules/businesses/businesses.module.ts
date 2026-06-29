import { Module } from '@nestjs/common';
import { BusinessesManagerController } from './controllers/businesses-manager.controller';
import { BusinessesPublicController } from './controllers/businesses-public.controller';
import { BusinessesAdminController } from './controllers/businesses-admin.controller';
import { BusinessesDiscoveryController } from './controllers/businesses-discovery.controller';
import { BusinessesService } from './businesses.service';
import { ProviderDiscoveryService } from './provider-discovery.service';
import { BusinessesRepository } from './repositories/businesses.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [
    BusinessesManagerController,
    BusinessesPublicController,
    BusinessesAdminController,
    BusinessesDiscoveryController,
  ],
  providers: [
    BusinessesService,
    ProviderDiscoveryService,
    BusinessesRepository,
  ],
  exports: [
    BusinessesService,
    ProviderDiscoveryService,
    BusinessesRepository,
  ],
})
export class BusinessesModule { }