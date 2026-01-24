import { SubscriptionRepository } from '../../domain/repositories/subscription.repository.interface';
import { Subscription } from '../../domain/entities/subscription.entity';
export declare class GetSubscriptionUseCase {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    execute(userId: string): Promise<{
        id: string;
        user_id: string;
        plan: string;
        status: string;
        credits: number;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    } | null>;
}
export declare class UpgradePlanUseCase {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    execute(userId: string, plan: string): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
}
export declare class DowngradePlanUseCase {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    execute(userId: string): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
}
export declare class PurchaseCreditsUseCase {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    execute(userId: string, packageId: string): Promise<{
        success: boolean;
        total_credits: number;
    }>;
}
export declare class CreateSubscriptionUseCase {
    private readonly subscriptionRepository;
    constructor(subscriptionRepository: SubscriptionRepository);
    execute(userId: string, plan?: string, credits?: number): Promise<Subscription>;
}
