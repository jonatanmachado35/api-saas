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
exports.AgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agent_use_cases_1 = require("../../../application/use-cases/agent.use-cases");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const create_agent_dto_1 = require("../dtos/create-agent.dto");
const update_agent_dto_1 = require("../dtos/update-agent.dto");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const current_user_decorator_1 = require("../../../../../core/decorators/current-user.decorator");
let AgentController = class AgentController {
    createUseCase;
    updateUseCase;
    listUseCase;
    deleteUseCase;
    prisma;
    constructor(createUseCase, updateUseCase, listUseCase, deleteUseCase, prisma) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
        this.prisma = prisma;
    }
    async list(user) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { user_id: user.id },
        });
        const userPlan = subscription?.plan || 'FREE';
        return this.listUseCase.execute(user.id, user.role, userPlan);
    }
    async create(user, body) {
        return this.createUseCase.execute({
            ...body,
            user_id: user.id,
            user_role: user.role,
        });
    }
    async update(user, agentId, body) {
        return this.updateUseCase.execute(agentId, {
            ...body,
            user_role: user.role,
        });
    }
    async delete(agentId) {
        await this.deleteUseCase.execute(agentId);
        return { success: true };
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar agentes acessiveis ao usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de agentes' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo agente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agente criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissao para criar agente com essa visibilidade' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_agent_dto_1.CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':agent_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar agente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agente atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agente nao encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissao para alterar visibilidade' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('agent_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_agent_dto_1.UpdateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':agent_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar agente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agente deletado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agente nao encontrado' }),
    __param(0, (0, common_1.Param)('agent_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "delete", null);
exports.AgentController = AgentController = __decorate([
    (0, swagger_1.ApiTags)('Agents'),
    (0, common_1.Controller)('agents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [agent_use_cases_1.CreateAgentUseCase,
        agent_use_cases_1.UpdateAgentUseCase,
        agent_use_cases_1.ListAgentsUseCase,
        agent_use_cases_1.DeleteAgentUseCase,
        prisma_service_1.PrismaService])
], AgentController);
//# sourceMappingURL=agent.controller.js.map