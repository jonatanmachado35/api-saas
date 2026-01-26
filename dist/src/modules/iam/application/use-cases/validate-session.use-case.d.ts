import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class ValidateSessionUseCase {
    private readonly userRepository;
    private readonly prisma;
    constructor(userRepository: UserRepository, prisma: PrismaService);
    execute(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../domain/entities/user.entity").UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
    }>;
}
