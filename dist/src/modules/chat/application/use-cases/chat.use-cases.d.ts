import { PrismaChatRepository } from '../../infra/repositories/prisma-chat.repository';
import { MessageSender } from '../../domain/entities/chat.entity';
export declare class SendMessageUseCase {
    private readonly chatRepository;
    constructor(chatRepository: PrismaChatRepository);
    execute(chatId: string, content: string, sender: MessageSender): Promise<{
        id: string;
        chat_id: string;
        content: string;
        sender: string;
        timestamp: Date;
        agent_response: {
            id: string;
            content: string;
            sender: string;
            timestamp: Date;
        };
    } | {
        id: string;
        chat_id: string;
        content: string;
        sender: string;
        timestamp: Date;
        agent_response?: undefined;
    }>;
}
export declare class ListChatsUseCase {
    private readonly chatRepository;
    constructor(chatRepository: PrismaChatRepository);
    execute(userId: string): Promise<any[]>;
}
