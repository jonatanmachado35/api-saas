import { Llm } from '../entities/llm.entity';
export declare abstract class LlmRepository {
    abstract create(llm: Llm): Promise<Llm>;
    abstract findById(id: string): Promise<Llm | null>;
    abstract findAll(activeOnly?: boolean): Promise<Llm[]>;
    abstract update(llm: Llm): Promise<Llm>;
    abstract delete(id: string): Promise<void>;
}
