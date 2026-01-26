import { AgentVisibility } from '../../../domain/entities/agent.entity';
export declare class CreateAgentDto {
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
