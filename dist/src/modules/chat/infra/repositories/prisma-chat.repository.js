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
exports.PrismaChatRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const chat_entity_1 = require("../../domain/entities/chat.entity");
let PrismaChatRepository = class PrismaChatRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(chat) {
        const data = {
            id: chat.id,
            user_id: chat.userId,
            agent_id: chat.agentId,
            title: chat.title,
        };
        await this.prisma.chat.upsert({
            where: { id: chat.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const chat = await this.prisma.chat.findUnique({ where: { id } });
        if (!chat)
            return null;
        return new chat_entity_1.Chat({
            userId: chat.user_id,
            agentId: chat.agent_id,
            title: chat.title,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
        }, chat.id);
    }
    async findByUserId(userId) {
        const chats = await this.prisma.chat.findMany({
            where: { user_id: userId },
            orderBy: { updated_at: 'desc' },
        });
        return chats.map((chat) => new chat_entity_1.Chat({
            userId: chat.user_id,
            agentId: chat.agent_id,
            title: chat.title,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
        }, chat.id));
    }
    async findByUserIdWithLastMessage(userId) {
        const chats = await this.prisma.chat.findMany({
            where: { user_id: userId },
            include: {
                messages: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updated_at: 'desc' },
        });
        return chats.map((chat) => ({
            id: chat.id,
            user_id: chat.user_id,
            agent_id: chat.agent_id,
            title: chat.title,
            last_message: chat.messages[0]?.content || null,
            unread: chat.unread,
            created_at: chat.created_at,
        }));
    }
    async saveMessage(message) {
        await this.prisma.message.create({
            data: {
                id: message.id,
                chat_id: message.chatId,
                content: message.content,
                sender: message.sender,
            },
        });
        await this.prisma.chat.update({
            where: { id: message.chatId },
            data: { updated_at: new Date() },
        });
    }
    async findMessagesByChatId(chatId) {
        const messages = await this.prisma.message.findMany({
            where: { chat_id: chatId },
            orderBy: { timestamp: 'asc' },
        });
        return messages.map((m) => new chat_entity_1.Message({
            chatId: m.chat_id,
            content: m.content,
            sender: m.sender,
            timestamp: m.timestamp,
        }, m.id));
    }
};
exports.PrismaChatRepository = PrismaChatRepository;
exports.PrismaChatRepository = PrismaChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaChatRepository);
//# sourceMappingURL=prisma-chat.repository.js.map