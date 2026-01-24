import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Chat, Message, MessageSender } from '../../domain/entities/chat.entity';

@Injectable()
export class PrismaChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(chat: Chat): Promise<void> {
    const data = {
      id: chat.id,
      user_id: chat.userId,
      agent_id: chat.agentId,
      title: chat.title,
    };

    await this.prisma.chat.upsert({
      where: { id: chat.id },
      update: data,
      create: data,
    });
  }

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({ where: { id } });
    if (!chat) return null;

    return new Chat(
      {
        userId: chat.user_id,
        agentId: chat.agent_id,
        title: chat.title,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
      },
      chat.id,
    );
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
    });

    return chats.map(
      (chat) =>
        new Chat(
          {
            userId: chat.user_id,
            agentId: chat.agent_id,
            title: chat.title,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
          },
          chat.id,
        ),
    );
  }

  async findByUserIdWithLastMessage(userId: string): Promise<any[]> {
    const chats = await this.prisma.chat.findMany({
      where: { user_id: userId },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    return chats.map((chat) => ({
      id: chat.id,
      user_id: chat.user_id,
      agent_id: chat.agent_id,
      title: chat.title,
      last_message: chat.messages[0]?.content || null,
      unread: chat.unread,
      created_at: chat.created_at,
    }));
  }

  async saveMessage(message: Message): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.id,
        chat_id: message.chatId,
        content: message.content,
        sender: message.sender,
      },
    });

    // Update chat's updated_at
    await this.prisma.chat.update({
      where: { id: message.chatId },
      data: { updated_at: new Date() },
    });
  }

  async findMessagesByChatId(chatId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { chat_id: chatId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map(
      (m) =>
        new Message(
          {
            chatId: m.chat_id,
            content: m.content,
            sender: m.sender as MessageSender,
            timestamp: m.timestamp,
          },
          m.id,
        ),
    );
  }
}
