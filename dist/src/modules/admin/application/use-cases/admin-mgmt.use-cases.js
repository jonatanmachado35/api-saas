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
exports.DeleteAdminAgentUseCase = exports.CreateAdminAgentUseCase = exports.ListAllAgentsUseCase = exports.UpdateAdminSubscriptionUseCase = exports.CreateAdminSubscriptionUseCase = exports.ListAdminSubscriptionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ListAdminSubscriptionsUseCase = class ListAdminSubscriptionsUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const subs = await this.prisma.subscription.findMany({
            include: { user: true },
        });
        const usersWithoutSub = await this.prisma.user.findMany({
            where: { subscription: null },
        });
        return {
            subscriptions: subs.map((s) => ({
                id: s.id,
                user_id: s.user_id,
                plan: s.plan.toLowerCase(),
                status: s.status.toLowerCase(),
                credits: s.credits,
                owner_name: s.user.full_name,
                owner_email: s.user.email,
                created_at: s.created_at,
            })),
            users_without_subscription: usersWithoutSub.map((u) => ({
                user_id: u.id,
                full_name: u.full_name,
            })),
        };
    }
};
exports.ListAdminSubscriptionsUseCase = ListAdminSubscriptionsUseCase;
exports.ListAdminSubscriptionsUseCase = ListAdminSubscriptionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListAdminSubscriptionsUseCase);
let CreateAdminSubscriptionUseCase = class CreateAdminSubscriptionUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(input) {
        const existingSub = await this.prisma.subscription.findUnique({
            where: { user_id: input.user_id },
        });
        if (existingSub) {
            throw new common_1.BadRequestException('User already has a subscription');
        }
        const subscription = await this.prisma.subscription.create({
            data: {
                user_id: input.user_id,
                plan: input.plan.toUpperCase(),
                status: (input.status?.toUpperCase() || 'ACTIVE'),
                credits: input.credits ?? 50,
            },
        });
        return {
            subscription: {
                id: subscription.id,
                user_id: subscription.user_id,
                plan: subscription.plan.toLowerCase(),
                status: subscription.status.toLowerCase(),
                credits: subscription.credits,
            },
            success: true,
        };
    }
};
exports.CreateAdminSubscriptionUseCase = CreateAdminSubscriptionUseCase;
exports.CreateAdminSubscriptionUseCase = CreateAdminSubscriptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreateAdminSubscriptionUseCase);
let UpdateAdminSubscriptionUseCase = class UpdateAdminSubscriptionUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(subscriptionId, input) {
        const existingSub = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!existingSub) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const subscription = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                ...(input.plan && { plan: input.plan.toUpperCase() }),
                ...(input.status && { status: input.status.toUpperCase() }),
                ...(input.credits !== undefined && { credits: input.credits }),
            },
        });
        return {
            subscription: {
                id: subscription.id,
                user_id: subscription.user_id,
                plan: subscription.plan.toLowerCase(),
                status: subscription.status.toLowerCase(),
                credits: subscription.credits,
            },
            success: true,
        };
    }
};
exports.UpdateAdminSubscriptionUseCase = UpdateAdminSubscriptionUseCase;
exports.UpdateAdminSubscriptionUseCase = UpdateAdminSubscriptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UpdateAdminSubscriptionUseCase);
let ListAllAgentsUseCase = class ListAllAgentsUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const agents = await this.prisma.agent.findMany({
            include: { user: true },
        });
        const users = await this.prisma.user.findMany({
            select: { id: true, full_name: true },
        });
        return {
            agents: agents.map((a) => ({
                id: a.id,
                user_id: a.user_id,
                name: a.name,
                avatar: a.avatar,
                description: a.description,
                owner_name: a.user.full_name,
                created_at: a.created_at,
            })),
            users: users.map((u) => ({
                user_id: u.id,
                full_name: u.full_name,
            })),
        };
    }
};
exports.ListAllAgentsUseCase = ListAllAgentsUseCase;
exports.ListAllAgentsUseCase = ListAllAgentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListAllAgentsUseCase);
let CreateAdminAgentUseCase = class CreateAdminAgentUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(input) {
        const agent = await this.prisma.agent.create({
            data: {
                user_id: input.user_id,
                name: input.name,
                avatar: input.avatar,
                description: input.description,
            },
        });
        return {
            agent: {
                id: agent.id,
                user_id: agent.user_id,
                name: agent.name,
                avatar: agent.avatar,
                description: agent.description,
                created_at: agent.created_at,
            },
            success: true,
        };
    }
};
exports.CreateAdminAgentUseCase = CreateAdminAgentUseCase;
exports.CreateAdminAgentUseCase = CreateAdminAgentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreateAdminAgentUseCase);
let DeleteAdminAgentUseCase = class DeleteAdminAgentUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(agentId) {
        const agent = await this.prisma.agent.findUnique({
            where: { id: agentId },
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        await this.prisma.agent.delete({
            where: { id: agentId },
        });
        return { success: true };
    }
};
exports.DeleteAdminAgentUseCase = DeleteAdminAgentUseCase;
exports.DeleteAdminAgentUseCase = DeleteAdminAgentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeleteAdminAgentUseCase);
//# sourceMappingURL=admin-mgmt.use-cases.js.map