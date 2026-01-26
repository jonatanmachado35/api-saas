import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaChatRepository } from '../../infra/repositories/prisma-chat.repository';
import { Message, MessageSender } from '../../domain/entities/chat.entity';
import { AgentRepository } from '../../../agents/domain/repositories/agent.repository.interface';
import { AiChatService } from '../../infra/external-api/ai-chat.service';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly chatRepository: PrismaChatRepository,
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
    private readonly aiChatService: AiChatService,
  ) {}

  async execute(chatId: string, content: string, sender: MessageSender) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const message = new Message({
      chatId,
      content,
      sender,
    });

    await this.chatRepository.saveMessage(message);

    // If sender is USER, get agent config and call AI API
    if (sender === MessageSender.USER) {
      // Buscar dados do agent associado ao chat
      const agent = await this.agentRepository.findById(chat.agentId);
      if (!agent) {
        throw new NotFoundException('Agent not found');
      }

      // Preparar regras como array
      const rules = agent.rules ? agent.rules.split('\n').filter(r => r.trim()) : [];

      // Chamar API externa
      const aiResponse = await this.aiChatService.sendMessage({
        message: content,
        agent: {
          type: agent.type || 'general',
          persona: {
            tone: agent.tone || 'professional',
            style: agent.style || 'formal',
            focus: agent.focus || 'general',
          },
          rules,
        },
      });

      // Salvar resposta do agent
      const agentMessage = aiResponse.response || aiResponse.message || 'Desculpe, não consegui processar sua mensagem.';
      const agentResponse = new Message({
        chatId,
        content: agentMessage,
        sender: MessageSender.AGENT,
      });
      await this.chatRepository.saveMessage(agentResponse);

      return {
        id: message.id,
        chat_id: message.chatId,
        content: message.content,
        sender: 'user',
        timestamp: message.props.timestamp || new Date(),
        agent_response: {
          id: agentResponse.id,
          content: agentResponse.content,
          sender: 'agent',
          timestamp: agentResponse.props.timestamp || new Date(),
        },
      };
    }

    return {
      id: message.id,
      chat_id: message.chatId,
      content: message.content,
      sender: sender.toLowerCase(),
      timestamp: message.props.timestamp || new Date(),
    };
  }
}

@Injectable()
export class ListChatsUseCase {
  constructor(private readonly chatRepository: PrismaChatRepository) {}

  async execute(userId: string) {
    const chats = await this.chatRepository.findByUserIdWithLastMessage(userId);
    return chats;
  }
}
