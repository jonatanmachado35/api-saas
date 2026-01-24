import { PrismaService } from '../../../prisma/prisma.service';
import { Agent } from '../../domain/entities/agent.entity';
import { AgentRepository } from '../../domain/repositories/agent.repository.interface';
export declare class PrismaAgentRepository implements AgentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(agent: Agent): Promise<void>;
    findById(id: string): Promise<Agent | null>;
    findByUserId(userId: string): Promise<Agent[]>;
    delete(id: string): Promise<void>;
}
