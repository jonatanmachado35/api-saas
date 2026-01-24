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
let AgentController = class AgentController {
    createUseCase;
    updateUseCase;
    listUseCase;
    deleteUseCase;
    constructor(createUseCase, updateUseCase, listUseCase, deleteUseCase) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    async list(userId) {
        return this.listUseCase.execute(userId);
    }
    async create(body) {
        return this.createUseCase.execute(body);
    }
    async update(agentId, body) {
        return this.updateUseCase.execute(agentId, body);
    }
    async delete(agentId) {
        await this.deleteUseCase.execute(agentId);
        return { success: true };
    }
};
exports.AgentController = AgentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar agentes do usuario' }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: true, description: 'ID do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de agentes' }),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo agente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agente criado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agent_dto_1.CreateAgentDto]),
    __metadata("design:returntype", Promise)
], AgentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':agent_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar agente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agente atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agente nao encontrado' }),
    __param(0, (0, common_1.Param)('agent_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agent_dto_1.UpdateAgentDto]),
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
        agent_use_cases_1.DeleteAgentUseCase])
], AgentController);
//# sourceMappingURL=agent.controller.js.map