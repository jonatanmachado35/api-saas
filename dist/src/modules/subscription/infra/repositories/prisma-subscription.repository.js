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
exports.PrismaSubscriptionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const subscription_entity_1 = require("../../domain/entities/subscription.entity");
let PrismaSubscriptionRepository = class PrismaSubscriptionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(sub) {
        return new subscription_entity_1.Subscription({
            userId: sub.user_id,
            plan: sub.plan,
            status: sub.status,
            credits: sub.credits,
            createdAt: sub.created_at,
            updatedAt: sub.updated_at,
        }, sub.id);
    }
    async save(subscription) {
        const data = {
            id: subscription.id,
            user_id: subscription.userId,
            plan: subscription.plan,
            status: subscription.status,
            credits: subscription.credits,
        };
        await this.prisma.subscription.upsert({
            where: { id: subscription.id },
            update: {
                plan: data.plan,
                status: data.status,
                credits: data.credits,
            },
            create: data,
        });
    }
    async findById(id) {
        const sub = await this.prisma.subscription.findUnique({ where: { id } });
        if (!sub)
            return null;
        return this.toDomain(sub);
    }
    async findByUserId(userId) {
        const sub = await this.prisma.subscription.findUnique({ where: { user_id: userId } });
        if (!sub)
            return null;
        return this.toDomain(sub);
    }
    async findAll() {
        const subs = await this.prisma.subscription.findMany({
            orderBy: { created_at: 'desc' },
        });
        return subs.map((s) => this.toDomain(s));
    }
    async findAllWithUsers() {
        const subs = await this.prisma.subscription.findMany({
            include: { user: true },
            orderBy: { created_at: 'desc' },
        });
        return subs.map((s) => ({
            id: s.id,
            user_id: s.user_id,
            plan: s.plan.toLowerCase(),
            status: s.status.toLowerCase(),
            credits: s.credits,
            owner_name: s.user.full_name,
            owner_email: s.user.email,
            created_at: s.created_at,
        }));
    }
};
exports.PrismaSubscriptionRepository = PrismaSubscriptionRepository;
exports.PrismaSubscriptionRepository = PrismaSubscriptionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSubscriptionRepository);
//# sourceMappingURL=prisma-subscription.repository.js.map