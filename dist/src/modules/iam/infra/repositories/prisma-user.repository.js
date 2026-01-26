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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(user) {
        return new user_entity_1.User({
            email: user.email,
            password: user.password,
            googleId: user.google_id,
            githubId: user.github_id,
            fullName: user.full_name,
            avatarUrl: user.avatar_url,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }, user.id);
    }
    async save(user) {
        const existingUser = await this.prisma.user.findUnique({ where: { id: user.id } });
        const data = {
            id: user.id,
            email: user.email,
            password: user.password,
            google_id: user.googleId,
            github_id: user.githubId,
            full_name: user.fullName,
            avatar_url: user.avatarUrl,
            role: user.role,
        };
        if (existingUser) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    email: data.email,
                    password: data.password,
                    google_id: data.google_id,
                    github_id: data.github_id,
                    full_name: data.full_name,
                    avatar_url: data.avatar_url,
                    role: data.role,
                },
            });
        }
        else {
            await this.prisma.user.create({
                data: {
                    ...data,
                    subscription: {
                        create: {
                            plan: 'FREE',
                            status: 'ACTIVE',
                            credits: 50,
                        },
                    },
                },
            });
        }
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByGoogleId(googleId) {
        const user = await this.prisma.user.findUnique({ where: { google_id: googleId } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findByGithubId(githubId) {
        const user = await this.prisma.user.findUnique({ where: { github_id: githubId } });
        if (!user)
            return null;
        return this.toDomain(user);
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { created_at: 'desc' },
        });
        return users.map((u) => this.toDomain(u));
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map