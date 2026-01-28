export declare enum PaymentPlanType {
    PRO = "pro"
}
export declare enum CreditPackageType {
    STARTER = "starter",
    POPULAR = "popular",
    PRO = "pro",
    ENTERPRISE = "enterprise"
}
export declare class CreateSubscriptionPaymentDto {
    plan: PaymentPlanType;
    returnUrl?: string;
}
export declare class CreateCreditsPaymentDto {
    packageId: CreditPackageType;
    returnUrl?: string;
}
export declare class WebhookDto {
    id: string;
    status: string;
    amount: number;
    frequency: string;
    metadata?: Record<string, any>;
}
