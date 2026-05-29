// users.controller.ts
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
import { AvatarService } from './avatar.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { JwtPayload, UserRole } from '@glow-fix/types';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
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






// // Owns all user-profile-related routes.
// // Auth is enforced by the global JwtAuthGuard — no @Public() here.
// //
// // Dependency direction:
// //   UsersModule → can import anything (guards come from AuthModule via global)
// //   AuthModule  → never imports UsersModule
 
// import {
//   Controller,
//   Get,
//   Put,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
//   Param,
//   Body,
//   Patch,
//   ForbiddenException,
//   Query,
// } from '@nestjs/common';
// import { FileInterceptor }   from '@nestjs/platform-express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiConsumes,
//   ApiBody,
//   ApiParam,
// } from '@nestjs/swagger';
// import { memoryStorage } from 'multer';
 
// import { UsersService }  from './users.service';
// import { AvatarService } from './avatar.service';
// import { CurrentUser }   from '../../common/decorators/current-user.decorator';
// import { JwtPayload, UserRole } from '@glow-fix/types';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { GetUsersQueryDto } from './dto/get-users-query.dto';
 
// @ApiTags('Users')
// @ApiBearerAuth('access-token')
// @Controller({ path: 'users', version: '1' })
// export class UsersController {
//   constructor(
//     private readonly usersService:  UsersService,
//     private readonly avatarService: AvatarService,
//   ) {}
 
//   // ── GET /v1/users/me ───────────────────────────────────────────────────────
//   // The single source of truth for the full user profile.
//   // Called after login to hydrate the client-side user store.
//   // avatarUrl is resolved here — Redis-first, one DB query only on cache miss.
 
//   @Get('me')
//   @ApiOperation({ summary: 'Get the authenticated user\'s full profile' })
//   @ApiResponse({ status: 200, description: 'Profile returned successfully' })
//   async getMe(@CurrentUser() actor: JwtPayload) {
//     return this.usersService.getProfile(actor.sub);
//   }
 
//   // ── PUT /v1/users/me/avatar ────────────────────────────────────────────────
 
//   @Put('me/avatar')
//   @HttpCode(HttpStatus.OK)
//   @UseInterceptors(
//     FileInterceptor('avatar', {
//       storage: memoryStorage(),
//       limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB — multer-level guard
//     }),
//   )
//   @ApiOperation({ summary: 'Upload or replace your profile avatar' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       required: ['avatar'],
//       properties: {
//         avatar: {
//           type:        'string',
//           format:      'binary',
//           description: 'JPEG, PNG, WebP, or GIF — max 5 MB',
//         },
//       },
//     },
//   })
//   @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
//   @ApiResponse({ status: 400, description: 'No file / wrong type / too large' })
//   async uploadAvatar(
//     @UploadedFile() file: Express.Multer.File | undefined,
//     @CurrentUser() actor: JwtPayload,
//   ): Promise<{ message: string; url: string }> {
//     if (!file) {
//       throw new BadRequestException(
//         'No file provided. Send the image as the "avatar" field.',
//       );
//     }
 
//     const result = await this.avatarService.upload(actor.sub, {
//       buffer:   file.buffer,
//       mimetype: file.mimetype,
//       size:     file.size,
//     });
 
//     return { message: 'Avatar updated successfully', url: result.url };
//   }
 
//   // ── DELETE /v1/users/me/avatar ─────────────────────────────────────────────
 
//   @Delete('me/avatar')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Remove your profile avatar' })
//   @ApiResponse({ status: 200, description: 'Avatar removed' })
//   @ApiResponse({ status: 404, description: 'No avatar found' })
//   async deleteAvatar(
//     @CurrentUser() actor: JwtPayload,
//   ): Promise<{ message: string }> {
//     await this.avatarService.delete(actor.sub);
//     return { message: 'Avatar removed successfully' };
//   }

//     // ─── Admin: list all users ───

//   @Get()
// //   @Roles(UserRole.ADMIN)
//   @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
//   @ApiResponse({ status: 200, description: 'Paginated user list' })
//   @ApiResponse({ status: 403, description: 'Forbidden — admins only' })
//   async getAllUsers(
//     @Query() query: GetUsersQueryDto,
//   ): Promise<Record<string, unknown>> {
//     return this.usersService.getAllUsers(query);
//   }

