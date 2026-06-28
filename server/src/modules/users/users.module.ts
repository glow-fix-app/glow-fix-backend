import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { AvatarService } from './services/avatar.service';
import { LocationService } from './services/location.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    AvatarService,
    LocationService,
  ],
  exports: [
    UsersService,
    UsersRepository,
    AvatarService,
    LocationService,
  ],
})
export class UsersModule { }