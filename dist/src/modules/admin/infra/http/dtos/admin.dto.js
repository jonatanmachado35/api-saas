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
exports.CreateAdminAgentDto = exports.UpdateAdminSubscriptionDto = exports.CreateAdminSubscriptionDto = exports.ChangeUserRoleDto = exports.AdminSubscriptionStatus = exports.AdminPlanType = exports.AdminRoleType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AdminRoleType;
(function (AdminRoleType) {
    AdminRoleType["USER"] = "user";
    AdminRoleType["MODERATOR"] = "moderator";
    AdminRoleType["ADMIN"] = "admin";
    AdminRoleType["NONE"] = "none";
})(AdminRoleType || (exports.AdminRoleType = AdminRoleType = {}));
var AdminPlanType;
(function (AdminPlanType) {
    AdminPlanType["FREE"] = "free";
    AdminPlanType["PRO"] = "pro";
    AdminPlanType["CUSTOM"] = "custom";
})(AdminPlanType || (exports.AdminPlanType = AdminPlanType = {}));
var AdminSubscriptionStatus;
(function (AdminSubscriptionStatus) {
    AdminSubscriptionStatus["ACTIVE"] = "active";
    AdminSubscriptionStatus["CANCELED"] = "canceled";
    AdminSubscriptionStatus["PENDING"] = "pending";
})(AdminSubscriptionStatus || (exports.AdminSubscriptionStatus = AdminSubscriptionStatus = {}));
class ChangeUserRoleDto {
    role;
}
exports.ChangeUserRoleDto = ChangeUserRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', enum: AdminRoleType, description: 'Nova role do usuario' }),
    (0, class_validator_1.IsEnum)(AdminRoleType),
    __metadata("design:type", String)
], ChangeUserRoleDto.prototype, "role", void 0);
class CreateAdminSubscriptionDto {
    user_id;
    plan;
    status;
    credits;
}
exports.CreateAdminSubscriptionDto = CreateAdminSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'ID do usuario' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pro', enum: AdminPlanType, description: 'Tipo do plano' }),
    (0, class_validator_1.IsEnum)(AdminPlanType),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'active', enum: AdminSubscriptionStatus, description: 'Status da assinatura' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AdminSubscriptionStatus),
    __metadata("design:type", String)
], CreateAdminSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: 'Quantidade de creditos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAdminSubscriptionDto.prototype, "credits", void 0);
class UpdateAdminSubscriptionDto {
    plan;
    status;
    credits;
}
exports.UpdateAdminSubscriptionDto = UpdateAdminSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pro', enum: AdminPlanType, description: 'Tipo do plano' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AdminPlanType),
    __metadata("design:type", String)
], UpdateAdminSubscriptionDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'active', enum: AdminSubscriptionStatus, description: 'Status da assinatura' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AdminSubscriptionStatus),
    __metadata("design:type", String)
], UpdateAdminSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500, description: 'Quantidade de creditos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateAdminSubscriptionDto.prototype, "credits", void 0);
class CreateAdminAgentDto {
    user_id;
    name;
    avatar;
    description;
}
exports.CreateAdminAgentDto = CreateAdminAgentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'ID do usuario dono do agente' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdminAgentDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Agente Admin', description: 'Nome do agente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAdminAgentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '🤖', description: 'Emoji do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateAdminAgentDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Descricao do agente', description: 'Descricao do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAdminAgentDto.prototype, "description", void 0);
//# sourceMappingURL=admin.dto.js.map