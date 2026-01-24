import { UserRepository } from '../../domain/repositories/user.repository.interface';
export declare class GetProfileUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<{
        id: string;
        user_id: string;
        full_name: string | null | undefined;
        avatar_url: string | null | undefined;
        email: string;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
}
export interface UpdateProfileInput {
    full_name?: string;
    avatar_url?: string;
}
export declare class UpdateProfileUseCase {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string, input: UpdateProfileInput): Promise<{
        success: boolean;
        profile: {
            id: string;
            user_id: string;
            full_name: string | null | undefined;
            avatar_url: string | null | undefined;
            email: string;
            created_at: Date | undefined;
            updated_at: Date;
        };
    }>;
}
