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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookDto = exports.CreateCreditsPaymentDto = exports.CreateSubscriptionPaymentDto = exports.CreditPackageType = exports.PaymentPlanType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PaymentPlanType;
(function (PaymentPlanType) {
    PaymentPlanType["PRO"] = "pro";
})(PaymentPlanType || (exports.PaymentPlanType = PaymentPlanType = {}));
var CreditPackageType;
(function (CreditPackageType) {
    CreditPackageType["STARTER"] = "starter";
    CreditPackageType["POPULAR"] = "popular";
    CreditPackageType["PRO"] = "pro";
    CreditPackageType["ENTERPRISE"] = "enterprise";
})(CreditPackageType || (exports.CreditPackageType = CreditPackageType = {}));
class CreateSubscriptionPaymentDto {
    plan;
    returnUrl;
}
exports.CreateSubscriptionPaymentDto = CreateSubscriptionPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pro', enum: PaymentPlanType, description: 'Plano de assinatura' }),
    (0, class_validator_1.IsEnum)(PaymentPlanType),
    __metadata("design:type", String)
], CreateSubscriptionPaymentDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://app.agentchat.com/dashboard', description: 'URL de retorno após pagamento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateSubscriptionPaymentDto.prototype, "returnUrl", void 0);
class CreateCreditsPaymentDto {
    packageId;
    returnUrl;
}
exports.CreateCreditsPaymentDto = CreateCreditsPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'popular', enum: CreditPackageType, description: 'Pacote de créditos' }),
    (0, class_validator_1.IsEnum)(CreditPackageType),
    __metadata("design:type", String)
], CreateCreditsPaymentDto.prototype, "packageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://app.agentchat.com/dashboard', description: 'URL de retorno após pagamento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCreditsPaymentDto.prototype, "returnUrl", void 0);
class WebhookDto {
    id;
    status;
    amount;
    frequency;
    metadata;
}
exports.WebhookDto = WebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bill_12345667', description: 'ID do billing no AbacatePay' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PAID', description: 'Status do pagamento' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4990, description: 'Valor em centavos' }),
    __metadata("design:type", Number)
], WebhookDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MONTHLY', description: 'Frequência do pagamento' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metadados adicionais' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WebhookDto.prototype, "metadata", void 0);
//# sourceMappingURL=payment.dto.js.map