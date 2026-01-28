import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { SubscriptionRepository } from '../../../subscription/domain/repositories/subscription.repository.interface';
export interface WebhookPayload {
    id: string;
    status: string;
    amount: number;
    frequency: string;
    metadata?: Record<string, any>;
}
export declare class ProcessPaymentWebhookUseCase {
    private readonly paymentRepository;
    private readonly subscriptionRepository;
    private readonly logger;
    constructor(paymentRepository: PaymentRepository, subscriptionRepository: SubscriptionRepository);
    execute(payload: WebhookPayload): Promise<{
        success: boolean;
        paymentId: any;
    } | {
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    private handlePaidPayment;
    private handleSubscriptionPayment;
    private handleCreditsPayment;
    private handleDisputedPayment;
    private revertSubscription;
    private revertCredits;
}
