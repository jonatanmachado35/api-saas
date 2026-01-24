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
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_hasher_1 = require("../../infra/hashing/bcrypt.hasher");
const jwt_1 = require("@nestjs/jwt");
let LoginUseCase = class LoginUseCase {
    userRepository;
    hasher;
    jwtService;
    constructor(userRepository, hasher, jwtService) {
        this.userRepository = userRepository;
        this.hasher = hasher;
        this.jwtService = jwtService;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.hasher.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, bcrypt_hasher_1.BcryptHasher,
        jwt_1.JwtService])
], LoginUseCase);
//# sourceMappingURL=login.use-case.js.map