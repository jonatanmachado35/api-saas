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
exports.CreateAgentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const agent_entity_1 = require("../../../domain/entities/agent.entity");
class CreateAgentDto {
    user_id;
    name;
    avatar;
    description;
    prompt;
    category;
    type;
    tone;
    style;
    focus;
    rules;
    visibility;
}
exports.CreateAgentDto = CreateAgentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Meu Agente', description: 'Nome do agente' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '🤖', description: 'Emoji ou icone do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Descricao do agente', description: 'Descricao do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Voce e um assistente prestativo...', description: 'Prompt do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Atendimento', description: 'Categoria do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Assistente Virtual', description: 'Tipo do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Profissional', description: 'Tom de voz do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "tone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Formal', description: 'Estilo de comunicacao do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Suporte tecnico', description: 'Foco principal do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "focus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sempre seja educado...', description: 'Regras de comportamento do agente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: agent_entity_1.AgentVisibility,
        example: agent_entity_1.AgentVisibility.PRIVATE,
        description: 'Visibilidade do agente: PRIVATE (apenas criador), PREMIUM (usuarios pagantes), ADMIN_ONLY (apenas admins)'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(agent_entity_1.AgentVisibility),
    __metadata("design:type", String)
], CreateAgentDto.prototype, "visibility", void 0);
//# sourceMappingURL=create-agent.dto.js.map