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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentsUseCase = exports.GetPaymentUseCase = exports.CreateCreditsPaymentUseCase = exports.CreateSubscriptionPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const abacatepay_service_1 = require("../../infra/services/abacatepay.service");
const PLAN_PRICES = {
    pro: 4990,
};
const CREDIT_PACKAGES_PRICES = {
    starter: { price: 990, credits: 100, bonus: 0 },
    popular: { price: 3990, credits: 500, bonus: 50 },
    pro: { price: 6990, credits: 1000, bonus: 150 },
    enterprise: { price: 29990, credits: 5000, bonus: 1000 },
};
let CreateSubscriptionPaymentUseCase = class CreateSubscriptionPaymentUseCase {
    paymentRepository;
    abacatePayService;
    constructor(paymentRepository, abacatePayService) {
        this.paymentRepository = paymentRepository;
        this.abacatePayService = abacatePayService;
    }
    async execute(input) {
        const planLower = input.plan.toLowerCase();
        if (!PLAN_PRICES[planLower]) {
            throw new common_1.BadRequestException('Invalid plan');
        }
        const price = PLAN_PRICES[planLower];
        const payment = new payment_entity_1.Payment({
            userId: input.userId,
            type: payment_entity_1.PaymentType.SUBSCRIPTION,
            amount: price,
            description: `Assinatura ${input.plan.toUpperCase()} - Mensal`,
            status: payment_entity_1.PaymentStatus.PENDING,
            frequency: payment_entity_1.PaymentFrequency.MONTHLY,
            metadata: {
                plan: input.plan,
                email: input.email,
            },
        });
        await this.paymentRepository.save(payment);
        const billingResponse = await this.abacatePayService.createBilling({
            frequency: 'MONTHLY',
            methods: ['PIX', 'CARD'],
            products: [
                {
                    externalId: payment.id,
                    name: `Plano ${input.plan.toUpperCase()}`,
                    description: 'Assinatura mensal AgentChat',
                    quantity: 1,
                    price,
                },
            ],
            returnUrl: input.returnUrl,
            completionUrl: input.returnUrl,
            metadata: {
                paymentId: payment.id,
                userId: input.userId,
                email: input.email,
                type: 'subscription',
                plan: input.plan,
            },
        });
        if (billingResponse.error) {
            throw new common_1.BadRequestException('Failed to create payment');
        }
        payment.props.externalId = billingResponse.data.id;
        payment.props.paymentUrl = billingResponse.data.url;
        await this.paymentRepository.save(payment);
        return {
            paymentId: payment.id,
            externalId: billingResponse.data.id,
            paymentUrl: billingResponse.data.url,
            amount: price,
            status: 'pending',
        };
    }
};
exports.CreateSubscriptionPaymentUseCase = CreateSubscriptionPaymentUseCase;
exports.CreateSubscriptionPaymentUseCase = CreateSubscriptionPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [Object, abacatepay_service_1.AbacatePayService])
], CreateSubscriptionPaymentUseCase);
let CreateCreditsPaymentUseCase = class CreateCreditsPaymentUseCase {
    paymentRepository;
    abacatePayService;
    constructor(paymentRepository, abacatePayService) {
        this.paymentRepository = paymentRepository;
        this.abacatePayService = abacatePayService;
    }
    async execute(input) {
        const packageData = CREDIT_PACKAGES_PRICES[input.packageId];
        if (!packageData) {
            throw new common_1.BadRequestException('Invalid package');
        }
        const totalCredits = packageData.credits + packageData.bonus;
        const payment = new payment_entity_1.Payment({
            userId: input.userId,
            type: payment_entity_1.PaymentType.CREDITS,
            amount: packageData.price,
            description: `Compra de ${totalCredits} créditos (pacote ${input.packageId})`,
            status: payment_entity_1.PaymentStatus.PENDING,
            frequency: payment_entity_1.PaymentFrequency.ONE_TIME,
            metadata: {
                packageId: input.packageId,
                credits: packageData.credits,
                bonus: packageData.bonus,
                totalCredits,
                email: input.email,
            },
        });
        await this.paymentRepository.save(payment);
        const billingResponse = await this.abacatePayService.createBilling({
            frequency: 'ONE_TIME',
            methods: ['PIX', 'CARD'],
            products: [
                {
                    externalId: payment.id,
                    name: `Pacote ${input.packageId.toUpperCase()}`,
                    description: `${totalCredits} créditos (${packageData.credits} + ${packageData.bonus} bônus)`,
                    quantity: 1,
                    price: packageData.price,
                },
            ],
            returnUrl: input.returnUrl,
            completionUrl: input.returnUrl,
            metadata: {
                paymentId: payment.id,
                userId: input.userId,
                email: input.email,
                type: 'credits',
                packageId: input.packageId,
                credits: packageData.credits,
                bonus: packageData.bonus,
            },
        });
        if (billingResponse.error) {
            throw new common_1.BadRequestException('Failed to create payment');
        }
        payment.props.externalId = billingResponse.data.id;
        payment.props.paymentUrl = billingResponse.data.url;
        await this.paymentRepository.save(payment);
        return {
            paymentId: payment.id,
            externalId: billingResponse.data.id,
            paymentUrl: billingResponse.data.url,
            amount: packageData.price,
            credits: totalCredits,
            status: 'pending',
        };
    }
};
exports.CreateCreditsPaymentUseCase = CreateCreditsPaymentUseCase;
exports.CreateCreditsPaymentUseCase = CreateCreditsPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [Object, abacatepay_service_1.AbacatePayService])
], CreateCreditsPaymentUseCase);
let GetPaymentUseCase = class GetPaymentUseCase {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(paymentId, userId) {
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        return {
            id: payment.id,
            type: payment.type.toLowerCase(),
            amount: payment.amount,
            description: payment.description,
            status: payment.status.toLowerCase(),
            frequency: payment.frequency.toLowerCase(),
            paymentUrl: payment.paymentUrl,
            metadata: payment.metadata,
            createdAt: payment.props.createdAt,
        };
    }
};
exports.GetPaymentUseCase = GetPaymentUseCase;
exports.GetPaymentUseCase = GetPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [Object])
], GetPaymentUseCase);
let ListPaymentsUseCase = class ListPaymentsUseCase {
    paymentRepository;
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async execute(userId) {
        const payments = await this.paymentRepository.findByUserId(userId);
        return payments.map((p) => ({
            id: p.id,
            type: p.type.toLowerCase(),
            amount: p.amount,
            description: p.description,
            status: p.status.toLowerCase(),
            frequency: p.frequency.toLowerCase(),
            paymentUrl: p.paymentUrl,
            createdAt: p.props.createdAt,
        }));
    }
};
exports.ListPaymentsUseCase = ListPaymentsUseCase;
exports.ListPaymentsUseCase = ListPaymentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __metadata("design:paramtypes", [Object])
], ListPaymentsUseCase);
//# sourceMappingURL=payment.use-cases.js.map