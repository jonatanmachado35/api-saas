import { PrismaChatRepository } from '../../infra/repositories/prisma-chat.repository';
import { MessageSender } from '../../domain/entities/chat.entity';
import { AgentRepository } from '../../../agents/domain/repositories/agent.repository.interface';
import { AiChatService } from '../../infra/external-api/ai-chat.service';
export declare class SendMessageUseCase {
    private readonly chatRepository;
    private readonly agentRepository;
    private readonly aiChatService;
    constructor(chatRepository: PrismaChatRepository, agentRepository: AgentRepository, aiChatService: AiChatService);
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
