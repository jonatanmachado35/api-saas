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
exports.CreditsController = exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const subscription_use_cases_1 = require("../../../application/use-cases/subscription.use-cases");
const subscription_dto_1 = require("../dtos/subscription.dto");
let SubscriptionController = class SubscriptionController {
    getSubscriptionUseCase;
    upgradePlanUseCase;
    downgradePlanUseCase;
    purchaseCreditsUseCase;
    constructor(getSubscriptionUseCase, upgradePlanUseCase, downgradePlanUseCase, purchaseCreditsUseCase) {
        this.getSubscriptionUseCase = getSubscriptionUseCase;
        this.upgradePlanUseCase = upgradePlanUseCase;
        this.downgradePlanUseCase = downgradePlanUseCase;
        this.purchaseCreditsUseCase = purchaseCreditsUseCase;
    }
    async getByUserId(userId) {
        return this.getSubscriptionUseCase.execute(userId);
    }
    async upgrade(req, body) {
        return this.upgradePlanUseCase.execute(req.user.id, body.plan);
    }
    async downgrade(req) {
        return this.downgradePlanUseCase.execute(req.user.id);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)(':user_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter assinatura do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados da assinatura' }),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getByUserId", null);
__decorate([
    (0, common_1.Post)('upgrade'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer upgrade de plano' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upgrade realizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assinatura nao encontrada' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subscription_dto_1.UpgradePlanDto]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "upgrade", null);
__decorate([
    (0, common_1.Post)('downgrade'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer downgrade para plano free' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Downgrade realizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assinatura nao encontrada' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "downgrade", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [subscription_use_cases_1.GetSubscriptionUseCase,
        subscription_use_cases_1.UpgradePlanUseCase,
        subscription_use_cases_1.DowngradePlanUseCase,
        subscription_use_cases_1.PurchaseCreditsUseCase])
], SubscriptionController);
let CreditsController = class CreditsController {
    purchaseCreditsUseCase;
    constructor(purchaseCreditsUseCase) {
        this.purchaseCreditsUseCase = purchaseCreditsUseCase;
    }
    async purchase(req, body) {
        return this.purchaseCreditsUseCase.execute(req.user.id, body.package_id);
    }
};
exports.CreditsController = CreditsController;
__decorate([
    (0, common_1.Post)('purchase'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Comprar creditos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Creditos comprados com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pacote invalido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assinatura nao encontrada' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, subscription_dto_1.PurchaseCreditsDto]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "purchase", null);
exports.CreditsController = CreditsController = __decorate([
    (0, swagger_1.ApiTags)('Credits'),
    (0, common_1.Controller)('credits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [subscription_use_cases_1.PurchaseCreditsUseCase])
], CreditsController);
//# sourceMappingURL=subscription.controller.js.map