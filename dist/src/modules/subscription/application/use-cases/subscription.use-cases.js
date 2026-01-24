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
exports.CreateSubscriptionUseCase = exports.PurchaseCreditsUseCase = exports.DowngradePlanUseCase = exports.UpgradePlanUseCase = exports.GetSubscriptionUseCase = void 0;
const common_1 = require("@nestjs/common");
const subscription_entity_1 = require("../../domain/entities/subscription.entity");
const CREDIT_PACKAGES = {
    starter: { credits: 100, bonus: 0 },
    popular: { credits: 500, bonus: 50 },
    pro: { credits: 1000, bonus: 150 },
    enterprise: { credits: 5000, bonus: 1000 },
};
let GetSubscriptionUseCase = class GetSubscriptionUseCase {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(userId) {
        const sub = await this.subscriptionRepository.findByUserId(userId);
        if (!sub) {
            return null;
        }
        return {
            id: sub.id,
            user_id: sub.userId,
            plan: sub.plan.toLowerCase(),
            status: sub.status.toLowerCase(),
            credits: sub.credits,
            created_at: sub.props.createdAt,
            updated_at: sub.props.updatedAt,
        };
    }
};
exports.GetSubscriptionUseCase = GetSubscriptionUseCase;
exports.GetSubscriptionUseCase = GetSubscriptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object])
], GetSubscriptionUseCase);
let UpgradePlanUseCase = class UpgradePlanUseCase {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(userId, plan) {
        const sub = await this.subscriptionRepository.findByUserId(userId);
        if (!sub) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const newPlan = plan.toUpperCase();
        if (!Object.values(subscription_entity_1.SubscriptionPlan).includes(newPlan)) {
            throw new common_1.BadRequestException('Invalid plan');
        }
        const additionalCredits = newPlan === subscription_entity_1.SubscriptionPlan.PRO ? 500 : 0;
        const updatedSub = new subscription_entity_1.Subscription({
            ...sub.props,
            plan: newPlan,
            credits: sub.credits + additionalCredits,
        }, sub.id);
        await this.subscriptionRepository.save(updatedSub);
        return {
            subscription: {
                id: updatedSub.id,
                user_id: updatedSub.userId,
                plan: updatedSub.plan.toLowerCase(),
                status: updatedSub.status.toLowerCase(),
                credits: updatedSub.credits,
            },
            success: true,
        };
    }
};
exports.UpgradePlanUseCase = UpgradePlanUseCase;
exports.UpgradePlanUseCase = UpgradePlanUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object])
], UpgradePlanUseCase);
let DowngradePlanUseCase = class DowngradePlanUseCase {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(userId) {
        const sub = await this.subscriptionRepository.findByUserId(userId);
        if (!sub) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const updatedSub = new subscription_entity_1.Subscription({
            ...sub.props,
            plan: subscription_entity_1.SubscriptionPlan.FREE,
        }, sub.id);
        await this.subscriptionRepository.save(updatedSub);
        return {
            subscription: {
                id: updatedSub.id,
                user_id: updatedSub.userId,
                plan: updatedSub.plan.toLowerCase(),
                status: updatedSub.status.toLowerCase(),
                credits: updatedSub.credits,
            },
            success: true,
        };
    }
};
exports.DowngradePlanUseCase = DowngradePlanUseCase;
exports.DowngradePlanUseCase = DowngradePlanUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object])
], DowngradePlanUseCase);
let PurchaseCreditsUseCase = class PurchaseCreditsUseCase {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(userId, packageId) {
        const sub = await this.subscriptionRepository.findByUserId(userId);
        if (!sub) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const creditPackage = CREDIT_PACKAGES[packageId];
        if (!creditPackage) {
            throw new common_1.BadRequestException('Invalid package');
        }
        const totalCreditsToAdd = creditPackage.credits + creditPackage.bonus;
        const updatedSub = new subscription_entity_1.Subscription({
            ...sub.props,
            credits: sub.credits + totalCreditsToAdd,
        }, sub.id);
        await this.subscriptionRepository.save(updatedSub);
        return {
            success: true,
            total_credits: updatedSub.credits,
        };
    }
};
exports.PurchaseCreditsUseCase = PurchaseCreditsUseCase;
exports.PurchaseCreditsUseCase = PurchaseCreditsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object])
], PurchaseCreditsUseCase);
let CreateSubscriptionUseCase = class CreateSubscriptionUseCase {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async execute(userId, plan, credits) {
        const existing = await this.subscriptionRepository.findByUserId(userId);
        if (existing) {
            return existing;
        }
        const subscription = new subscription_entity_1.Subscription({
            userId,
            plan: plan?.toUpperCase() || subscription_entity_1.SubscriptionPlan.FREE,
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            credits: credits ?? 50,
        });
        await this.subscriptionRepository.save(subscription);
        return subscription;
    }
};
exports.CreateSubscriptionUseCase = CreateSubscriptionUseCase;
exports.CreateSubscriptionUseCase = CreateSubscriptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SubscriptionRepository')),
    __metadata("design:paramtypes", [Object])
], CreateSubscriptionUseCase);
//# sourceMappingURL=subscription.use-cases.js.map