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
var ProcessPaymentWebhookUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const subscription_entity_1 = require("../../../subscription/domain/entities/subscription.entity");
const payment_entity_1 = require("../../domain/entities/payment.entity");
let ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase_1 = class ProcessPaymentWebhookUseCase {
    paymentRepository;
    subscriptionRepository;
    logger = new common_1.Logger(ProcessPaymentWebhookUseCase_1.name);
    constructor(paymentRepository, subscriptionRepository) {
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(payload) {
        this.logger.log(`Processing webhook for billing: ${payload.id}`);
        const payment = await this.paymentRepository.findByExternalId(payload.id);
        if (!payment) {
            this.logger.warn(`Payment not found for external_id: ${payload.id}`);
            throw new common_1.BadRequestException('Payment not found');
        }
        if (payment.status === payment_entity_1.PaymentStatus.PAID) {
            this.logger.log(`Payment already processed: ${payment.id}`);
            return { success: true, message: 'Already processed' };
        }
        const status = payload.status.toUpperCase();
        if (status === 'PAID' || status === 'COMPLETED') {
            return await this.handlePaidPayment(payment, payload);
        }
        if (status === 'FAILED' || status === 'CANCELED') {
            payment.markAsFailed();
            await this.paymentRepository.save(payment);
            this.logger.log(`Payment marked as failed: ${payment.id}`);
        }
        return { success: true };
    }
    async handlePaidPayment(payment, payload) {
        this.logger.log(`Processing paid payment: ${payment.id} - Type: ${payment.type}`);
        payment.markAsPaid(payload.id);
        await this.paymentRepository.save(payment);
        const metadata = payment.metadata || {};
        if (payment.type === 'SUBSCRIPTION') {
            await this.handleSubscriptionPayment(payment.userId, metadata);
        }
        if (payment.type === 'CREDITS') {
            await this.handleCreditsPayment(payment.userId, metadata);
        }
        this.logger.log(`Payment processed successfully: ${payment.id}`);
        return { success: true, paymentId: payment.id };
    }
    async handleSubscriptionPayment(userId, metadata) {
        const plan = (metadata.plan?.toUpperCase() || 'PRO');
        let subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            subscription = new subscription_entity_1.Subscription({
                userId,
                plan,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                credits: plan === subscription_entity_1.SubscriptionPlan.PRO ? 500 : 50,
            });
        }
        else {
            subscription = new subscription_entity_1.Subscription({
                ...subscription.props,
                plan,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            }, subscription.id);
        }
        await this.subscriptionRepository.save(subscription);
        this.logger.log(`Subscription updated for user ${userId}: ${plan}`);
    }
    async handleCreditsPayment(userId, metadata) {
        const subscription = await this.subscriptionRepository.findByUserId(userId);
        if (!subscription) {
            this.logger.warn(`Subscription not found for user: ${userId}`);
            return;
        }
        const credits = metadata.credits || 0;
        const bonus = metadata.bonus || 0;
        const totalCredits = credits + bonus;
        const updatedSubscription = new subscription_entity_1.Subscription({
            ...subscription.props,
            credits: subscription.credits + totalCredits,
        }, subscription.id);
        await this.subscriptionRepository.save(updatedSubscription);
        this.logger.log(`Added ${totalCredits} credits to user ${userId}`);
    }
};
exports.ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase;
exports.ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase = ProcessPaymentWebhookUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PaymentRepository')),
    __param(1, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ProcessPaymentWebhookUseCase);
//# sourceMappingURL=webhook.use-case.js.map