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
exports.WebhookController = exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const payment_use_cases_1 = require("../../../application/use-cases/payment.use-cases");
const webhook_use_case_1 = require("../../../application/use-cases/webhook.use-case");
const payment_dto_1 = require("../dtos/payment.dto");
let PaymentController = class PaymentController {
    createSubscriptionPayment;
    createCreditsPayment;
    getPayment;
    listPayments;
    constructor(createSubscriptionPayment, createCreditsPayment, getPayment, listPayments) {
        this.createSubscriptionPayment = createSubscriptionPayment;
        this.createCreditsPayment = createCreditsPayment;
        this.getPayment = getPayment;
        this.listPayments = listPayments;
    }
    async createSubscriptionCheckout(req, body) {
        return this.createSubscriptionPayment.execute({
            userId: req.user.id,
            plan: body.plan,
            email: req.user.email,
            returnUrl: body.returnUrl,
        });
    }
    async createCreditsCheckout(req, body) {
        return this.createCreditsPayment.execute({
            userId: req.user.id,
            packageId: body.packageId,
            email: req.user.email,
            returnUrl: body.returnUrl,
        });
    }
    async getPaymentById(req, id) {
        return this.getPayment.execute(id, req.user.id);
    }
    async listUserPayments(req) {
        return this.listPayments.execute(req.user.id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('subscription/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Criar checkout de assinatura' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checkout criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Plano inválido' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreateSubscriptionPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createSubscriptionCheckout", null);
__decorate([
    (0, common_1.Post)('credits/checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Criar checkout de créditos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checkout criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pacote inválido' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreateCreditsPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCreditsCheckout", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obter pagamento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentById", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os pagamentos do usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pagamentos' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "listUserPayments", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_use_cases_1.CreateSubscriptionPaymentUseCase,
        payment_use_cases_1.CreateCreditsPaymentUseCase,
        payment_use_cases_1.GetPaymentUseCase,
        payment_use_cases_1.ListPaymentsUseCase])
], PaymentController);
let WebhookController = class WebhookController {
    processWebhook;
    constructor(processWebhook) {
        this.processWebhook = processWebhook;
    }
    async handleAbacatePayWebhook(body) {
        return this.processWebhook.execute(body);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('abacatepay'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook do AbacatePay' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.WebhookDto]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleAbacatePayWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhook_use_case_1.ProcessPaymentWebhookUseCase])
], WebhookController);
//# sourceMappingURL=payment.controller.js.map