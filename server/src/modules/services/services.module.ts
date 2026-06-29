import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceDiscoveryService } from './service-discovery.service';
import { ServicesRepository } from './services.repository';
import { ServiceDiscoveryRepository } from './service-discovery.repository';

@Module({
  controllers: [ServicesController],
  providers: [
    ServicesService, 
    ServiceDiscoveryService,
    ServicesRepository,
    ServiceDiscoveryRepository
  ],
  exports: [
    ServicesService, 
    ServiceDiscoveryService,
    ServicesRepository,
    ServiceDiscoveryRepository
  ],
})
export class ServicesModule {}