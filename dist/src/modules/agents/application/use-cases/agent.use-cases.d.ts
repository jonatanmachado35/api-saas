import { AgentRepository } from '../../domain/repositories/agent.repository.interface';
import { AgentVisibility } from '../../domain/entities/agent.entity';
export interface CreateAgentInput {
    user_id: string;
    user_role?: string;
    user_plan?: string;
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
export declare class CreateAgentUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(input: CreateAgentInput): Promise<{
        id: string;
        user_id: string;
        name: string;
        avatar: string | null | undefined;
        description: string | null | undefined;
        prompt: string | null | undefined;
        category: string | null | undefined;
        type: string | null | undefined;
        tone: string | null | undefined;
        style: string | null | undefined;
        focus: string | null | undefined;
        rules: string | null | undefined;
        visibility: AgentVisibility | undefined;
        created_at: Date;
    }>;
}
export interface UpdateAgentInput {
    user_role?: string;
    name?: string;
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
export declare class UpdateAgentUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(agentId: string, input: UpdateAgentInput): Promise<{
        agent: {
            id: string;
            user_id: string;
            name: string;
            avatar: string | null | undefined;
            description: string | null | undefined;
            prompt: string | null | undefined;
            category: string | null | undefined;
            type: string | null | undefined;
            tone: string | null | undefined;
            style: string | null | undefined;
            focus: string | null | undefined;
            rules: string | null | undefined;
            visibility: AgentVisibility | undefined;
            created_at: Date | undefined;
            updated_at: Date;
        };
        success: boolean;
    }>;
}
export declare class ListAgentsUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(userId: string, userRole: string, userPlan: string): Promise<{
        id: string;
        user_id: string;
        name: string;
        avatar: string | null | undefined;
        description: string | null | undefined;
        prompt: string | null | undefined;
        category: string | null | undefined;
        type: string | null | undefined;
        tone: string | null | undefined;
        style: string | null | undefined;
        focus: string | null | undefined;
        rules: string | null | undefined;
        visibility: AgentVisibility | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }[]>;
}
export declare class DeleteAgentUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(id: string): Promise<void>;
}
