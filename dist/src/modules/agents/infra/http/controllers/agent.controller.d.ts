import { CreateAgentUseCase, UpdateAgentUseCase, ListAgentsUseCase, DeleteAgentUseCase } from '../../../application/use-cases/agent.use-cases';
import { CreateAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
export declare class AgentController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly listUseCase;
    private readonly deleteUseCase;
    private readonly prisma;
    constructor(createUseCase: CreateAgentUseCase, updateUseCase: UpdateAgentUseCase, listUseCase: ListAgentsUseCase, deleteUseCase: DeleteAgentUseCase, prisma: PrismaService);
    list(user: any): Promise<{
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
        visibility: import("../../../domain/entities/agent.entity").AgentVisibility | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }[]>;
    create(user: any, body: CreateAgentDto): Promise<{
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
        visibility: import("../../../domain/entities/agent.entity").AgentVisibility | undefined;
        created_at: Date;
    }>;
    update(user: any, agentId: string, body: UpdateAgentDto): Promise<{
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
            visibility: import("../../../domain/entities/agent.entity").AgentVisibility | undefined;
            created_at: Date | undefined;
            updated_at: Date;
        };
        success: boolean;
    }>;
    delete(agentId: string): Promise<{
        success: boolean;
    }>;
}
