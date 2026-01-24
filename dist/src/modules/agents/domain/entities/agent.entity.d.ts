import { Entity } from '../../../../core/base-classes';
export interface AgentProps {
    userId: string;
    name: string;
    avatar?: string | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Agent extends Entity<AgentProps> {
    constructor(props: AgentProps, id?: string);
    get userId(): string;
    get name(): string;
    get avatar(): string | null | undefined;
    get description(): string | null | undefined;
}
