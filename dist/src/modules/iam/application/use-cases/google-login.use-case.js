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
exports.GoogleLoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../../domain/entities/user.entity");
let GoogleLoginUseCase = class GoogleLoginUseCase {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async execute(input) {
        const googlePayload = await this.verifyGoogleToken(input.google_token);
        if (!googlePayload) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        let user = await this.userRepository.findByGoogleId(googlePayload.sub);
        if (!user) {
            user = await this.userRepository.findByEmail(googlePayload.email);
            if (user) {
                const updatedUser = new user_entity_1.User({
                    email: user.email,
                    password: user.password,
                    googleId: googlePayload.sub,
                    fullName: user.fullName || googlePayload.name,
                    avatarUrl: user.avatarUrl || googlePayload.picture,
                    role: user.role,
                }, user.id);
                await this.userRepository.save(updatedUser);
                user = updatedUser;
            }
            else {
                user = new user_entity_1.User({
                    email: googlePayload.email,
                    googleId: googlePayload.sub,
                    fullName: googlePayload.name,
                    avatarUrl: googlePayload.picture,
                    role: user_entity_1.UserRole.USER,
                });
                await this.userRepository.save(user);
            }
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                user_metadata: {
                    full_name: user.fullName,
                    avatar_url: user.avatarUrl,
                },
            },
            token,
        };
    }
    async verifyGoogleToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded.sub && decoded.email) {
                return decoded;
            }
            return null;
        }
        catch {
            return null;
        }
    }
};
exports.GoogleLoginUseCase = GoogleLoginUseCase;
exports.GoogleLoginUseCase = GoogleLoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], GoogleLoginUseCase);
//# sourceMappingURL=google-login.use-case.js.map