import { Entity } from '../../../../core/base-classes';
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentType {
    SUBSCRIPTION = "SUBSCRIPTION",
    CREDITS = "CREDITS"
}
export declare enum PaymentFrequency {
    ONE_TIME = "ONE_TIME",
    MONTHLY = "MONTHLY"
}
export interface PaymentProps {
    userId: string;
    type: PaymentType;
    amount: number;
    description: string;
    status: PaymentStatus;
    frequency: PaymentFrequency;
    externalId?: string;
    paymentUrl?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Payment extends Entity<PaymentProps> {
    constructor(props: PaymentProps, id?: string);
    get userId(): string;
    get type(): PaymentType;
    get amount(): number;
    get description(): string;
    get status(): PaymentStatus;
    get frequency(): PaymentFrequency;
    get externalId(): string | undefined;
    get paymentUrl(): string | undefined;
    get metadata(): Record<string, any> | undefined;
    markAsPaid(externalId: string): void;
    markAsFailed(): void;
    cancel(): void;
}
