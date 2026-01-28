import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AbacatePayService {
  private readonly logger = new Logger(AbacatePayService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ABACATEPAY_API_KEY', 'sk-p5dY6E8s2aewrwaMGRs57dAnxrBZk');
    this.baseUrl = this.configService.get<string>('ABACATEPAY_BASE_URL', 'https://api.abacatepay.com/v1');
  }

  async createBilling(request: AbacatePayBillingRequest): Promise<AbacatePayBillingResponse> {
    try {
      this.logger.log(`Creating billing: ${JSON.stringify(request)}`);

      const response = await fetch(`${this.baseUrl}/billing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`AbacatePay API error: ${response.status} - ${errorText}`);
        throw new Error(`AbacatePay API error: ${response.status}`);
      }

      const data: AbacatePayBillingResponse = await response.json();
      
      this.logger.log(`Billing created successfully: ${data.data?.id}`);

      return data;
    } catch (error) {
      this.logger.error(`Error creating billing: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getBilling(billingId: string): Promise<AbacatePayBillingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/billing/${billingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`AbacatePay API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Error getting billing: ${error.message}`);
      throw error;
    }
  }

  async cancelBilling(billingId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/billing/${billingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`AbacatePay API error: ${response.status}`);
      }

      this.logger.log(`Billing canceled: ${billingId}`);
    } catch (error) {
      this.logger.error(`Error canceling billing: ${error.message}`);
      throw error;
    }
  }
}
