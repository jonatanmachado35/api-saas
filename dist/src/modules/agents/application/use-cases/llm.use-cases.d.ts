import { LlmRepository } from '../../domain/repositories/llm.repository.interface';
import { Llm } from '../../domain/entities/llm.entity';
export interface ListLlmsInput {
    activeOnly?: boolean;
}
export declare class ListLlmsUseCase {
    private readonly llmRepository;
    constructor(llmRepository: LlmRepository);
    execute(input?: ListLlmsInput): Promise<Llm[]>;
}
export interface GetLlmByIdInput {
    id: string;
}
export declare class GetLlmByIdUseCase {
    private readonly llmRepository;
    constructor(llmRepository: LlmRepository);
    execute(input: GetLlmByIdInput): Promise<Llm>;
}
export interface CreateLlmInput {
    name: string;
    provider: string;
    model: string;
    maxTokens: number;
    creditCost: number;
}
export declare class CreateLlmUseCase {
    private readonly llmRepository;
    constructor(llmRepository: LlmRepository);
    execute(input: CreateLlmInput): Promise<Llm>;
}
export interface UpdateLlmInput {
    id: string;
    name?: string;
    provider?: string;
    model?: string;
    maxTokens?: number;
    creditCost?: number;
    active?: boolean;
}
export declare class UpdateLlmUseCase {
    private readonly llmRepository;
    constructor(llmRepository: LlmRepository);
    execute(input: UpdateLlmInput): Promise<Llm>;
}
export interface DeleteLlmInput {
    id: string;
}
export declare class DeleteLlmUseCase {
    private readonly llmRepository;
    constructor(llmRepository: LlmRepository);
    execute(input: DeleteLlmInput): Promise<void>;
}
