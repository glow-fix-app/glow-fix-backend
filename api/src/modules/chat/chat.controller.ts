import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth.types';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@Controller({ version: '1' })
export class ChatController {
  constructor(private readonly service: ChatService) {}

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
