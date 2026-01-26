import { Entity } from '../../../../core/base-classes';
export declare enum AgentVisibility {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    PRO_ONLY = "PRO_ONLY",
    CUSTOM_ONLY = "CUSTOM_ONLY",
    ADMIN_ONLY = "ADMIN_ONLY"
}
export interface AgentProps {
    userId: string;
    name: string;
    avatar?: string | null;
    description?: string | null;
    prompt?: string | null;
    category?: string | null;
    type?: string | null;
    tone?: string | null;
    style?: string | null;
    focus?: string | null;
    rules?: string | null;
    visibility?: AgentVisibility;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Agent extends Entity<AgentProps> {
    constructor(props: AgentProps, id?: string);
    get userId(): string;
    get name(): string;
    get avatar(): string | null | undefined;
    get description(): string | null | undefined;
    get prompt(): string | null | undefined;
    get category(): string | null | undefined;
    get type(): string | null | undefined;
    get tone(): string | null | undefined;
    get style(): string | null | undefined;
    get focus(): string | null | undefined;
    get rules(): string | null | undefined;
    get visibility(): AgentVisibility | undefined;
}
