import { PrismaService } from '../../../prisma/prisma.service';
export declare class ListUsersUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(): Promise<{
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
}
export declare class ChangeUserRoleUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(userId: string, role: string): Promise<void>;
}
