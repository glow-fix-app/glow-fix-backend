import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { UsersRepository } from './users.repository';
import { AvatarService } from './services/avatar.service';
import { LocationService } from './services/location.service';

import { IUserProfile, IUserListOptions } from './interfaces/user.interface';
import {
  UserNotFoundException,
  ClientProfileNotFoundException,
  EmailAlreadyInUseException,
  PhoneAlreadyInUseException,
  UnauthorizedUserAccessException,
} from './exceptions/user.exceptions';

import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetUsersQueryDto } from './dto/request/get-users-query.dto';
import { UserProfileResponseDto, ClientLocationResponseDto } from './dto/response/user-response.dto';
import { UserListResponseDto } from './dto/response/user-list-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly avatarService: AvatarService,
    private readonly locationService: LocationService,
    private readonly winstonLogger: WinstonLoggerService,
  ) {}

  async getProfile(userId: string): Promise<UserProfileResponseDto> {
    const user = await this.repository.findUserWithClientById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const avatarUrl = await this.avatarService.resolve(userId);
    let clientLocation: ClientLocationResponseDto | null = null;

    if (user.role === 'CLIENT' && user.client) {
      clientLocation = await this.locationService.getClientLocation(userId);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? undefined,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      avatarUrl: avatarUrl ?? undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      clientLocation: clientLocation ?? undefined,
    };
  }

  async getClientProfile(userId: string): Promise<any> {
    const user = await this.repository.findUserWithClientById(userId);
    if (!user || !user.client) {
      throw new ClientProfileNotFoundException();
    }

    const location = await this.locationService.getClientLocation(userId);

    const avatarUrl = await this.avatarService.resolve(userId);

    return {
      ...user,
      avatar_url: avatarUrl,
      client_id: user.client.id,
      location,
    };
  }

  async getUser(id: string): Promise<any> {
    const user = await this.repository.findUserWithClientById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    const avatarUrl = await this.avatarService.resolve(id);

    return {
      ...user,
      avatarUrl: avatarUrl,
    };
  }

  async getAllUsers(query: GetUsersQueryDto): Promise<UserListResponseDto> {
    const options: IUserListOptions = {
      page: query.page || 1,
      limit: query.limit || 20,
      search: query.search,
      role: query.role,
      emailVerified: query.emailVerified,
      phoneVerified: query.phoneVerified,
      isActive: query.isActive,
    };

    const result = await this.repository.findUsers(options);

    const dataWithAvatars = await Promise.all(
      result.data.map(async (user) => ({
        ...user,
        phone: user.phone ?? undefined,
        avatarUrl: (await this.avatarService.resolve(user.id)) ?? undefined,
      })),
    );

    return {
      data: dataWithAvatars as any,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    requesterId: string,
    requesterRole: string,
  ): Promise<any> {
    if (requesterId !== id && requesterRole !== 'ADMIN') {
      throw new UnauthorizedUserAccessException();
    }

    const existing = await this.repository.findUserById(id);

    if (!existing) {
      throw new UserNotFoundException();
    }

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await this.repository.findUserByEmail(dto.email);
      if (emailTaken) {
        throw new EmailAlreadyInUseException();
      }
    }

    if (dto.phone && dto.phone !== existing.phone) {
      const phoneTaken = await this.repository.findUserByPhone(dto.phone);
      if (phoneTaken) {
        throw new PhoneAlreadyInUseException();
      }
    }

    const updated = await this.repository.updateUser(id, {
      fullName: dto.fullName,
      email: dto.email ? dto.email.toLowerCase() : undefined,
      phone: dto.phone,
      emailVerified: dto.email ? false : undefined,
      phoneVerified: dto.phone ? false : undefined,
    });

    const avatarUrl = await this.avatarService.resolve(id);

    this.winstonLogger.log('User updated', 'UsersService', {
      targetId: id,
      requesterId,
      changedFields: Object.keys(dto),
    });

    return {
      ...updated,
      avatarUrl,
    };
  }

  async deleteUser(
    id: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<{ message: string }> {
    if (requesterId !== id && requesterRole !== 'ADMIN') {
      throw new UnauthorizedUserAccessException();
    }

    const existing = await this.repository.findUserById(id);

    if (!existing) {
      throw new UserNotFoundException();
    }

    await this.repository.softDeleteUser(id);

    this.winstonLogger.log('User soft-deleted', 'UsersService', {
      targetId: id,
      requesterId,
    });

    return { message: 'User deleted successfully' };
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.repository.findUserByEmail(email);
  }

  async getUserByPhone(phone: string): Promise<any> {
    return this.repository.findUserByPhone(phone);
  }

  async getManagerBusiness(managerId: string): Promise<any> {
    return this.repository.getManagerBusiness(managerId);
  }

}
