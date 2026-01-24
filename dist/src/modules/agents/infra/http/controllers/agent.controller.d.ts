import { CreateAgentUseCase, UpdateAgentUseCase, ListAgentsUseCase, DeleteAgentUseCase } from '../../../application/use-cases/agent.use-cases';
import { CreateAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
export declare class AgentController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly listUseCase;
    private readonly deleteUseCase;
    constructor(createUseCase: CreateAgentUseCase, updateUseCase: UpdateAgentUseCase, listUseCase: ListAgentsUseCase, deleteUseCase: DeleteAgentUseCase);
    list(userId: string): Promise<{
        id: string;
        user_id: string;
        name: string;
        avatar: string | null | undefined;
        description: string | null | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }[]>;
    create(body: CreateAgentDto): Promise<{
        id: string;
        user_id: string;
        name: string;
        avatar: string | null | undefined;
        description: string | null | undefined;
        created_at: Date;
    }>;
    update(agentId: string, body: UpdateAgentDto): Promise<{
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
    delete(agentId: string): Promise<{
        success: boolean;
    }>;
}
