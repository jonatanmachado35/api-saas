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
exports.PrismaAgentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const agent_entity_1 = require("../../domain/entities/agent.entity");
let PrismaAgentRepository = class PrismaAgentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(agent) {
        return new agent_entity_1.Agent({
            userId: agent.user_id,
            name: agent.name,
            avatar: agent.avatar,
            description: agent.description,
            createdAt: agent.created_at,
            updatedAt: agent.updated_at,
        }, agent.id);
    }
    async save(agent) {
        const data = {
            id: agent.id,
            user_id: agent.userId,
            name: agent.name,
            avatar: agent.avatar,
            description: agent.description,
        };
        await this.prisma.agent.upsert({
            where: { id: agent.id },
            update: {
                name: data.name,
                avatar: data.avatar,
                description: data.description,
            },
            create: data,
        });
    }
    async findById(id) {
        const agent = await this.prisma.agent.findUnique({ where: { id } });
        if (!agent)
            return null;
        return this.toDomain(agent);
    }
    async findByUserId(userId) {
        const agents = await this.prisma.agent.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });
        return agents.map((a) => this.toDomain(a));
    }
    async delete(id) {
        await this.prisma.agent.delete({ where: { id } });
    }
};
exports.PrismaAgentRepository = PrismaAgentRepository;
exports.PrismaAgentRepository = PrismaAgentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAgentRepository);
//# sourceMappingURL=prisma-agent.repository.js.map