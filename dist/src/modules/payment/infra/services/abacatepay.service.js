"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AbacatePayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbacatePayService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AbacatePayService = AbacatePayService_1 = class AbacatePayService {
    configService;
    logger = new common_1.Logger(AbacatePayService_1.name);
    apiKey;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('ABACATEPAY_API_KEY', 'sk-p5dY6E8s2aewrwaMGRs57dAnxrBZk');
        this.baseUrl = this.configService.get('ABACATEPAY_BASE_URL', 'https://api.abacatepay.com/v1');
    }
    async createBilling(request) {
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
            const data = await response.json();
            this.logger.log(`Billing created successfully: ${data.data?.id}`);
            return data;
        }
        catch (error) {
            this.logger.error(`Error creating billing: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getBilling(billingId) {
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
        }
        catch (error) {
            this.logger.error(`Error getting billing: ${error.message}`);
            throw error;
        }
    }
    async cancelBilling(billingId) {
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
        }
        catch (error) {
            this.logger.error(`Error canceling billing: ${error.message}`);
            throw error;
        }
    }
};
exports.AbacatePayService = AbacatePayService;
exports.AbacatePayService = AbacatePayService = AbacatePayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AbacatePayService);
//# sourceMappingURL=abacatepay.service.js.map