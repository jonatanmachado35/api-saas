import { AgentRepository } from '../../domain/repositories/agent.repository.interface';
export interface CreateAgentInput {
    user_id: string;
    name: string;
    avatar?: string;
    description?: string;
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
        created_at: Date;
    }>;
}
export interface UpdateAgentInput {
    name?: string;
    avatar?: string;
    description?: string;
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
            created_at: Date | undefined;
            updated_at: Date;
        };
        success: boolean;
    }>;
}
export declare class ListAgentsUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(userId: string): Promise<{
        id: string;
        user_id: string;
        name: string;
        avatar: string | null | undefined;
        description: string | null | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }[]>;
}
export declare class DeleteAgentUseCase {
    private readonly agentRepository;
    constructor(agentRepository: AgentRepository);
    execute(id: string): Promise<void>;
}
