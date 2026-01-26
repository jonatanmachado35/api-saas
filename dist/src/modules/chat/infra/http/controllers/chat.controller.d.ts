import { ListChatsUseCase, SendMessageUseCase, CreateChatUseCase } from '../../../application/use-cases/chat.use-cases';
import { SendMessageDto, CreateChatDto } from '../dtos/chat.dto';
export declare class ChatController {
    private readonly listUseCase;
    private readonly sendUseCase;
    private readonly createUseCase;
    constructor(listUseCase: ListChatsUseCase, sendUseCase: SendMessageUseCase, createUseCase: CreateChatUseCase);
    list(user: any): Promise<any[]>;
    create(user: any, body: CreateChatDto): Promise<{
        id: string;
        user_id: string;
        agent_id: string;
        title: string | null | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
    sendMessage(chatId: string, body: SendMessageDto): Promise<{
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
