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
exports.DeleteAgentUseCase = exports.ListAgentsUseCase = exports.UpdateAgentUseCase = exports.CreateAgentUseCase = void 0;
const common_1 = require("@nestjs/common");
const agent_entity_1 = require("../../domain/entities/agent.entity");
let CreateAgentUseCase = class CreateAgentUseCase {
    agentRepository;
    constructor(agentRepository) {
        this.agentRepository = agentRepository;
    }
    async execute(input) {
        const isAdmin = ['ADMIN', 'MODERATOR', 'OWNER'].includes(input.user_role || '');
        if (input.visibility && input.visibility !== agent_entity_1.AgentVisibility.PRIVATE && !isAdmin) {
            throw new common_1.ForbiddenException('Apenas administradores podem criar agentes com visibilidade PREMIUM ou ADMIN_ONLY');
        }
        const visibility = isAdmin ? (input.visibility || agent_entity_1.AgentVisibility.PRIVATE) : agent_entity_1.AgentVisibility.PRIVATE;
        const agent = new agent_entity_1.Agent({
            userId: input.user_id,
            name: input.name,
            avatar: input.avatar,
            description: input.description,
            prompt: input.prompt,
            category: input.category,
            type: input.type,
            tone: input.tone,
            style: input.style,
            focus: input.focus,
            rules: input.rules,
            visibility,
        });
        await this.agentRepository.save(agent);
        return {
            id: agent.id,
            user_id: agent.userId,
            name: agent.name,
            avatar: agent.avatar,
            description: agent.description,
            prompt: agent.prompt,
            category: agent.category,
            type: agent.type,
            tone: agent.tone,
            style: agent.style,
            focus: agent.focus,
            rules: agent.rules,
            visibility: agent.visibility,
            created_at: agent.props.createdAt || new Date(),
        };
    }
};
exports.CreateAgentUseCase = CreateAgentUseCase;
exports.CreateAgentUseCase = CreateAgentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [Object])
], CreateAgentUseCase);
let UpdateAgentUseCase = class UpdateAgentUseCase {
    agentRepository;
    constructor(agentRepository) {
        this.agentRepository = agentRepository;
    }
    async execute(agentId, input) {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const isAdmin = ['ADMIN', 'MODERATOR', 'OWNER'].includes(input.user_role || '');
        if (input.visibility && input.visibility !== agent_entity_1.AgentVisibility.PRIVATE && !isAdmin) {
            throw new common_1.ForbiddenException('Apenas administradores podem alterar a visibilidade para PREMIUM ou ADMIN_ONLY');
        }
        const updatedAgent = new agent_entity_1.Agent({
            ...agent.props,
            name: input.name ?? agent.name,
            avatar: input.avatar ?? agent.avatar,
            description: input.description ?? agent.description,
            prompt: input.prompt ?? agent.prompt,
            category: input.category ?? agent.category,
            type: input.type ?? agent.type,
            tone: input.tone ?? agent.tone,
            style: input.style ?? agent.style,
            focus: input.focus ?? agent.focus,
            rules: input.rules ?? agent.rules,
            visibility: input.visibility ?? agent.visibility,
        }, agent.id);
        await this.agentRepository.save(updatedAgent);
        return {
            agent: {
                id: updatedAgent.id,
                user_id: updatedAgent.userId,
                name: updatedAgent.name,
                avatar: updatedAgent.avatar,
                description: updatedAgent.description,
                prompt: updatedAgent.prompt,
                category: updatedAgent.category,
                type: updatedAgent.type,
                tone: updatedAgent.tone,
                style: updatedAgent.style,
                focus: updatedAgent.focus,
                rules: updatedAgent.rules,
                visibility: updatedAgent.visibility,
                created_at: updatedAgent.props.createdAt,
                updated_at: new Date(),
            },
            success: true,
        };
    }
};
exports.UpdateAgentUseCase = UpdateAgentUseCase;
exports.UpdateAgentUseCase = UpdateAgentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [Object])
], UpdateAgentUseCase);
let ListAgentsUseCase = class ListAgentsUseCase {
    agentRepository;
    constructor(agentRepository) {
        this.agentRepository = agentRepository;
    }
    async execute(userId, userRole, userPlan) {
        const agents = await this.agentRepository.findAccessibleByUser(userId, userRole, userPlan);
        return agents.map((a) => ({
            id: a.id,
            user_id: a.userId,
            name: a.name,
            avatar: a.avatar,
            description: a.description,
            prompt: a.prompt,
            category: a.category,
            type: a.type,
            tone: a.tone,
            style: a.style,
            focus: a.focus,
            rules: a.rules,
            visibility: a.visibility,
            created_at: a.props.createdAt,
            updated_at: a.props.updatedAt,
        }));
    }
};
exports.ListAgentsUseCase = ListAgentsUseCase;
exports.ListAgentsUseCase = ListAgentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [Object])
], ListAgentsUseCase);
let DeleteAgentUseCase = class DeleteAgentUseCase {
    agentRepository;
    constructor(agentRepository) {
        this.agentRepository = agentRepository;
    }
    async execute(id) {
        const agent = await this.agentRepository.findById(id);
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        await this.agentRepository.delete(id);
    }
};
exports.DeleteAgentUseCase = DeleteAgentUseCase;
exports.DeleteAgentUseCase = DeleteAgentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [Object])
], DeleteAgentUseCase);
//# sourceMappingURL=agent.use-cases.js.map