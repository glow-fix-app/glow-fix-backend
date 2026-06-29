import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from '../services/chat.service';
import { ConversationCreateType } from '../dto/create-conversation.dto';

describe('ChatController', () => {
  let controller: ChatController;
  let service: jest.Mocked<ChatService>;

  const mockChatService = {
    listConversations: jest.fn(),
    getConversation: jest.fn(),
    createConversation: jest.fn(),
    listMessages: jest.fn(),
    sendMessage: jest.fn(),
    markRead: jest.fn(),
    editMessage: jest.fn(),
    deleteMessage: jest.fn(),
    getStatusId: jest.fn(),
    assertParticipant: jest.fn(),
    setTyping: jest.fn(),
  };

  const currentUser = {
    id: 'client-1',
    email: 'client@example.com',
    fullName: 'Client User',
    role: 'CLIENT',
    sessionId: 'session-1',
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    controller = module.get(ChatController);
    service = module.get(ChatService);
    jest.clearAllMocks();
  });

  it('passes explicit participant data to createConversation', async () => {
    service.createConversation.mockResolvedValueOnce({ id: 'conversation-1' } as never);

    const dto = {
      type: ConversationCreateType.GENERAL,
      targetUserId: 'manager-1',
      participantUserIds: ['admin-1'],
    };

    await controller.create(currentUser, dto);

    expect(service.createConversation).toHaveBeenCalledWith({
      userId: 'client-1',
      userRole: 'CLIENT',
      type: ConversationCreateType.GENERAL,
      bookingId: undefined,
      targetUserId: 'manager-1',
      participantUserIds: ['admin-1'],
    });
  });

  it('passes sender identity through when creating a message', async () => {
    service.sendMessage.mockResolvedValueOnce({ id: 'message-1' } as never);

    await controller.send(currentUser, 'conversation-1', { body: 'Hello there' });

    expect(service.sendMessage).toHaveBeenCalledWith(
      'conversation-1',
      'client-1',
      'CLIENT',
      'Hello there',
    );
  });
});
