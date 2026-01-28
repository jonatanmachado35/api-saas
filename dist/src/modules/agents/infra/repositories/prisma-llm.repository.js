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
exports.PrismaLlmRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const llm_entity_1 = require("../../domain/entities/llm.entity");
let PrismaLlmRepository = class PrismaLlmRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(llm) {
        const data = await this.prisma.llm.create({
            data: {
                id: llm.id,
                name: llm.name,
                provider: llm.provider,
                model: llm.model,
                max_tokens: llm.maxTokens,
                active: llm.active,
            },
        });
        return this.toDomain(data);
    }
    async findById(id) {
        const data = await this.prisma.llm.findUnique({
            where: { id },
        });
        return data ? this.toDomain(data) : null;
    }
    async findAll(activeOnly = false) {
        const data = await this.prisma.llm.findMany({
            where: activeOnly ? { active: true } : undefined,
            orderBy: { created_at: 'desc' },
        });
        return data.map(this.toDomain);
    }
    async update(llm) {
        const data = await this.prisma.llm.update({
            where: { id: llm.id },
            data: {
                name: llm.name,
                provider: llm.provider,
                model: llm.model,
                max_tokens: llm.maxTokens,
                active: llm.active,
                updated_at: new Date(),
            },
        });
        return this.toDomain(data);
    }
    async delete(id) {
        await this.prisma.llm.delete({
            where: { id },
        });
    }
    toDomain(data) {
        return new llm_entity_1.Llm({
            name: data.name,
            provider: data.provider,
            model: data.model,
            maxTokens: data.max_tokens,
            active: data.active,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }, data.id);
    }
};
exports.PrismaLlmRepository = PrismaLlmRepository;
exports.PrismaLlmRepository = PrismaLlmRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaLlmRepository);
//# sourceMappingURL=prisma-llm.repository.js.map