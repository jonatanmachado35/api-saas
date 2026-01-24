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
exports.PrismaContactRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const contact_entity_1 = require("../../domain/entities/contact.entity");
let PrismaContactRepository = class PrismaContactRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(contact) {
        return new contact_entity_1.Contact({
            name: contact.name,
            email: contact.email,
            company: contact.company,
            subject: contact.subject,
            message: contact.message,
            createdAt: contact.created_at,
        }, contact.id);
    }
    async save(contact) {
        await this.prisma.contact.create({
            data: {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                company: contact.company,
                subject: contact.subject,
                message: contact.message,
            },
        });
    }
    async findById(id) {
        const contact = await this.prisma.contact.findUnique({ where: { id } });
        if (!contact)
            return null;
        return this.toDomain(contact);
    }
    async findAll() {
        const contacts = await this.prisma.contact.findMany({
            orderBy: { created_at: 'desc' },
        });
        return contacts.map((c) => this.toDomain(c));
    }
};
exports.PrismaContactRepository = PrismaContactRepository;
exports.PrismaContactRepository = PrismaContactRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaContactRepository);
//# sourceMappingURL=prisma-contact.repository.js.map