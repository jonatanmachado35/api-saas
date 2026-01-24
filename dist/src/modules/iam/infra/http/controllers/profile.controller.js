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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const profile_use_cases_1 = require("../../../application/use-cases/profile.use-cases");
const jwt_auth_guard_1 = require("../../security/jwt-auth.guard");
const cloudinary_service_1 = require("../../../../shared/infra/cloudinary/cloudinary.service");
const update_profile_dto_1 = require("../dtos/update-profile.dto");
let ProfileController = class ProfileController {
    getProfileUseCase;
    updateProfileUseCase;
    cloudinaryService;
    constructor(getProfileUseCase, updateProfileUseCase, cloudinaryService) {
        this.getProfileUseCase = getProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.cloudinaryService = cloudinaryService;
    }
    async getProfile(userId) {
        return this.getProfileUseCase.execute(userId);
    }
    async updateProfile(userId, body) {
        return this.updateProfileUseCase.execute(userId, body);
    }
    async uploadAvatar(userId, file) {
        const result = await this.cloudinaryService.uploadImage(file, 'avatars');
        await this.updateProfileUseCase.execute(userId, {
            avatar_url: result.secure_url,
        });
        return {
            url: result.secure_url,
        };
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(':user_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter perfil do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados do perfil' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario nao encontrado' }),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(':user_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar perfil do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario nao encontrado' }),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)(':user_id/avatar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer upload de avatar' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagem do avatar (JPEG, PNG, GIF, WEBP - max 5MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Arquivo invalido' }),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadAvatar", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Profiles'),
    (0, common_1.Controller)('profiles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [profile_use_cases_1.GetProfileUseCase,
        profile_use_cases_1.UpdateProfileUseCase,
        cloudinary_service_1.CloudinaryService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map