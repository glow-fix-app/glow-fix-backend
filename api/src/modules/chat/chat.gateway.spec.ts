import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TokenService } from '../auth/token.service';
import { RedisService } from '../../core/redis/redis.service';
import { ChatService } from './chat.service';
import { MetricsService } from '../../core/metrics/metrics.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let prisma: any;
  let tokenService: { verifyAccessToken: jest.Mock };
  let chatService: {
    assertParticipant: jest.Mock;
    setTyping: jest.Mock;
    sendMessage: jest.Mock;
  };
  let metrics: {
    websocketConnections: {
      inc: jest.Mock;
      dec: jest.Mock;
    };
  };

  const validPayload = {
    sub: 'user-1',
    role: 'CLIENT',
    sessionId: 'session-1',
  };

  function createClient(overrides: Partial<any> = {}) {
    return {
      id: 'socket-1',
      handshake: {
        auth: { token: 'valid-token' },
        headers: {},
      },
      data: {},
      join: jest.fn().mockResolvedValue(undefined),
      leave: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn(),
      ...overrides,
    } as any;
  }

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
      },
      userSession: {
        findUnique: jest.fn(),
      },
    };

    tokenService = {
      verifyAccessToken: jest.fn(),
    };

    chatService = {
      assertParticipant: jest.fn(),
      setTyping: jest.fn(),
      sendMessage: jest.fn(),
    };

    metrics = {
      websocketConnections: {
        inc: jest.fn(),
        dec: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: PrismaService, useValue: prisma },
        { provide: TokenService, useValue: tokenService },
        { provide: RedisService, useValue: {} },
        { provide: ChatService, useValue: chatService },
        { provide: MetricsService, useValue: metrics },
      ],
    }).compile();

    gateway = module.get(ChatGateway);
    gateway.server = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    } as any;
    jest.clearAllMocks();
  });

  it('unauthorized socket is disconnected rejected', async () => {
    const client = createClient({
      handshake: { auth: {}, headers: {} },
    });

    await gateway.handleConnection(client);

    expect(client.disconnect).toHaveBeenCalledWith(true);
    expect(metrics.websocketConnections.inc).not.toHaveBeenCalled();
  });

  it('expired session is rejected', async () => {
    const client = createClient();
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValueOnce({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValueOnce({
      id: 'session-1',
      expiresAt: new Date('2026-05-29T00:00:00.000Z'),
    });

    await gateway.handleConnection(client);

    expect(client.disconnect).toHaveBeenCalledWith(true);
    expect(metrics.websocketConnections.inc).not.toHaveBeenCalled();
  });

  it('non-participant cannot join conversation', async () => {
    const client = createClient();
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-05-30T00:00:00.000Z'),
    });
    chatService.assertParticipant.mockRejectedValueOnce(new Error('Access denied'));

    await gateway.handleConnection(client);

    await expect(
      gateway.joinConversation(client, { conversationId: 'conversation-1' }),
    ).rejects.toThrow('Access denied');
    expect(client.join).toHaveBeenCalledTimes(1);
    expect(client.join).toHaveBeenCalledWith('user:user-1');
  });

  it('non-participant cannot typing.start', async () => {
    const client = createClient();
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-05-30T00:00:00.000Z'),
    });
    chatService.assertParticipant.mockRejectedValueOnce(new Error('Access denied'));

    await gateway.handleConnection(client);

    await expect(
      gateway.typingStart(client, { conversationId: 'conversation-1' }),
    ).rejects.toThrow('Access denied');
    expect(chatService.setTyping).not.toHaveBeenCalled();
  });

  it('non-participant cannot typing.stop', async () => {
    const client = createClient();
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-05-30T00:00:00.000Z'),
    });
    chatService.assertParticipant.mockRejectedValueOnce(new Error('Access denied'));

    await gateway.handleConnection(client);

    await expect(
      gateway.typingStop(client, { conversationId: 'conversation-1' }),
    ).rejects.toThrow('Access denied');
    expect(chatService.setTyping).not.toHaveBeenCalled();
  });

  it('conversation.leave validates participant', async () => {
    const client = createClient();
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-05-30T00:00:00.000Z'),
    });
    chatService.assertParticipant.mockResolvedValueOnce(undefined);
    chatService.setTyping.mockResolvedValueOnce(undefined);

    await gateway.handleConnection(client);

    const result = await gateway.leaveConversation(client, { conversationId: 'conversation-1' });

    expect(result).toEqual({ ok: true });
    expect(chatService.assertParticipant).toHaveBeenCalledWith('conversation-1', 'user-1');
    expect(client.leave).toHaveBeenCalledWith('conversation:conversation-1');
  });

  it('message.send emits message.created only after participant validation', async () => {
    const client = createClient();
    const message = { id: 'message-1', conversationId: 'conversation-1' };
    tokenService.verifyAccessToken.mockReturnValue(validPayload);
    prisma.user.findFirst.mockResolvedValue({ id: 'user-1' });
    prisma.userSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-05-30T00:00:00.000Z'),
    });
    chatService.sendMessage.mockResolvedValueOnce(message);

    await gateway.handleConnection(client);

    const result = await gateway.sendMessage(client, {
      conversationId: 'conversation-1',
      body: 'Hello there',
    });

    expect(result).toEqual(message);
    expect(chatService.sendMessage).toHaveBeenCalledWith(
      'conversation-1',
      'user-1',
      'CLIENT',
      'Hello there',
    );
    expect((gateway.server.to as jest.Mock).mock.calls).toHaveLength(0);
  });
});
