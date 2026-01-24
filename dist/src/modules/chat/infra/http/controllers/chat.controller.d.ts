import { ListChatsUseCase, SendMessageUseCase } from '../../../application/use-cases/chat.use-cases';
import { SendMessageDto } from '../dtos/chat.dto';
export declare class ChatController {
    private readonly listUseCase;
    private readonly sendUseCase;
    constructor(listUseCase: ListChatsUseCase, sendUseCase: SendMessageUseCase);
    list(userId: string): Promise<any[]>;
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
