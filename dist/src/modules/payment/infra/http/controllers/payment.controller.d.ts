import { CreateSubscriptionPaymentUseCase, CreateCreditsPaymentUseCase, GetPaymentUseCase, ListPaymentsUseCase } from '../../../application/use-cases/payment.use-cases';
import { ProcessPaymentWebhookUseCase } from '../../../application/use-cases/webhook.use-case';
import { CreateSubscriptionPaymentDto, CreateCreditsPaymentDto, WebhookDto } from '../dtos/payment.dto';
export declare class PaymentController {
    private readonly createSubscriptionPayment;
    private readonly createCreditsPayment;
    private readonly getPayment;
    private readonly listPayments;
    constructor(createSubscriptionPayment: CreateSubscriptionPaymentUseCase, createCreditsPayment: CreateCreditsPaymentUseCase, getPayment: GetPaymentUseCase, listPayments: ListPaymentsUseCase);
    createSubscriptionCheckout(req: any, body: CreateSubscriptionPaymentDto): Promise<{
        paymentId: string;
        externalId: string;
        paymentUrl: string;
        amount: number;
        status: string;
    }>;
    createCreditsCheckout(req: any, body: CreateCreditsPaymentDto): Promise<{
        paymentId: string;
        externalId: string;
        paymentUrl: string;
        amount: number;
        credits: number;
        status: string;
    }>;
    getPaymentById(req: any, id: string): Promise<{
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
    listUserPayments(req: any): Promise<{
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
export declare class WebhookController {
    private readonly processWebhook;
    constructor(processWebhook: ProcessPaymentWebhookUseCase);
    handleAbacatePayWebhook(body: WebhookDto): Promise<{
        success: boolean;
        paymentId: any;
    } | {
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
