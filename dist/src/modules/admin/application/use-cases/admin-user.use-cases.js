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
exports.ChangeUserRoleUseCase = exports.ListUsersUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ListUsersUseCase = class ListUsersUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute() {
        const users = await this.prisma.user.findMany({
            include: { subscription: true },
            orderBy: { created_at: 'desc' },
        });
        return users.map((u) => ({
            id: u.id,
            user_id: u.id,
            full_name: u.full_name,
            avatar_url: u.avatar_url,
            created_at: u.created_at,
            role: u.role.toLowerCase(),
            plan: u.subscription?.plan.toLowerCase() || null,
            status: u.subscription?.status.toLowerCase() || null,
            credits: u.subscription?.credits || 0,
        }));
    }
};
exports.ListUsersUseCase = ListUsersUseCase;
exports.ListUsersUseCase = ListUsersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListUsersUseCase);
let ChangeUserRoleUseCase = class ChangeUserRoleUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(userId, role) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const roleValue = role === 'none' ? 'USER' : role.toUpperCase();
        await this.prisma.user.update({
            where: { id: userId },
            data: { role: roleValue },
        });
    }
};
exports.ChangeUserRoleUseCase = ChangeUserRoleUseCase;
exports.ChangeUserRoleUseCase = ChangeUserRoleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChangeUserRoleUseCase);
//# sourceMappingURL=admin-user.use-cases.js.map