import { GetAdminStatsUseCase } from '../../../application/use-cases/admin-stats.use-case';
import { ListUsersUseCase, ChangeUserRoleUseCase } from '../../../application/use-cases/admin-user.use-cases';
import { ListAdminSubscriptionsUseCase, ListAllAgentsUseCase, CreateAdminSubscriptionUseCase, UpdateAdminSubscriptionUseCase, CreateAdminAgentUseCase, DeleteAdminAgentUseCase } from '../../../application/use-cases/admin-mgmt.use-cases';
import { ChangeUserRoleDto, CreateAdminSubscriptionDto, UpdateAdminSubscriptionDto, CreateAdminAgentDto } from '../dtos/admin.dto';
export declare class AdminController {
    private readonly statsUseCase;
    private readonly listUsersUseCase;
    private readonly changeRoleUseCase;
    private readonly listSubsUseCase;
    private readonly createSubUseCase;
    private readonly updateSubUseCase;
    private readonly listAgentsUseCase;
    private readonly createAgentUseCase;
    private readonly deleteAgentUseCase;
    constructor(statsUseCase: GetAdminStatsUseCase, listUsersUseCase: ListUsersUseCase, changeRoleUseCase: ChangeUserRoleUseCase, listSubsUseCase: ListAdminSubscriptionsUseCase, createSubUseCase: CreateAdminSubscriptionUseCase, updateSubUseCase: UpdateAdminSubscriptionUseCase, listAgentsUseCase: ListAllAgentsUseCase, createAgentUseCase: CreateAdminAgentUseCase, deleteAgentUseCase: DeleteAdminAgentUseCase);
    getStats(): Promise<{
        total_users: number;
        total_agents: number;
        total_subscriptions: number;
        pro_subscriptions: number;
    }>;
    listUsers(): Promise<{
        id: string;
        user_id: string;
        full_name: string | null;
        avatar_url: string | null;
        created_at: Date;
        role: string;
        plan: string | null;
        status: string | null;
        credits: number;
    }[]>;
    changeRole(userId: string, body: ChangeUserRoleDto): Promise<{
        success: boolean;
    }>;
    listSubscriptions(): Promise<{
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
    createSubscription(body: CreateAdminSubscriptionDto): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
    updateSubscription(subscriptionId: string, body: UpdateAdminSubscriptionDto): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
    listAgents(): Promise<{
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
    createAgent(body: CreateAdminAgentDto): Promise<{
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
    deleteAgent(agentId: string): Promise<{
        success: boolean;
    }>;
}
