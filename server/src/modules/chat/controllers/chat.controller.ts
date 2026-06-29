import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthUser } from '../../auth/types/auth.types';
import { ChatService } from '../services/chat.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessagesQueryDto } from '../dto/messages-query.dto';
import { UploadAttachmentDto } from '../dto/upload-attachment.dto';

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'chat', version: '1' })
export class ChatController {
  constructor(private readonly service: ChatService) { }

  @Get('conversations')
  list(@CurrentUser() user: AuthUser) {
    return this.service.listConversations(user.id);
  }

  @Get('conversations/:id')
  getOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.getConversation(id, user.id);
  }

  @Post('conversations')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateConversationDto) {
    return this.service.createConversation({
      userId: user.id,
      userRole: user.role,
      type: dto.type,
      bookingId: dto.bookingId,
      targetUserId: dto.targetUserId,
      participantUserIds: dto.participantUserIds,
    });
  }

  @Get('conversations/:id/messages')
  messages(@CurrentUser() user: AuthUser, @Param('id') id: string, @Query() query: MessagesQueryDto) {
    return this.service.listMessages(id, user.id, query);
  }

  @Post('conversations/:id/messages')
  send(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(id, user.id, user.role, dto.body);
  }

  @Post('conversations/:id/messages/upload')
  @ApiOperation({ summary: 'Upload a file attachment to a conversation' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  uploadAttachment(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadAttachmentDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Allowed: images, PDF, Word documents.`,
      );
    }

    return this.service.sendFileMessage(
      id,
      user.id,
      user.role,
      file.buffer,
      file.mimetype,
      file.originalname,
      dto.caption,
    );
  }

  @Patch('conversations/:id/read')
  read(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.markRead(id, user.id);
  }

  @Patch('messages/:id')
  edit(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.service.editMessage(id, user.id, dto.body);
  }

  @Delete('messages/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.deleteMessage(id, user.id);
  }
}
