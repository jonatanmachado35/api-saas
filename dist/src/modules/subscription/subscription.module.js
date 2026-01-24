"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_subscription_repository_1 = require("./infra/repositories/prisma-subscription.repository");
const subscription_controller_1 = require("./infra/http/controllers/subscription.controller");
const subscription_use_cases_1 = require("./application/use-cases/subscription.use-cases");
const iam_module_1 = require("../iam/iam.module");
let SubscriptionModule = class SubscriptionModule {
};
exports.SubscriptionModule = SubscriptionModule;
exports.SubscriptionModule = SubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule],
        controllers: [subscription_controller_1.SubscriptionController, subscription_controller_1.CreditsController],
        providers: [
            {
                provide: 'SubscriptionRepository',
                useClass: prisma_subscription_repository_1.PrismaSubscriptionRepository,
            },
            subscription_use_cases_1.GetSubscriptionUseCase,
            subscription_use_cases_1.UpgradePlanUseCase,
            subscription_use_cases_1.DowngradePlanUseCase,
            subscription_use_cases_1.PurchaseCreditsUseCase,
            subscription_use_cases_1.CreateSubscriptionUseCase,
        ],
        exports: ['SubscriptionRepository', subscription_use_cases_1.CreateSubscriptionUseCase],
    })
], SubscriptionModule);
//# sourceMappingURL=subscription.module.js.map