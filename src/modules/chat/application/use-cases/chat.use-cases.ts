import { Injectable, NotFoundException, Inject, ForbiddenException } from '@nestjs/common';
import { PrismaChatRepository } from '../../infra/repositories/prisma-chat.repository';
import { Message, MessageSender } from '../../domain/entities/chat.entity';
import { AgentRepository } from '../../../agents/domain/repositories/agent.repository.interface';
import { LlmRepository } from '../../../agents/domain/repositories/llm.repository.interface';
import { AiChatService } from '../../infra/external-api/ai-chat.service';
import { SubscriptionRepository } from '../../../subscription/domain/repositories/subscription.repository.interface';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly chatRepository: PrismaChatRepository,
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly aiChatService: AiChatService,
  ) {}

  async execute(chatId: string, content: string, sender: MessageSender, userId: string) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Buscar dados do agent associado ao chat
    const agent = await this.agentRepository.findById(chat.agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    let subscription;
    let llmCreditCost = 1;

    // If sender is USER, verify credits BEFORE calling API
    if (sender === MessageSender.USER) {
      // Determinar o creditCost do LLM para estimativa
      if (agent.llmId) {
        const llm = await this.llmRepository.findById(agent.llmId);
        if (llm) {
          llmCreditCost = llm.creditCost;
        }
      }

      // Verificar saldo de créditos
      subscription = await this.subscriptionRepository.findByUserId(userId);
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      // Verificar mínimo de 6 créditos
      if (subscription.credits < 6) {
        throw new ForbiddenException(
          `Créditos insuficientes. Você precisa de pelo menos 6 créditos para enviar uma mensagem.`
        );
      }
    }

    const message = new Message({
      chatId,
      content,
      sender,
    });

    await this.chatRepository.saveMessage(message);

    // If sender is USER, get agent config and call AI API
    if (sender === MessageSender.USER) {
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

      // Calcular créditos com base no custo REAL da API
      let creditsToDeduct = 1; // fallback padrão
      
      if (aiResponse.usage?.cost) {
        // Fórmula: apiCost * creditCost * 10000, arredondado para cima
        creditsToDeduct = Math.ceil(aiResponse.usage.cost * llmCreditCost * 10000);
        
        // Garantir pelo menos 1 crédito
        if (creditsToDeduct < 1) {
          creditsToDeduct = 1;
        }
      }

      // Verificar novamente se há saldo suficiente (segurança)
      if (subscription.credits < creditsToDeduct) {
        throw new ForbiddenException(
          `Créditos insuficientes para processar esta mensagem. Necessário: ${creditsToDeduct} crédito(s).`
        );
      }

      // Descontar créditos APÓS processar a mensagem e ter o custo real
      subscription.deductCredits(creditsToDeduct);
      await this.subscriptionRepository.save(subscription);

      // Salvar resposta do agent
      const agentMessage = aiResponse.response || aiResponse.message || 
        (aiResponse.choices?.[0]?.message?.content) || 
        'Desculpe, não consegui processar sua mensagem.';
      
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

@Injectable()
export class ListMessagesUseCase {
  constructor(private readonly chatRepository: PrismaChatRepository) {}

  async execute(chatId: string, userId: string) {
    // Verificar se o chat existe e pertence ao usuário
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new NotFoundException('Chat not found');
    }

    const messages = await this.chatRepository.findMessagesByChatId(chatId);
    
    return messages.map(m => ({
      id: m.id,
      chat_id: m.chatId,
      content: m.content,
      sender: m.sender.toLowerCase(),
      timestamp: m.props.timestamp || new Date(),
    }));
  }
}

@Injectable()
export class CreateChatUseCase {
  constructor(
    private readonly chatRepository: PrismaChatRepository,
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(userId: string, agentId: string, title?: string) {
    // Verificar se o agent existe
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Criar o chat
    const chat = await this.chatRepository.createChat(userId, agentId, title);

    return {
      id: chat.id,
      user_id: chat.userId,
      agent_id: chat.agentId,
      title: chat.title,
      created_at: chat.props.createdAt,
      updated_at: chat.props.updatedAt,
    };
  }
}

@Injectable()
export class ClearChatUseCase {
  constructor(private readonly chatRepository: PrismaChatRepository) {}

  async execute(chatId: string, userId: string) {
    // Verificar se o chat existe e pertence ao usuário
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.userId !== userId) {
      throw new NotFoundException('Chat not found');
    }

    // Deletar todas as mensagens do chat
    await this.chatRepository.deleteMessagesByChatId(chatId);

    return {
      message: 'Chat cleared successfully',
    };
  }
}
