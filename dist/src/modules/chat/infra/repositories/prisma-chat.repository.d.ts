import { PrismaService } from '../../../prisma/prisma.service';
import { Chat, Message } from '../../domain/entities/chat.entity';
export declare class PrismaChatRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(chat: Chat): Promise<void>;
    createChat(userId: string, agentId: string, title?: string): Promise<Chat>;
    findById(id: string): Promise<Chat | null>;
    findByUserId(userId: string): Promise<Chat[]>;
    findByUserIdWithLastMessage(userId: string): Promise<any[]>;
    saveMessage(message: Message): Promise<void>;
    findMessagesByChatId(chatId: string): Promise<Message[]>;
}
