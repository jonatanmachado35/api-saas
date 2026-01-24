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
exports.ListChatsUseCase = exports.SendMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_chat_repository_1 = require("../../infra/repositories/prisma-chat.repository");
const chat_entity_1 = require("../../domain/entities/chat.entity");
let SendMessageUseCase = class SendMessageUseCase {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId, content, sender) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const message = new chat_entity_1.Message({
            chatId,
            content,
            sender,
        });
        await this.chatRepository.saveMessage(message);
        if (sender === chat_entity_1.MessageSender.USER) {
            const agentResponse = new chat_entity_1.Message({
                chatId,
                content: 'Obrigado pela sua mensagem! Como posso ajudar?',
                sender: chat_entity_1.MessageSender.AGENT,
            });
            await this.chatRepository.saveMessage(agentResponse);
            return {
                id: message.id,
                chat_id: message.chatId,
                content: message.content,
                sender: 'user',
                timestamp: message.props.timestamp || new Date(),
                agent_response: {
                    id: agentResponse.id,
                    content: agentResponse.content,
                    sender: 'agent',
                    timestamp: agentResponse.props.timestamp || new Date(),
                },
            };
        }
        return {
            id: message.id,
            chat_id: message.chatId,
            content: message.content,
            sender: sender.toLowerCase(),
            timestamp: message.props.timestamp || new Date(),
        };
    }
};
exports.SendMessageUseCase = SendMessageUseCase;
exports.SendMessageUseCase = SendMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository])
], SendMessageUseCase);
let ListChatsUseCase = class ListChatsUseCase {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId) {
        const chats = await this.chatRepository.findByUserIdWithLastMessage(userId);
        return chats;
    }
};
exports.ListChatsUseCase = ListChatsUseCase;
exports.ListChatsUseCase = ListChatsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository])
], ListChatsUseCase);
//# sourceMappingURL=chat.use-cases.js.map