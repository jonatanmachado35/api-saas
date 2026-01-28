import { PrismaService } from '../../../prisma/prisma.service';
import { LlmRepository } from '../../domain/repositories/llm.repository.interface';
import { Llm } from '../../domain/entities/llm.entity';
export declare class PrismaLlmRepository implements LlmRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(llm: Llm): Promise<Llm>;
    findById(id: string): Promise<Llm | null>;
    findAll(activeOnly?: boolean): Promise<Llm[]>;
    update(llm: Llm): Promise<Llm>;
    delete(id: string): Promise<void>;
    private toDomain;
}
