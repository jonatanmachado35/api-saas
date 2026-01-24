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
exports.PurchaseCreditsDto = exports.UpgradePlanDto = exports.PlanType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    PlanType["PRO"] = "pro";
    PlanType["CUSTOM"] = "custom";
})(PlanType || (exports.PlanType = PlanType = {}));
class UpgradePlanDto {
    plan;
}
exports.UpgradePlanDto = UpgradePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pro', enum: PlanType, description: 'Tipo do plano' }),
    (0, class_validator_1.IsEnum)(PlanType),
    __metadata("design:type", String)
], UpgradePlanDto.prototype, "plan", void 0);
class PurchaseCreditsDto {
    package_id;
    credits;
}
exports.PurchaseCreditsDto = PurchaseCreditsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'popular', description: 'ID do pacote de creditos' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseCreditsDto.prototype, "package_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500, description: 'Quantidade de creditos (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PurchaseCreditsDto.prototype, "credits", void 0);
//# sourceMappingURL=subscription.dto.js.map