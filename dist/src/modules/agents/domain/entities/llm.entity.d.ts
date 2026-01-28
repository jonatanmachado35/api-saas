import { Entity } from '../../../../core/base-classes';
export interface LlmProps {
    name: string;
    provider: string;
    model: string;
    maxTokens: number;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Llm extends Entity<LlmProps> {
    constructor(props: LlmProps, id?: string);
    get name(): string;
    get provider(): string;
    get model(): string;
    get maxTokens(): number;
    get active(): boolean;
    get createdAt(): Date | undefined;
    get updatedAt(): Date | undefined;
    activate(): void;
    deactivate(): void;
    updateMaxTokens(maxTokens: number): void;
    updateName(name: string): void;
}
