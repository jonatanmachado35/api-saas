import { ConfigService } from '@nestjs/config';
export interface AbacatePayBillingRequest {
    frequency: 'ONE_TIME' | 'MONTHLY';
    methods: string[];
    products: Array<{
        externalId: string;
        name: string;
        description?: string;
        quantity: number;
        price: number;
    }>;
    returnUrl?: string;
    completionUrl?: string;
    metadata?: Record<string, any>;
}
export interface AbacatePayBillingResponse {
    data: {
        id: string;
        url: string;
        amount: number;
        status: string;
        devMode: boolean;
        methods: string[];
        frequency: string;
        nextBilling: string | null;
        customer: {
            id: string;
            metadata: Record<string, any>;
        };
        createdAt: string;
        updatedAt: string;
    };
    error: any;
}
export interface AbacatePayWebhookPayload {
    id: string;
    status: string;
    amount: number;
    frequency: string;
    metadata?: Record<string, any>;
}
export declare class AbacatePayService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    createBilling(request: AbacatePayBillingRequest): Promise<AbacatePayBillingResponse>;
    getBilling(billingId: string): Promise<AbacatePayBillingResponse>;
    cancelBilling(billingId: string): Promise<void>;
}
