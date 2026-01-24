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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const roles_guard_1 = require("../../../../../core/guards/roles.guard");
const roles_decorator_1 = require("../../../../../core/decorators/roles.decorator");
const user_entity_1 = require("../../../../iam/domain/entities/user.entity");
const admin_stats_use_case_1 = require("../../../application/use-cases/admin-stats.use-case");
const admin_user_use_cases_1 = require("../../../application/use-cases/admin-user.use-cases");
const admin_mgmt_use_cases_1 = require("../../../application/use-cases/admin-mgmt.use-cases");
const admin_dto_1 = require("../dtos/admin.dto");
let AdminController = class AdminController {
    statsUseCase;
    listUsersUseCase;
    changeRoleUseCase;
    listSubsUseCase;
    createSubUseCase;
    updateSubUseCase;
    listAgentsUseCase;
    createAgentUseCase;
    deleteAgentUseCase;
    constructor(statsUseCase, listUsersUseCase, changeRoleUseCase, listSubsUseCase, createSubUseCase, updateSubUseCase, listAgentsUseCase, createAgentUseCase, deleteAgentUseCase) {
        this.statsUseCase = statsUseCase;
        this.listUsersUseCase = listUsersUseCase;
        this.changeRoleUseCase = changeRoleUseCase;
        this.listSubsUseCase = listSubsUseCase;
        this.createSubUseCase = createSubUseCase;
        this.updateSubUseCase = updateSubUseCase;
        this.listAgentsUseCase = listAgentsUseCase;
        this.createAgentUseCase = createAgentUseCase;
        this.deleteAgentUseCase = deleteAgentUseCase;
    }
    async getStats() {
        return this.statsUseCase.execute();
    }
    async listUsers() {
        return this.listUsersUseCase.execute();
    }
    async changeRole(userId, body) {
        await this.changeRoleUseCase.execute(userId, body.role);
        return { success: true };
    }
    async listSubscriptions() {
        return this.listSubsUseCase.execute();
    }
    async createSubscription(body) {
        return this.createSubUseCase.execute(body);
    }
    async updateSubscription(subscriptionId, body) {
        return this.updateSubUseCase.execute(subscriptionId, body);
    }
    async listAgents() {
        return this.listAgentsUseCase.execute();
    }
    async createAgent(body) {
        return this.createAgentUseCase.execute(body);
    }
    async deleteAgent(agentId) {
        return this.deleteAgentUseCase.execute(agentId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatisticas do dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatisticas do sistema' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado - requer role admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Put)('users/:user_id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Alterar role de usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role alterada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario nao encontrado' }),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.ChangeUserRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as assinaturas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de assinaturas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listSubscriptions", null);
__decorate([
    (0, common_1.Post)('subscriptions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar assinatura para usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assinatura criada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateAdminSubscriptionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Put)('subscriptions/:subscription_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar assinatura' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assinatura atualizada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assinatura nao encontrada' }),
    __param(0, (0, common_1.Param)('subscription_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateAdminSubscriptionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os agentes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de agentes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listAgents", null);
__decorate([
    (0, common_1.Post)('agents'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar agente para usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agente criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateAdminAgentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAgent", null);
__decorate([
    (0, common_1.Delete)('agents/:agent_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar agente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agente deletado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agente nao encontrado' }),
    __param(0, (0, common_1.Param)('agent_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAgent", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.OWNER),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_stats_use_case_1.GetAdminStatsUseCase,
        admin_user_use_cases_1.ListUsersUseCase,
        admin_user_use_cases_1.ChangeUserRoleUseCase,
        admin_mgmt_use_cases_1.ListAdminSubscriptionsUseCase,
        admin_mgmt_use_cases_1.CreateAdminSubscriptionUseCase,
        admin_mgmt_use_cases_1.UpdateAdminSubscriptionUseCase,
        admin_mgmt_use_cases_1.ListAllAgentsUseCase,
        admin_mgmt_use_cases_1.CreateAdminAgentUseCase,
        admin_mgmt_use_cases_1.DeleteAdminAgentUseCase])
], AdminController);
//# sourceMappingURL=admin.controller.js.map