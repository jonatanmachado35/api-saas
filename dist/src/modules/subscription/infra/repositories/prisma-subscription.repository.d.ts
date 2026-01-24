import { PrismaService } from '../../../prisma/prisma.service';
import { Subscription } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository.interface';
export declare class PrismaSubscriptionRepository implements SubscriptionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(subscription: Subscription): Promise<void>;
    findById(id: string): Promise<Subscription | null>;
    findByUserId(userId: string): Promise<Subscription | null>;
    findAll(): Promise<Subscription[]>;
    findAllWithUsers(): Promise<any[]>;
}
