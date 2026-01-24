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
exports.SendContactUseCase = void 0;
const common_1 = require("@nestjs/common");
const contact_entity_1 = require("../../domain/entities/contact.entity");
let SendContactUseCase = class SendContactUseCase {
    contactRepository;
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async execute(input) {
        if (!input.name || input.name.length < 2 || input.name.length > 100) {
            throw new common_1.BadRequestException('Name must be between 2 and 100 characters');
        }
        if (!input.email || !this.isValidEmail(input.email)) {
            throw new common_1.BadRequestException('Invalid email');
        }
        if (!input.subject || input.subject.length < 5 || input.subject.length > 200) {
            throw new common_1.BadRequestException('Subject must be between 5 and 200 characters');
        }
        if (!input.message || input.message.length < 10 || input.message.length > 2000) {
            throw new common_1.BadRequestException('Message must be between 10 and 2000 characters');
        }
        const contact = new contact_entity_1.Contact({
            name: input.name,
            email: input.email,
            company: input.company,
            subject: input.subject,
            message: input.message,
        });
        await this.contactRepository.save(contact);
        return {
            success: true,
            message: 'Mensagem enviada com sucesso',
        };
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};
exports.SendContactUseCase = SendContactUseCase;
exports.SendContactUseCase = SendContactUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ContactRepository')),
    __metadata("design:paramtypes", [Object])
], SendContactUseCase);
//# sourceMappingURL=send-contact.use-case.js.map