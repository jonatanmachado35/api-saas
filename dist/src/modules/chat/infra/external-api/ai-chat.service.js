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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let AiChatService = class AiChatService {
    configService;
    aiApiUrl;
    constructor(configService) {
        this.configService = configService;
        this.aiApiUrl = this.configService.get('AI_API_URL') || 'https://api-ia-rt8v.onrender.com';
    }
    async sendMessage(request) {
        try {
            const response = await axios_1.default.post(`${this.aiApiUrl}/chat`, request, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 429) {
                    const detail = error.response.data?.detail;
                    if (detail && detail.includes('Limite de créditos')) {
                        throw new common_1.HttpException('Os créditos da API acabaram. Tente novamente mais tarde.', common_1.HttpStatus.TOO_MANY_REQUESTS);
                    }
                }
                throw new common_1.HttpException(`AI API error: ${error.response.data?.message || error.response.data?.detail || 'Unknown error'}`, error.response.status);
            }
            else if (error.request) {
                throw new common_1.HttpException('AI API não respondeu. Tente novamente mais tarde.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            else {
                throw new common_1.HttpException('Erro ao se comunicar com a AI API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.AiChatService = AiChatService;
exports.AiChatService = AiChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiChatService);
//# sourceMappingURL=ai-chat.service.js.map