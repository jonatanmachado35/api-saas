import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
export interface LoginInput {
    email: string;
    password: string;
}
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly hasher;
    private readonly jwtService;
    private readonly prisma;
    constructor(userRepository: UserRepository, hasher: BcryptHasher, jwtService: JwtService, prisma: PrismaService);
    execute(input: LoginInput): Promise<{
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
        token: string;
    }>;
}
