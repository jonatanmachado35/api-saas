import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRole } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';
export interface GitHubLoginInput {
    github_token: string;
}
export declare class GitHubLoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    private readonly prisma;
    constructor(userRepository: UserRepository, jwtService: JwtService, prisma: PrismaService);
    execute(input: GitHubLoginInput): Promise<{
        user: {
            id: string;
            email: string;
            full_name: string | null | undefined;
            avatar_url: string | null | undefined;
            role: UserRole;
            plan: import(".prisma/client").$Enums.Plan;
        };
        token: string;
    }>;
    private verifyGitHubToken;
}
