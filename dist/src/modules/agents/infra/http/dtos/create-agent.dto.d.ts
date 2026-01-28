import { AgentVisibility } from '../../../domain/entities/agent.entity';
export declare class CreateAgentDto {
    user_id?: string;
    llmId?: string;
    name: string;
    avatar?: string;
    description?: string;
    prompt?: string;
    category?: string;
    type?: string;
    tone?: string;
    style?: string;
    focus?: string;
    rules?: string;
    visibility?: AgentVisibility;
}
