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
exports.CreateChatDto = exports.SendMessageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendMessageDto {
    content;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ola, como posso ajudar?', description: 'Conteudo da mensagem' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: 'Mensagem nao pode ser vazia' }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Mensagem muito longa' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
class CreateChatDto {
    agent_id;
    title;
}
exports.CreateChatDto = CreateChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-agente', description: 'ID do agente' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "agent_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Conversa sobre IA', description: 'Titulo do chat' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateChatDto.prototype, "title", void 0);
//# sourceMappingURL=chat.dto.js.map