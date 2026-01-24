import { PrismaService } from '../../../prisma/prisma.service';
export declare class ListAdminSubscriptionsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(): Promise<{
        subscriptions: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
            owner_name: string | null;
            owner_email: string;
            created_at: Date;
        }[];
        users_without_subscription: {
            user_id: string;
            full_name: string | null;
        }[];
    }>;
}
export interface CreateAdminSubscriptionInput {
    user_id: string;
    plan: string;
    status?: string;
    credits?: number;
}
export declare class CreateAdminSubscriptionUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(input: CreateAdminSubscriptionInput): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
}
export interface UpdateAdminSubscriptionInput {
    plan?: string;
    status?: string;
    credits?: number;
}
export declare class UpdateAdminSubscriptionUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(subscriptionId: string, input: UpdateAdminSubscriptionInput): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
}
export declare class ListAllAgentsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(): Promise<{
        agents: {
            id: string;
            user_id: string;
            name: string;
            avatar: string | null;
            description: string | null;
            owner_name: string | null;
            created_at: Date;
        }[];
        users: {
            user_id: string;
            full_name: string | null;
        }[];
    }>;
}
export interface CreateAdminAgentInput {
    user_id: string;
    name: string;
    avatar?: string;
    description?: string;
}
export declare class CreateAdminAgentUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(input: CreateAdminAgentInput): Promise<{
        agent: {
            id: string;
            user_id: string;
            name: string;
            avatar: string | null;
            description: string | null;
            created_at: Date;
        };
        success: boolean;
    }>;
}
export declare class DeleteAdminAgentUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(agentId: string): Promise<{
        success: boolean;
    }>;
}
