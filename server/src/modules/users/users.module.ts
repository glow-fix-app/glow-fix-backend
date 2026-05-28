import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { StorageModule } from '../../core/storage/storage.module';

// PrismaService and WinstonLoggerService are assumed global.
// If not, import their modules here explicitly.

@Module({
  controllers: [UsersController, AvatarController],
  providers: [UsersService, AvatarService],
  //exports: [UsersService, AvatarService],
  imports: [StorageModule], // no imports needed if PrismaService and WinstonLoggerService are global
})
export class UsersModule {}