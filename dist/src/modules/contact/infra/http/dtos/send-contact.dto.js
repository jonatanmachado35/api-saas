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
exports.SendContactDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendContactDto {
    name;
    email;
    company;
    subject;
    message;
}
exports.SendContactDto = SendContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nome', description: 'Nome do remetente (2-100 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter no minimo 2 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nome deve ter no maximo 100 caracteres' }),
    __metadata("design:type", String)
], SendContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'email@exemplo.com', description: 'Email do remetente' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email invalido' }),
    __metadata("design:type", String)
], SendContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Empresa XYZ', description: 'Nome da empresa (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SendContactDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Assunto da mensagem', description: 'Assunto (5-200 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'Assunto deve ter no minimo 5 caracteres' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Assunto deve ter no maximo 200 caracteres' }),
    __metadata("design:type", String)
], SendContactDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Conteudo da mensagem...', description: 'Mensagem (10-2000 caracteres)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Mensagem deve ter no minimo 10 caracteres' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Mensagem deve ter no maximo 2000 caracteres' }),
    __metadata("design:type", String)
], SendContactDto.prototype, "message", void 0);
//# sourceMappingURL=send-contact.dto.js.map