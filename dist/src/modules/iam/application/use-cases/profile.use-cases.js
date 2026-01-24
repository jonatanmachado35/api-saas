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
exports.UpdateProfileUseCase = exports.GetProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../domain/entities/user.entity");
let GetProfileUseCase = class GetProfileUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return {
            id: user.id,
            user_id: user.id,
            full_name: user.fullName,
            avatar_url: user.avatarUrl,
            email: user.email,
            created_at: user.props.createdAt,
            updated_at: user.props.updatedAt,
        };
    }
};
exports.GetProfileUseCase = GetProfileUseCase;
exports.GetProfileUseCase = GetProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object])
], GetProfileUseCase);
let UpdateProfileUseCase = class UpdateProfileUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, input) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const updatedUser = new user_entity_1.User({
            ...user.props,
            fullName: input.full_name ?? user.fullName,
            avatarUrl: input.avatar_url ?? user.avatarUrl,
        }, user.id);
        await this.userRepository.save(updatedUser);
        return {
            success: true,
            profile: {
                id: updatedUser.id,
                user_id: updatedUser.id,
                full_name: updatedUser.fullName,
                avatar_url: updatedUser.avatarUrl,
                email: updatedUser.email,
                created_at: updatedUser.props.createdAt,
                updated_at: new Date(),
            },
        };
    }
};
exports.UpdateProfileUseCase = UpdateProfileUseCase;
exports.UpdateProfileUseCase = UpdateProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object])
], UpdateProfileUseCase);
//# sourceMappingURL=profile.use-cases.js.map