import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
export interface GoogleLoginInput {
    google_token: string;
}
export declare class GoogleLoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    execute(input: GoogleLoginInput): Promise<{
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
    private verifyGoogleToken;
}
