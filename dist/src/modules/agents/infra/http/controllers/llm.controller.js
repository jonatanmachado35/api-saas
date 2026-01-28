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
exports.AdminLlmController = exports.LlmController = exports.UpdateLlmDto = exports.CreateLlmDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const llm_use_cases_1 = require("../../../application/use-cases/llm.use-cases");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const roles_guard_1 = require("../../../../../core/guards/roles.guard");
const roles_decorator_1 = require("../../../../../core/decorators/roles.decorator");
const user_entity_1 = require("../../../../iam/domain/entities/user.entity");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class CreateLlmDto {
    name;
    provider;
    model;
    maxTokens;
    creditCost;
}
exports.CreateLlmDto = CreateLlmDto;
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'GPT-4 Turbo', description: 'Nome do LLM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLlmDto.prototype, "name", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'OpenAI', description: 'Provedor do LLM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLlmDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'gpt-4-turbo-preview', description: 'Modelo do LLM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLlmDto.prototype, "model", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 128000, description: 'Quantidade máxima de tokens' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLlmDto.prototype, "maxTokens", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 1, description: 'Custo em créditos por uso' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLlmDto.prototype, "creditCost", void 0);
class UpdateLlmDto {
    name;
    provider;
    model;
    maxTokens;
    creditCost;
    active;
}
exports.UpdateLlmDto = UpdateLlmDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'GPT-4 Turbo (Updated)', description: 'Nome do LLM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLlmDto.prototype, "name", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'OpenAI', description: 'Provedor do LLM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLlmDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 'gpt-4-turbo-preview', description: 'Modelo do LLM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLlmDto.prototype, "model", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 128000, description: 'Quantidade máxima de tokens' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateLlmDto.prototype, "maxTokens", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: 1, description: 'Custo em créditos por uso' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateLlmDto.prototype, "creditCost", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ example: true, description: 'Se o LLM está ativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLlmDto.prototype, "active", void 0);
let LlmController = class LlmController {
    listLlmsUseCase;
    getLlmByIdUseCase;
    constructor(listLlmsUseCase, getLlmByIdUseCase) {
        this.listLlmsUseCase = listLlmsUseCase;
        this.getLlmByIdUseCase = getLlmByIdUseCase;
    }
    async list(all) {
        const activeOnly = all !== 'true';
        return this.listLlmsUseCase.execute({ activeOnly });
    }
    async getById(id) {
        return this.getLlmByIdUseCase.execute({ id });
    }
};
exports.LlmController = LlmController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar LLMs ativos' }),
    __param(0, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LlmController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter LLM por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LlmController.prototype, "getById", null);
exports.LlmController = LlmController = __decorate([
    (0, swagger_1.ApiTags)('LLMs'),
    (0, common_1.Controller)('llms'),
    __metadata("design:paramtypes", [llm_use_cases_1.ListLlmsUseCase,
        llm_use_cases_1.GetLlmByIdUseCase])
], LlmController);
let AdminLlmController = class AdminLlmController {
    listLlmsUseCase;
    getLlmByIdUseCase;
    createLlmUseCase;
    updateLlmUseCase;
    deleteLlmUseCase;
    constructor(listLlmsUseCase, getLlmByIdUseCase, createLlmUseCase, updateLlmUseCase, deleteLlmUseCase) {
        this.listLlmsUseCase = listLlmsUseCase;
        this.getLlmByIdUseCase = getLlmByIdUseCase;
        this.createLlmUseCase = createLlmUseCase;
        this.updateLlmUseCase = updateLlmUseCase;
        this.deleteLlmUseCase = deleteLlmUseCase;
    }
    async list() {
        return this.listLlmsUseCase.execute({ activeOnly: false });
    }
    async getById(id) {
        return this.getLlmByIdUseCase.execute({ id });
    }
    async create(dto) {
        return this.createLlmUseCase.execute(dto);
    }
    async update(id, dto) {
        return this.updateLlmUseCase.execute({ id, ...dto });
    }
    async delete(id) {
        await this.deleteLlmUseCase.execute({ id });
        return { message: 'LLM deleted successfully' };
    }
};
exports.AdminLlmController = AdminLlmController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os LLMs (incluindo inativos)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminLlmController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter LLM por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLlmController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo LLM' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLlmDto]),
    __metadata("design:returntype", Promise)
], AdminLlmController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar LLM' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLlmDto]),
    __metadata("design:returntype", Promise)
], AdminLlmController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar LLM' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminLlmController.prototype, "delete", null);
exports.AdminLlmController = AdminLlmController = __decorate([
    (0, swagger_1.ApiTags)('Admin - LLMs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin/llms'),
    __metadata("design:paramtypes", [llm_use_cases_1.ListLlmsUseCase,
        llm_use_cases_1.GetLlmByIdUseCase,
        llm_use_cases_1.CreateLlmUseCase,
        llm_use_cases_1.UpdateLlmUseCase,
        llm_use_cases_1.DeleteLlmUseCase])
], AdminLlmController);
//# sourceMappingURL=llm.controller.js.map