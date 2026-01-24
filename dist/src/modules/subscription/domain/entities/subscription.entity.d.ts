import { Entity } from '../../../../core/base-classes';
export declare enum SubscriptionPlan {
    FREE = "FREE",
    PRO = "PRO",
    CUSTOM = "CUSTOM"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    CANCELED = "CANCELED",
    PENDING = "PENDING"
}
export interface SubscriptionProps {
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    credits: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Subscription extends Entity<SubscriptionProps> {
    constructor(props: SubscriptionProps, id?: string);
    get userId(): string;
    get plan(): SubscriptionPlan;
    get status(): SubscriptionStatus;
    get credits(): number;
}
