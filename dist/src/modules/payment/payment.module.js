"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_payment_repository_1 = require("./infra/repositories/prisma-payment.repository");
const abacatepay_service_1 = require("./infra/services/abacatepay.service");
const payment_controller_1 = require("./infra/http/controllers/payment.controller");
const payment_use_cases_1 = require("./application/use-cases/payment.use-cases");
const webhook_use_case_1 = require("./application/use-cases/webhook.use-case");
const iam_module_1 = require("../iam/iam.module");
const subscription_module_1 = require("../subscription/subscription.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, iam_module_1.IamModule, subscription_module_1.SubscriptionModule],
        controllers: [payment_controller_1.PaymentController, payment_controller_1.WebhookController],
        providers: [
            {
                provide: 'PaymentRepository',
                useClass: prisma_payment_repository_1.PrismaPaymentRepository,
            },
            abacatepay_service_1.AbacatePayService,
            payment_use_cases_1.CreateSubscriptionPaymentUseCase,
            payment_use_cases_1.CreateCreditsPaymentUseCase,
            payment_use_cases_1.GetPaymentUseCase,
            payment_use_cases_1.ListPaymentsUseCase,
            webhook_use_case_1.ProcessPaymentWebhookUseCase,
        ],
        exports: ['PaymentRepository', webhook_use_case_1.ProcessPaymentWebhookUseCase],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map