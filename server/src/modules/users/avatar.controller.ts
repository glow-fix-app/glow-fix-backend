// Routes:
//   PUT    /v1/users/me/avatar   Upload or replace the caller's avatar
//   DELETE /v1/users/me/avatar   Remove the caller's avatar
//
// Both routes require a valid JWT (no @Public() decorator).
// Multipart parsing is handled by the FileInterceptor (multer under the hood).
// The file never touches disk — memoryStorage keeps it in RAM until
// StorageService uploads it to S3.

import {
  Controller,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
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
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { AvatarService } from './avatar.service';
import { CurrentUser }   from '../../common/decorators/current-user.decorator';
import { JwtPayload }    from '@glow-fix/types';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
@ApiBearerAuth('access-token')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  // ── Upload / Replace ────────────────────────────────────────────────────────

  @Put('me/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(), // keep file in RAM — no temp files on disk
      limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB guard at multer level too
    }),
  )
  @ApiOperation({ summary: 'Upload or replace your profile avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type:   'string',
          format: 'binary',
          description: 'JPEG, PNG, WebP, or GIF — max 5 MB',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file / unsupported type / too large' })
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string; url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided. Send the image as "avatar" field.');
    }

    const result = await this.avatarService.upload(user.sub, {
      buffer:   file.buffer,
      mimetype: file.mimetype,
      size:     file.size,
    });

    return { message: 'Avatar updated successfully', url: result.url };
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  @Delete('me/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove your profile avatar' })
  @ApiResponse({ status: 200, description: 'Avatar removed successfully' })
  @ApiResponse({ status: 404, description: 'No avatar found' })
  async deleteAvatar(
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.avatarService.delete(user.sub);
    return { message: 'Avatar removed successfully' };
  }
}