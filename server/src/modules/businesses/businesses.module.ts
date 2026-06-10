import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { ProviderDiscoveryService } from './provider-discovery.service';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService, ProviderDiscoveryService],
  exports: [BusinessesService, ProviderDiscoveryService],
})
export class BusinessesModule {}