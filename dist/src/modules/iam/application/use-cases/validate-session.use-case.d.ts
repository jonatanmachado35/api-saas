import { UserRepository } from '../../domain/repositories/user.repository.interface';
export declare class ValidateSessionUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
    }>;
}
