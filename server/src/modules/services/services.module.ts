import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceDiscoveryService } from './service-discovery.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServiceDiscoveryService],
  exports: [ServicesService, ServiceDiscoveryService],
})
export class ServicesModule {}