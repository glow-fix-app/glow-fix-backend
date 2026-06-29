import { Module } from '@nestjs/common';
import { ServicesCatalogController } from './controllers/services-catalog.controller';
import { ServicesBusinessController } from './controllers/services-business.controller';
import { ServicesDiscoveryController } from './controllers/services-discovery.controller';
import { ServicesService } from './services.service';
import { ServiceDiscoveryService } from './service-discovery.service';
import { ServicesRepository } from './services.repository';
import { ServiceDiscoveryRepository } from './service-discovery.repository';

@Module({
  controllers: [
    ServicesCatalogController,
    ServicesBusinessController,
    ServicesDiscoveryController,
  ],
  providers: [
    ServicesService,
    ServiceDiscoveryService,
    ServicesRepository,
    ServiceDiscoveryRepository,
  ],
  exports: [
    ServicesService,
    ServiceDiscoveryService,
    ServicesRepository,
    ServiceDiscoveryRepository,
  ],
})
export class ServicesModule { }