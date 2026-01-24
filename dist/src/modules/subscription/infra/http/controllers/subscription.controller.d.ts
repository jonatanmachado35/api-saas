import { GetSubscriptionUseCase, UpgradePlanUseCase, DowngradePlanUseCase, PurchaseCreditsUseCase } from '../../../application/use-cases/subscription.use-cases';
import { UpgradePlanDto, PurchaseCreditsDto } from '../dtos/subscription.dto';
export declare class SubscriptionController {
    private readonly getSubscriptionUseCase;
    private readonly upgradePlanUseCase;
    private readonly downgradePlanUseCase;
    private readonly purchaseCreditsUseCase;
    constructor(getSubscriptionUseCase: GetSubscriptionUseCase, upgradePlanUseCase: UpgradePlanUseCase, downgradePlanUseCase: DowngradePlanUseCase, purchaseCreditsUseCase: PurchaseCreditsUseCase);
    getByUserId(userId: string): Promise<{
        id: string;
        user_id: string;
        plan: string;
        status: string;
        credits: number;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    } | null>;
    upgrade(req: any, body: UpgradePlanDto): Promise<{
        subscription: {
            id: string;
            user_id: string;
            plan: string;
            status: string;
            credits: number;
        };
        success: boolean;
    }>;
    downgrade(req: any): Promise<{
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
export declare class CreditsController {
    private readonly purchaseCreditsUseCase;
    constructor(purchaseCreditsUseCase: PurchaseCreditsUseCase);
    purchase(req: any, body: PurchaseCreditsDto): Promise<{
        success: boolean;
        total_credits: number;
    }>;
}
