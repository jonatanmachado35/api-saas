export declare enum PlanType {
    FREE = "free",
    PRO = "pro",
    CUSTOM = "custom"
}
export declare class UpgradePlanDto {
    plan: PlanType;
}
export declare class PurchaseCreditsDto {
    package_id: string;
    credits?: number;
}