//   // ─── Get user by ID ───

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a user by ID (own profile or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User returned' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async getUser(
//     @Param('id') id: string,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<Record<string, unknown>> {
//     // Non-admins can only fetch their own profile
//     if (user.role !== 'ADMIN' && user.sub !== id) {
//       throw new ForbiddenException('You are not allowed to view this profile');
//     }

//     return this.usersService.getUser(id);
//   }

//   // ─── Update user ───

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a user (own profile or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User updated' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   @ApiResponse({ status: 409, description: 'Email or mobile already in use' })
//   async updateUser(
//     @Param('id') id: string,
//     @Body() dto: UpdateUserDto,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<Record<string, unknown>> {
//     return this.usersService.updateUser(id, dto, user.sub, user.role);
//   }

//   // ─── Delete user ───

//   @Delete(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Soft-delete a user (own account or admin)' })
//   @ApiParam({ name: 'id', description: 'Customer UUID' })
//   @ApiResponse({ status: 200, description: 'User deleted' })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   @ApiResponse({ status: 404, description: 'User not found' })
//   async deleteUser(
//     @Param('id') id: string,
//     @CurrentUser() user: JwtPayload,
//   ): Promise<{ message: string }> {
//     return this.usersService.deleteUser(id, user.sub, user.role);
//   }
// }


// // import {
// //   Controller,
// //   Get,
// //   Patch,
// //   Delete,
// //   Param,
// //   Body,
// //   Query,
// //   HttpCode,
// //   HttpStatus,
// //   ForbiddenException,
// // } from '@nestjs/common';
// // import {
// //   ApiTags,
// //   ApiOperation,
// //   ApiResponse,
// //   ApiBearerAuth,
// //   ApiParam,
// // } from '@nestjs/swagger';
// // import { JwtPayload } from '@glow-fix/types';

// // import { CurrentUser } from '../../common/decorators/current-user.decorator';
// // import { Roles } from '../../common/decorators/roles.decorator';

// // import { UsersService } from './users.service';
// // import { UpdateUserDto } from './dto/update-user.dto';
// // import { GetUsersQueryDto } from './dto/get-users-query.dto';

// // @ApiTags('Users')
// // @ApiBearerAuth('access-token')
// // @Controller({ path: 'users', version: '1' })
// // export class UsersController {
// //   constructor(private readonly usersService: UsersService) {}

// //   // ─── Own profile ───

// //   @Get('me')
// //   @ApiOperation({ summary: 'Get own profile' })
// //   @ApiResponse({ status: 200, description: 'Profile returned' })
// //   async getMe(
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.getMe(user.sub);
// //   }

// //   // ─── Admin: list all users ───

// //   @Get()
// // //   @Roles(UserRole.ADMIN)
// //   @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
// //   @ApiResponse({ status: 200, description: 'Paginated user list' })
// //   @ApiResponse({ status: 403, description: 'Forbidden — admins only' })
// //   async getAllUsers(
// //     @Query() query: GetUsersQueryDto,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.getAllUsers(query);
// //   }

// //   // ─── Get user by ID ───

// //   @Get(':id')
// //   @ApiOperation({ summary: 'Get a user by ID (own profile or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User returned' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   async getUser(
// //     @Param('id') id: string,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     // Non-admins can only fetch their own profile
// //     if (user.role !== 'ADMIN' && user.sub !== id) {
// //       throw new ForbiddenException('You are not allowed to view this profile');
// //     }

// //     return this.usersService.getUser(id);
// //   }

// //   // ─── Update user ───

// //   @Patch(':id')
// //   @ApiOperation({ summary: 'Update a user (own profile or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User updated' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   @ApiResponse({ status: 409, description: 'Email or mobile already in use' })
// //   async updateUser(
// //     @Param('id') id: string,
// //     @Body() dto: UpdateUserDto,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<Record<string, unknown>> {
// //     return this.usersService.updateUser(id, dto, user.sub, user.role);
// //   }

// //   // ─── Delete user ───

// //   @Delete(':id')
// //   @HttpCode(HttpStatus.OK)
// //   @ApiOperation({ summary: 'Soft-delete a user (own account or admin)' })
// //   @ApiParam({ name: 'id', description: 'Customer UUID' })
// //   @ApiResponse({ status: 200, description: 'User deleted' })
// //   @ApiResponse({ status: 403, description: 'Forbidden' })
// //   @ApiResponse({ status: 404, description: 'User not found' })
// //   async deleteUser(
// //     @Param('id') id: string,
// //     @CurrentUser() user: JwtPayload,
// //   ): Promise<{ message: string }> {
// //     return this.usersService.deleteUser(id, user.sub, user.role);
// //   }
// // }