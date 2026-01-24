import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
