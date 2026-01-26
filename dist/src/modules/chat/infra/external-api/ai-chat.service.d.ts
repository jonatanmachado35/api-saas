import { ConfigService } from '@nestjs/config';
export interface AgentPersona {
    tone: string;
    style: string;
    focus: string;
}
export interface AgentConfig {
    type: string;
    persona: AgentPersona;
    rules: string[];
}
export interface ChatRequest {
    message: string;
    agent: AgentConfig;
}
export declare class AiChatService {
    private configService;
    private readonly aiApiUrl;
    constructor(configService: ConfigService);
    sendMessage(request: ChatRequest): Promise<any>;
}
