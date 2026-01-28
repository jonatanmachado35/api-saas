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
exports.PrismaProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const product_entity_1 = require("../../domain/entities/product.entity");
let PrismaProductRepository = class PrismaProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(product) {
        return new product_entity_1.Product({
            type: product.type,
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            credits: product.credits,
            bonus: product.bonus,
            active: product.active,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        }, product.id);
    }
    async save(product) {
        const data = {
            id: product.id,
            type: product.type,
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            credits: product.credits,
            bonus: product.bonus,
            active: product.active,
        };
        await this.prisma.product.upsert({
            where: { id: product.id },
            update: {
                name: data.name,
                description: data.description,
                price: data.price,
                credits: data.credits,
                bonus: data.bonus,
                active: data.active,
            },
            create: data,
        });
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            return null;
        return this.toDomain(product);
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({ where: { slug } });
        if (!product)
            return null;
        return this.toDomain(product);
    }
    async findByType(type) {
        const products = await this.prisma.product.findMany({
            where: { type, active: true },
            orderBy: { price: 'asc' },
        });
        return products.map((p) => this.toDomain(p));
    }
    async findAllActive() {
        const products = await this.prisma.product.findMany({
            where: { active: true },
            orderBy: { price: 'asc' },
        });
        return products.map((p) => this.toDomain(p));
    }
    async findAll() {
        const products = await this.prisma.product.findMany({
            orderBy: { created_at: 'desc' },
        });
        return products.map((p) => this.toDomain(p));
    }
    async delete(id) {
        await this.prisma.product.delete({ where: { id } });
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductRepository);
//# sourceMappingURL=prisma-product.repository.js.map