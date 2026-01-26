import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRole } from '../../domain/entities/user.entity';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
import { PrismaService } from '../../../prisma/prisma.service';
export interface RegisterUserInput {
    email: string;
    password: string;
    full_name: string;
}
export declare class RegisterUserUseCase {
    private readonly userRepository;
    private readonly hasher;
    private readonly jwtService;
    private readonly prisma;
    constructor(userRepository: UserRepository, hasher: BcryptHasher, jwtService: JwtService, prisma: PrismaService);
    execute(input: RegisterUserInput): Promise<{
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
}
