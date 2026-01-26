"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_chat_repository_1 = require("./infra/repositories/prisma-chat.repository");
const chat_controller_1 = require("./infra/http/controllers/chat.controller");
const chat_use_cases_1 = require("./application/use-cases/chat.use-cases");
const iam_module_1 = require("../iam/iam.module");
const ai_chat_service_1 = require("./infra/external-api/ai-chat.service");
const agents_module_1 = require("../agents/agents.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule, agents_module_1.AgentsModule],
        controllers: [chat_controller_1.ChatController],
        providers: [
            prisma_chat_repository_1.PrismaChatRepository,
            chat_use_cases_1.ListChatsUseCase,
            chat_use_cases_1.SendMessageUseCase,
            ai_chat_service_1.AiChatService,
        ],
        exports: [prisma_chat_repository_1.PrismaChatRepository],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map