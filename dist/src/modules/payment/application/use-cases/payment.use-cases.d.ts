import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { AbacatePayService } from '../../infra/services/abacatepay.service';
export interface CreateSubscriptionPaymentInput {
    userId: string;
    plan: string;
    email: string;
    returnUrl?: string;
}
export declare class CreateSubscriptionPaymentUseCase {
    private readonly paymentRepository;
    private readonly abacatePayService;
    constructor(paymentRepository: PaymentRepository, abacatePayService: AbacatePayService);
    execute(input: CreateSubscriptionPaymentInput): Promise<{
        paymentId: string;
        externalId: string;
        paymentUrl: string;
        amount: number;
        status: string;
    }>;
}
export interface CreateCreditsPaymentInput {
    userId: string;
    packageId: string;
    email: string;
    returnUrl?: string;
}
export declare class CreateCreditsPaymentUseCase {
    private readonly paymentRepository;
    private readonly abacatePayService;
    constructor(paymentRepository: PaymentRepository, abacatePayService: AbacatePayService);
    execute(input: CreateCreditsPaymentInput): Promise<{
        paymentId: string;
        externalId: string;
        paymentUrl: string;
        amount: number;
        credits: number;
        status: string;
    }>;
}
export declare class GetPaymentUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(paymentId: string, userId: string): Promise<{
        id: string;
        type: string;
        amount: number;
        description: string;
        status: string;
        frequency: string;
        paymentUrl: string | undefined;
        metadata: Record<string, any> | undefined;
        createdAt: Date | undefined;
    }>;
}
export declare class ListPaymentsUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    execute(userId: string): Promise<{
        id: string;
        type: string;
        amount: number;
        description: string;
        status: string;
        frequency: string;
        paymentUrl: string | undefined;
        createdAt: Date | undefined;
    }[]>;
}
