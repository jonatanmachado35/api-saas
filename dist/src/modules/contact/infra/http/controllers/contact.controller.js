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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const send_contact_use_case_1 = require("../../../application/use-cases/send-contact.use-case");
const send_contact_dto_1 = require("../dtos/send-contact.dto");
let ContactController = class ContactController {
    sendContactUseCase;
    constructor(sendContactUseCase) {
        this.sendContactUseCase = sendContactUseCase;
    }
    async sendContact(body) {
        return this.sendContactUseCase.execute(body);
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar formulario de contato' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensagem enviada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados invalidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_contact_dto_1.SendContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "sendContact", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('Contact'),
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [send_contact_use_case_1.SendContactUseCase])
], ContactController);
//# sourceMappingURL=contact.controller.js.map