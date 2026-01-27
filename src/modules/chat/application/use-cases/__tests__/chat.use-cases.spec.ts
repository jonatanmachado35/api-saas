import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  SendMessageUseCase,
  ListChatsUseCase,
  CreateChatUseCase,
  ListMessagesUseCase,
  ClearChatUseCase,
} from '../chat.use-cases';
import { PrismaChatRepository } from '../../../infra/repositories/prisma-chat.repository';
import { AgentRepository } from '../../../../agents/domain/repositories/agent.repository.interface';
import { AiChatService } from '../../../infra/external-api/ai-chat.service';
import { Chat, Message, MessageSender } from '../../../domain/entities/chat.entity';
import { Agent, AgentVisibility } from '../../../../agents/domain/entities/agent.entity';

describe('Chat Use Cases', () => {
  let sendMessageUseCase: SendMessageUseCase;
  let listChatsUseCase: ListChatsUseCase;
  let createChatUseCase: CreateChatUseCase;
  let listMessagesUseCase: ListMessagesUseCase;
  let clearChatUseCase: ClearChatUseCase;
  let chatRepository: jest.Mocked<PrismaChatRepository>;
  let agentRepository: jest.Mocked<AgentRepository>;
  let aiChatService: jest.Mocked<AiChatService>;

  const mockChat = new Chat(
    {
      userId: 'user-123',
      agentId: 'agent-123',
      title: 'Test Chat',
    },
    'chat-123',
  );

  const mockAgent = new Agent(
    {
      userId: 'user-123',
      name: 'Test Agent',
      type: 'social_media',
      tone: 'professional',
      style: 'formal',
      focus: 'marketing',
      rules: 'Rule 1\nRule 2',
      visibility: AgentVisibility.PRIVATE,
    },
    'agent-123',
  );

  const mockMessage = new Message({
    chatId: 'chat-123',
    content: 'Hello',
    sender: MessageSender.USER,
  });

  beforeEach(async () => {
    const mockChatRepository = {
      findById: jest.fn(),
      saveMessage: jest.fn(),
      findByUserIdWithLastMessage: jest.fn(),
      createChat: jest.fn(),
      findMessagesByChatId: jest.fn(),
      deleteMessagesByChatId: jest.fn(),
    };

    const mockAgentRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByUserId: jest.fn(),
      findAccessibleByUser: jest.fn(),
      findAll: jest.fn(),
    };

    const mockAiChatService = {
      sendMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageUseCase,
        ListChatsUseCase,
        CreateChatUseCase,
        ListMessagesUseCase,
        ClearChatUseCase,
        { provide: PrismaChatRepository, useValue: mockChatRepository },
        { provide: 'AgentRepository', useValue: mockAgentRepository },
        { provide: AiChatService, useValue: mockAiChatService },
      ],
    }).compile();

    sendMessageUseCase = module.get<SendMessageUseCase>(SendMessageUseCase);
    listChatsUseCase = module.get<ListChatsUseCase>(ListChatsUseCase);
    createChatUseCase = module.get<CreateChatUseCase>(CreateChatUseCase);
    listMessagesUseCase = module.get<ListMessagesUseCase>(ListMessagesUseCase);
    clearChatUseCase = module.get<ClearChatUseCase>(ClearChatUseCase);
    chatRepository = module.get(PrismaChatRepository);
    agentRepository = module.get('AgentRepository');
    aiChatService = module.get(AiChatService);
  });

  describe('SendMessageUseCase', () => {
    it('deve salvar mensagem do usuário', async () => {
      chatRepository.findById.mockResolvedValue(mockChat);
      agentRepository.findById.mockResolvedValue(mockAgent);
      aiChatService.sendMessage.mockResolvedValue({ response: 'AI Response' });
      chatRepository.saveMessage.mockResolvedValue();

      await sendMessageUseCase.execute('chat-123', 'Hello', MessageSender.USER);

      expect(chatRepository.saveMessage).toHaveBeenCalledTimes(2); // User + Agent message
      expect(aiChatService.sendMessage).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se chat não existir', async () => {
      chatRepository.findById.mockResolvedValue(null);

      await expect(
        sendMessageUseCase.execute('invalid-chat', 'Hello', MessageSender.USER),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve enviar configuração do agent para a AI API', async () => {
      chatRepository.findById.mockResolvedValue(mockChat);
      agentRepository.findById.mockResolvedValue(mockAgent);
      aiChatService.sendMessage.mockResolvedValue({ response: 'AI Response' });
      chatRepository.saveMessage.mockResolvedValue();

      await sendMessageUseCase.execute('chat-123', 'Test message', MessageSender.USER);

      expect(aiChatService.sendMessage).toHaveBeenCalledWith({
        message: 'Test message',
        agent: {
          type: 'social_media',
          persona: {
            tone: 'professional',
            style: 'formal',
            focus: 'marketing',
          },
          rules: ['Rule 1', 'Rule 2'],
        },
      });
    });

    it('deve retornar mensagem do usuário e resposta do agent', async () => {
      chatRepository.findById.mockResolvedValue(mockChat);
      agentRepository.findById.mockResolvedValue(mockAgent);
      aiChatService.sendMessage.mockResolvedValue({ response: 'AI Response' });
      chatRepository.saveMessage.mockResolvedValue();

      const result = await sendMessageUseCase.execute('chat-123', 'Hello', MessageSender.USER);

      expect(result).toHaveProperty('content', 'Hello');
      expect(result).toHaveProperty('sender', 'user');
      expect(result).toHaveProperty('agent_response');
      expect(result.agent_response).toHaveProperty('content', 'AI Response');
      expect(result.agent_response).toHaveProperty('sender', 'agent');
    });
  });

  describe('ListChatsUseCase', () => {
    it('deve listar chats do usuário', async () => {
      const mockChats = [
        {
          id: 'chat-1',
          user_id: 'user-123',
          agent_id: 'agent-123',
          title: 'Chat 1',
          last_message: 'Last message',
          unread: false,
          created_at: new Date(),
        },
      ];

      chatRepository.findByUserIdWithLastMessage.mockResolvedValue(mockChats);

      const result = await listChatsUseCase.execute('user-123');

      expect(chatRepository.findByUserIdWithLastMessage).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockChats);
      expect(result).toHaveLength(1);
    });

    it('deve retornar array vazio se não houver chats', async () => {
      chatRepository.findByUserIdWithLastMessage.mockResolvedValue([]);

      const result = await listChatsUseCase.execute('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('CreateChatUseCase', () => {
    it('deve criar um chat com sucesso', async () => {
      agentRepository.findById.mockResolvedValue(mockAgent);
      chatRepository.createChat.mockResolvedValue(mockChat);

      const result = await createChatUseCase.execute('user-123', 'agent-123', 'New Chat');

      expect(agentRepository.findById).toHaveBeenCalledWith('agent-123');
      expect(chatRepository.createChat).toHaveBeenCalledWith('user-123', 'agent-123', 'New Chat');
      expect(result).toHaveProperty('id', 'chat-123');
      expect(result).toHaveProperty('agent_id', 'agent-123');
      expect(result).toHaveProperty('title', 'Test Chat');
    });

    it('deve lançar NotFoundException se agent não existir', async () => {
      agentRepository.findById.mockResolvedValue(null);

      await expect(
        createChatUseCase.execute('user-123', 'invalid-agent'),
      ).rejects.toThrow(NotFoundException);

      expect(chatRepository.createChat).not.toHaveBeenCalled();
    });

    it('deve criar chat sem título', async () => {
      agentRepository.findById.mockResolvedValue(mockAgent);
      chatRepository.createChat.mockResolvedValue(mockChat);

      await createChatUseCase.execute('user-123', 'agent-123');

      expect(chatRepository.createChat).toHaveBeenCalledWith('user-123', 'agent-123', undefined);
    });
  });

  describe('ListMessagesUseCase', () => {
    it('deve listar mensagens de um chat', async () => {
      const messages = [
        new Message({
          chatId: 'chat-123',
          content: 'Message 1',
          sender: MessageSender.USER,
        }),
        new Message({
          chatId: 'chat-123',
          content: 'Message 2',
          sender: MessageSender.AGENT,
        }),
      ];

      chatRepository.findById.mockResolvedValue(mockChat);
      chatRepository.findMessagesByChatId.mockResolvedValue(messages);

      const result = await listMessagesUseCase.execute('chat-123', 'user-123');

      expect(chatRepository.findById).toHaveBeenCalledWith('chat-123');
      expect(chatRepository.findMessagesByChatId).toHaveBeenCalledWith('chat-123');
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('content', 'Message 1');
      expect(result[0]).toHaveProperty('sender', 'user');
      expect(result[1]).toHaveProperty('sender', 'agent');
    });

    it('deve lançar NotFoundException se chat não existir', async () => {
      chatRepository.findById.mockResolvedValue(null);

      await expect(
        listMessagesUseCase.execute('invalid-chat', 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException se chat não pertence ao usuário', async () => {
      const otherUserChat = new Chat(
        {
          userId: 'other-user',
          agentId: 'agent-123',
        },
        'chat-123',
      );

      chatRepository.findById.mockResolvedValue(otherUserChat);

      await expect(
        listMessagesUseCase.execute('chat-123', 'user-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ClearChatUseCase', () => {
    it('deve limpar todas as mensagens de um chat', async () => {
      chatRepository.findById.mockResolvedValue(mockChat);
      chatRepository.deleteMessagesByChatId.mockResolvedValue();

      const result = await clearChatUseCase.execute('chat-123', 'user-123');

      expect(chatRepository.findById).toHaveBeenCalledWith('chat-123');
      expect(chatRepository.deleteMessagesByChatId).toHaveBeenCalledWith('chat-123');
      expect(result).toHaveProperty('message', 'Chat cleared successfully');
    });

    it('deve lançar NotFoundException se chat não existir', async () => {
      chatRepository.findById.mockResolvedValue(null);

      await expect(
        clearChatUseCase.execute('invalid-chat', 'user-123'),
      ).rejects.toThrow(NotFoundException);

      expect(chatRepository.deleteMessagesByChatId).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se chat não pertence ao usuário', async () => {
      const otherUserChat = new Chat(
        {
          userId: 'other-user',
          agentId: 'agent-123',
        },
        'chat-123',
      );

      chatRepository.findById.mockResolvedValue(otherUserChat);

      await expect(
        clearChatUseCase.execute('chat-123', 'user-123'),
      ).rejects.toThrow(NotFoundException);

      expect(chatRepository.deleteMessagesByChatId).not.toHaveBeenCalled();
    });
  });
});
