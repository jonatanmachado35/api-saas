import { UserRepository } from '../../../domain/repositories/user.repository.interface';
export declare class RoleController {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getRole(userId: string): Promise<{
        role: string | null;
    }>;
}
