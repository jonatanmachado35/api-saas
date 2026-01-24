import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
import { JwtService } from '@nestjs/jwt';
export interface LoginInput {
    email: string;
    password: string;
}
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly hasher;
    private readonly jwtService;
    constructor(userRepository: UserRepository, hasher: BcryptHasher, jwtService: JwtService);
    execute(input: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
        token: string;
    }>;
}
