import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaChatRepository } from '../../infra/repositories/prisma-chat.repository';
import { Message, MessageSender } from '../../domain/entities/chat.entity';

@Injectable()
export class SendMessageUseCase {
  constructor(private readonly chatRepository: PrismaChatRepository) {}

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

    // If sender is USER, simulate agent response
    if (sender === MessageSender.USER) {
      const agentResponse = new Message({
        chatId,
        content: 'Obrigado pela sua mensagem! Como posso ajudar?',
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
