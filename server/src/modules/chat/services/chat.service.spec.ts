import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantRole } from '@prisma/client';
import { RedisService } from '../../../core/redis/redis.service';
import { StorageService } from '../../../core/storage/storage.service';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from '../repositories/chat.repository';
import { ConversationCreateType } from '../dto/create-conversation.dto';

describe('ChatService', () => {
  let service: ChatService;
  let repository: any;
  let redis: { set: jest.Mock; del: jest.Mock };
  let storage: { uploadFile: jest.Mock };
  let gateway: {
    emitMessageCreated: jest.Mock;
    emitMessageEdited: jest.Mock;
    emitMessageDeleted: jest.Mock;
    emitMessageRead: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      getStatusId: jest.fn().mockResolvedValue('status-1'),
      findAvatars: jest.fn().mockResolvedValue(new Map()),
      listConversations: jest.fn().mockResolvedValue([]),
      getConversation: jest.fn(),
      findBooking: jest.fn(),
      findAdmin: jest.fn(),
      findUsersByIds: jest.fn(),
      findExistingConversation: jest.fn(),
      findExistingBookingConversation: jest.fn(),
      createConversation: jest.fn(),
      fetchConversationById: jest.fn(),
      ensureParticipants: jest.fn(),
      assertParticipant: jest.fn(),
      updateParticipantsRead: jest.fn(),
      listMessages: jest.fn().mockResolvedValue([[], 0]),
      createMessageAndUpdateConversation: jest.fn(),
      findMessage: jest.fn(),
      updateMessageDeliveredAt: jest.fn(),
      updateMessageReadStatus: jest.fn(),
      updateMessageBody: jest.fn(),
      deleteMessage: jest.fn(),
    };

    redis = {
      set: jest.fn(),
      del: jest.fn(),
    };

    storage = {
      uploadFile: jest.fn(),
    };

    gateway = {
      emitMessageCreated: jest.fn(),
      emitMessageEdited: jest.fn(),
      emitMessageDeleted: jest.fn(),
      emitMessageRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: ChatRepository, useValue: repository },
        { provide: RedisService, useValue: redis },
        { provide: StorageService, useValue: storage },
        { provide: ChatGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listConversations', () => {
    it('should return conversations', async () => {
      const result = await service.listConversations('user-1');
      expect(result).toEqual([]);
      expect(repository.listConversations).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getConversation', () => {
    it('should throw if not found', async () => {
      repository.getConversation.mockResolvedValue(null);
      await expect(service.getConversation('conv-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('should return conversation', async () => {
      repository.getConversation.mockResolvedValue({ 
        id: 'conv-1', 
        participants: [], 
        status: { id: 'status-1', context: 'open' } 
      });
      const result = await service.getConversation('conv-1', 'user-1');
      expect(result).toBeDefined();
      expect(result.id).toEqual('conv-1');
    });
  });
});
