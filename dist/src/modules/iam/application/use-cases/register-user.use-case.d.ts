import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
export interface RegisterUserInput {
    email: string;
    password: string;
    full_name: string;
}
export declare class RegisterUserUseCase {
    private readonly userRepository;
    private readonly hasher;
    private readonly jwtService;
    constructor(userRepository: UserRepository, hasher: BcryptHasher, jwtService: JwtService);
    execute(input: RegisterUserInput): Promise<{
        user: User;
        token: string;
    }>;
}
