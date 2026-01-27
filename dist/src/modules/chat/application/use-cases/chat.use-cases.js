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
exports.ClearChatUseCase = exports.CreateChatUseCase = exports.ListMessagesUseCase = exports.ListChatsUseCase = exports.SendMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_chat_repository_1 = require("../../infra/repositories/prisma-chat.repository");
const chat_entity_1 = require("../../domain/entities/chat.entity");
const ai_chat_service_1 = require("../../infra/external-api/ai-chat.service");
let SendMessageUseCase = class SendMessageUseCase {
    chatRepository;
    agentRepository;
    aiChatService;
    constructor(chatRepository, agentRepository, aiChatService) {
        this.chatRepository = chatRepository;
        this.agentRepository = agentRepository;
        this.aiChatService = aiChatService;
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
            const agent = await this.agentRepository.findById(chat.agentId);
            if (!agent) {
                throw new common_1.NotFoundException('Agent not found');
            }
            const rules = agent.rules ? agent.rules.split('\n').filter(r => r.trim()) : [];
            const aiResponse = await this.aiChatService.sendMessage({
                message: content,
                agent: {
                    type: agent.type || 'general',
                    persona: {
                        tone: agent.tone || 'professional',
                        style: agent.style || 'formal',
                        focus: agent.focus || 'general',
                    },
                    rules,
                },
            });
            const agentMessage = aiResponse.response || aiResponse.message || 'Desculpe, não consegui processar sua mensagem.';
            const agentResponse = new chat_entity_1.Message({
                chatId,
                content: agentMessage,
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
    __param(1, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository, Object, ai_chat_service_1.AiChatService])
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
let ListMessagesUseCase = class ListMessagesUseCase {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId, userId) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        if (chat.userId !== userId) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const messages = await this.chatRepository.findMessagesByChatId(chatId);
        return messages.map(m => ({
            id: m.id,
            chat_id: m.chatId,
            content: m.content,
            sender: m.sender.toLowerCase(),
            timestamp: m.props.timestamp || new Date(),
        }));
    }
};
exports.ListMessagesUseCase = ListMessagesUseCase;
exports.ListMessagesUseCase = ListMessagesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository])
], ListMessagesUseCase);
let CreateChatUseCase = class CreateChatUseCase {
    chatRepository;
    agentRepository;
    constructor(chatRepository, agentRepository) {
        this.chatRepository = chatRepository;
        this.agentRepository = agentRepository;
    }
    async execute(userId, agentId, title) {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        const chat = await this.chatRepository.createChat(userId, agentId, title);
        return {
            id: chat.id,
            user_id: chat.userId,
            agent_id: chat.agentId,
            title: chat.title,
            created_at: chat.props.createdAt,
            updated_at: chat.props.updatedAt,
        };
    }
};
exports.CreateChatUseCase = CreateChatUseCase;
exports.CreateChatUseCase = CreateChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('AgentRepository')),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository, Object])
], CreateChatUseCase);
let ClearChatUseCase = class ClearChatUseCase {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId, userId) {
        const chat = await this.chatRepository.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        if (chat.userId !== userId) {
            throw new common_1.NotFoundException('Chat not found');
        }
        await this.chatRepository.deleteMessagesByChatId(chatId);
        return {
            message: 'Chat cleared successfully',
        };
    }
};
exports.ClearChatUseCase = ClearChatUseCase;
exports.ClearChatUseCase = ClearChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_chat_repository_1.PrismaChatRepository])
], ClearChatUseCase);
//# sourceMappingURL=chat.use-cases.js.map