import { ListChatsUseCase, SendMessageUseCase, CreateChatUseCase, ListMessagesUseCase, ClearChatUseCase } from '../../../application/use-cases/chat.use-cases';
import { SendMessageDto, CreateChatDto } from '../dtos/chat.dto';
export declare class ChatController {
    private readonly listUseCase;
    private readonly sendUseCase;
    private readonly createUseCase;
    private readonly listMessagesUseCase;
    private readonly clearChatUseCase;
    constructor(listUseCase: ListChatsUseCase, sendUseCase: SendMessageUseCase, createUseCase: CreateChatUseCase, listMessagesUseCase: ListMessagesUseCase, clearChatUseCase: ClearChatUseCase);
    list(user: any): Promise<any[]>;
    create(user: any, body: CreateChatDto): Promise<{
        id: string;
        user_id: string;
        agent_id: string;
        title: string | null | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
    listMessages(chatId: string, user: any): Promise<{
        id: string;
        chat_id: string;
        content: string;
        sender: string;
        timestamp: Date;
    }[]>;
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
    clearChat(chatId: string, user: any): Promise<{
        message: string;
    }>;
}
