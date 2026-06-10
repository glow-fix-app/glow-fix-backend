import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesPresenter } from './services.presenter';
import { ServicesService } from './services.service';
import { ServiceDiscoveryService } from './service-discovery.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ServicesPresenter, ServiceDiscoveryService],
  exports: [ServicesService, ServicesPresenter, ServiceDiscoveryService],
})
export class ServicesModule {}
