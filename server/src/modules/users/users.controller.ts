import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { UsersService } from './users.service';
import { AvatarService } from './services/avatar.service';
import { LocationService } from './services/location.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetUsersQueryDto } from './dto/request/get-users-query.dto';
import { UpdateLocationDto } from './dto/request/update-location.dto';
import { JwtPayload, UserRole } from '@glow-fix/types';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
    private readonly locationService: LocationService,
  ) {}

  // ─── GET /v1/users/me ───
  @Get('me')
  @ApiOperation({ summary: "Get authenticated user's full profile" })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  async getMe(@CurrentUser() actor: JwtPayload) {
    return this.usersService.getProfile(actor.sub);
  }

  // ─── GET /v1/users/me/client (client-specific data) ───
  @Get('me/client')
  @ApiOperation({ summary: "Get authenticated user's client profile with location" })
  @ApiResponse({ status: 200, description: 'Client profile returned' })
  async getMyClientProfile(@CurrentUser() actor: JwtPayload) {
    return this.usersService.getClientProfile(actor.sub);
  }

  // ─── PUT /v1/users/me ───
  @Put('me')
  @ApiOperation({ summary: "Update authenticated user's profile" })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(
    @CurrentUser() actor: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<Record<string, unknown>> {
    return this.usersService.updateUser(actor.sub, dto, actor.sub, actor.role);
  }

  // ─── PUT /v1/users/me/avatar ───
  @Put('me/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Upload or replace profile avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['avatar'],
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'JPEG, PNG, WebP, or GIF — max 5 MB',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() actor: JwtPayload,
  ): Promise<{ message: string; url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided. Send image as "avatar" field.');
    }

    const result = await this.avatarService.upload(actor.sub, {
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
    });

    return { message: 'Avatar updated successfully', url: result.url };
  }

  // ─── DELETE /v1/users/me/avatar ───
  @Delete('me/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove profile avatar' })
  @ApiResponse({ status: 200, description: 'Avatar removed' })
  async deleteAvatar(
    @CurrentUser() actor: JwtPayload,
  ): Promise<{ message: string }> {
    await this.avatarService.delete(actor.sub);
    return { message: 'Avatar removed successfully' };
  }

  // ─── DELETE /v1/users/me ───
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete own account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  async deleteMe(@CurrentUser() actor: JwtPayload): Promise<{ message: string }> {
    return this.usersService.deleteUser(actor.sub, actor.sub, actor.role);
  }

  // ==================== LOCATION ====================

  @Patch('me/location')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update authenticated user's client location" })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  async updateLocation(
    @CurrentUser() actor: JwtPayload,
    @Body() dto: UpdateLocationDto,
  ): Promise<{ message: string }> {
    await this.locationService.updateClientLocation(actor.sub, dto);
    return { message: 'Location updated successfully' };
  }

  // ==================== ADMIN ONLY ENDPOINTS ====================

  // ─── GET /v1/users (admin only) ───
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  async getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getAllUsers(query);
  }

  // ─── GET /v1/users/:id (admin or self) ───
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (own profile or admin)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User returned' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUser(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    if (user.role !== 'ADMIN' && user.sub !== id) {
      throw new ForbiddenException('You are not allowed to view this profile');
    }
    return this.usersService.getUser(id);
  }

  // ─── PATCH /v1/users/:id (admin or self) ───
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (own profile or admin)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    return this.usersService.updateUser(id, dto, user.sub, user.role);
  }

  // ─── DELETE /v1/users/:id (admin only) ───
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(id, user.sub, user.role);
  }

  // ─── GET /v1/users/:id/business (manager's business) ───
  @Get(':id/business')
  @Roles(UserRole.ADMIN, 'MANAGER' as any)
  @ApiOperation({ summary: "Get manager's business (admin/manager only)" })
  async getManagerBusiness(@Param('id') id: string) {
    return this.usersService.getManagerBusiness(id);
  }
}