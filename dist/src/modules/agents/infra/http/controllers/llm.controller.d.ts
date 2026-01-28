import { ListLlmsUseCase, GetLlmByIdUseCase, CreateLlmUseCase, UpdateLlmUseCase, DeleteLlmUseCase } from '../../../application/use-cases/llm.use-cases';
export declare class CreateLlmDto {
    name: string;
    provider: string;
    model: string;
    maxTokens: number;
}
export declare class UpdateLlmDto {
    name?: string;
    provider?: string;
    model?: string;
    maxTokens?: number;
    active?: boolean;
}
export declare class LlmController {
    private readonly listLlmsUseCase;
    private readonly getLlmByIdUseCase;
    constructor(listLlmsUseCase: ListLlmsUseCase, getLlmByIdUseCase: GetLlmByIdUseCase);
    list(all?: string): Promise<import("../../../domain/entities/llm.entity").Llm[]>;
    getById(id: string): Promise<import("../../../domain/entities/llm.entity").Llm>;
}
export declare class AdminLlmController {
    private readonly listLlmsUseCase;
    private readonly getLlmByIdUseCase;
    private readonly createLlmUseCase;
    private readonly updateLlmUseCase;
    private readonly deleteLlmUseCase;
    constructor(listLlmsUseCase: ListLlmsUseCase, getLlmByIdUseCase: GetLlmByIdUseCase, createLlmUseCase: CreateLlmUseCase, updateLlmUseCase: UpdateLlmUseCase, deleteLlmUseCase: DeleteLlmUseCase);
    list(): Promise<import("../../../domain/entities/llm.entity").Llm[]>;
    getById(id: string): Promise<import("../../../domain/entities/llm.entity").Llm>;
    create(dto: CreateLlmDto): Promise<import("../../../domain/entities/llm.entity").Llm>;
    update(id: string, dto: UpdateLlmDto): Promise<import("../../../domain/entities/llm.entity").Llm>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
