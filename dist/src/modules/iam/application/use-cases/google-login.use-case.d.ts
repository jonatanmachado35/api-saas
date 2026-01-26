import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRole } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';
export interface GoogleLoginInput {
    google_token: string;
}
export declare class GoogleLoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    private readonly prisma;
    constructor(userRepository: UserRepository, jwtService: JwtService, prisma: PrismaService);
    execute(input: GoogleLoginInput): Promise<{
        user: {
            id: string;
            email: string;
            role: UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
        token: string;
    }>;
    private verifyGoogleToken;
}
