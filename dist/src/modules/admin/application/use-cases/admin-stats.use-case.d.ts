import { PrismaService } from '../../../prisma/prisma.service';
export declare class GetAdminStatsUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(): Promise<{
        total_users: number;
        total_agents: number;
        total_subscriptions: number;
        pro_subscriptions: number;
    }>;
}
