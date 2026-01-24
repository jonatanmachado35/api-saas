import { Repository } from '../../../../core/base-classes';
import { Subscription } from '../entities/subscription.entity';
export interface SubscriptionRepository extends Repository<Subscription> {
    findByUserId(userId: string): Promise<Subscription | null>;
    findAll(): Promise<Subscription[]>;
    findAllWithUsers(): Promise<any[]>;
}
