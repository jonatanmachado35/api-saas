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
exports.PrismaPaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const payment_entity_1 = require("../../domain/entities/payment.entity");
let PrismaPaymentRepository = class PrismaPaymentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(payment) {
        return new payment_entity_1.Payment({
            userId: payment.user_id,
            type: payment.type,
            amount: payment.amount,
            description: payment.description,
            status: payment.status,
            frequency: payment.frequency,
            externalId: payment.external_id,
            paymentUrl: payment.payment_url,
            metadata: payment.metadata,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at,
        }, payment.id);
    }
    async save(payment) {
        const data = {
            id: payment.id,
            user_id: payment.userId,
            type: payment.type,
            amount: payment.amount,
            description: payment.description,
            status: payment.status,
            frequency: payment.frequency,
            external_id: payment.externalId,
            payment_url: payment.paymentUrl,
            metadata: payment.metadata || {},
        };
        await this.prisma.payment.upsert({
            where: { id: payment.id },
            update: {
                status: data.status,
                external_id: data.external_id,
                payment_url: data.payment_url,
                metadata: data.metadata,
            },
            create: data,
        });
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment)
            return null;
        return this.toDomain(payment);
    }
    async findByExternalId(externalId) {
        const payment = await this.prisma.payment.findFirst({
            where: { external_id: externalId },
        });
        if (!payment)
            return null;
        return this.toDomain(payment);
    }
    async findByUserId(userId) {
        const payments = await this.prisma.payment.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });
        return payments.map((p) => this.toDomain(p));
    }
};
exports.PrismaPaymentRepository = PrismaPaymentRepository;
exports.PrismaPaymentRepository = PrismaPaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPaymentRepository);
//# sourceMappingURL=prisma-payment.repository.js.map