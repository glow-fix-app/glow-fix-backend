import { Module } from '@nestjs/common';

import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

import { PrismaModule } from '../../core/prisma/prisma.module';
import { StorageModule } from '../../core/storage/storage.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
  imports: [PrismaModule, StorageModule, LoggerModule],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
