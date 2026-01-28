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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_use_cases_1 = require("../../../application/use-cases/chat.use-cases");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const chat_entity_1 = require("../../../domain/entities/chat.entity");
const chat_dto_1 = require("../dtos/chat.dto");
const current_user_decorator_1 = require("../../../../../core/decorators/current-user.decorator");
let ChatController = class ChatController {
    listUseCase;
    sendUseCase;
    createUseCase;
    listMessagesUseCase;
    clearChatUseCase;
    constructor(listUseCase, sendUseCase, createUseCase, listMessagesUseCase, clearChatUseCase) {
        this.listUseCase = listUseCase;
        this.sendUseCase = sendUseCase;
        this.createUseCase = createUseCase;
        this.listMessagesUseCase = listMessagesUseCase;
        this.clearChatUseCase = clearChatUseCase;
    }
    async list(user) {
        return this.listUseCase.execute(user.id);
    }
    async create(user, body) {
        return this.createUseCase.execute(user.id, body.agent_id, body.title);
    }
    async listMessages(chatId, user) {
        return this.listMessagesUseCase.execute(chatId, user.id);
    }
    async sendMessage(chatId, body, user) {
        return this.sendUseCase.execute(chatId, body.content, chat_entity_1.MessageSender.USER, user.id);
    }
    async clearChat(chatId, user) {
        return this.clearChatUseCase.execute(chatId, user.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar chats do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de chats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo chat com um agente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agente nao encontrado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':chat_id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mensagens de um chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de mensagens do chat' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat nao encontrado' }),
    __param(0, (0, common_1.Param)('chat_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Post)(':chat_id/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar mensagem no chat (consome 1 crédito)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensagem enviada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat nao encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Creditos insuficientes' }),
    __param(0, (0, common_1.Param)('chat_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Delete)(':chat_id/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Limpar todas as mensagens de um chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat limpo com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat nao encontrado' }),
    __param(0, (0, common_1.Param)('chat_id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "clearChat", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_use_cases_1.ListChatsUseCase,
        chat_use_cases_1.SendMessageUseCase,
        chat_use_cases_1.CreateChatUseCase,
        chat_use_cases_1.ListMessagesUseCase,
        chat_use_cases_1.ClearChatUseCase])
], ChatController);
//# sourceMappingURL=chat.controller.js.map