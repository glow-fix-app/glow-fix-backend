import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtPayload } from '@glow-fix/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── Own profile ───

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiResponse({ status: 200, description: 'Profile returned' })
  async getMe(
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    return this.usersService.getMe(user.sub);
  }

  // ─── Admin: list all users ───

  @Get()
//   @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  @ApiResponse({ status: 403, description: 'Forbidden — admins only' })
  async getAllUsers(
    @Query() query: GetUsersQueryDto,
  ): Promise<Record<string, unknown>> {
    return this.usersService.getAllUsers(query);
  }

  // ─── Get user by ID ───

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (own profile or admin)' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({ status: 200, description: 'User returned' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    // Non-admins can only fetch their own profile
    if (user.role !== 'ADMIN' && user.sub !== id) {
      throw new ForbiddenException('You are not allowed to view this profile');
    }

    return this.usersService.getUser(id);
  }

  // ─── Update user ───

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (own profile or admin)' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email or mobile already in use' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    return this.usersService.updateUser(id, dto, user.sub, user.role);
  }

  // ─── Delete user ───

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a user (own account or admin)' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(id, user.sub, user.role);
  }
}