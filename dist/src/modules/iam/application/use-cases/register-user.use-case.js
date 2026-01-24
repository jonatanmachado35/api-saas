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
exports.RegisterUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../../domain/entities/user.entity");
const bcrypt_hasher_1 = require("../../infra/hashing/bcrypt.hasher");
let RegisterUserUseCase = class RegisterUserUseCase {
    userRepository;
    hasher;
    jwtService;
    constructor(userRepository, hasher, jwtService) {
        this.userRepository = userRepository;
        this.hasher = hasher;
        this.jwtService = jwtService;
    }
    async execute(input) {
        if (!input.password || input.password.length < 6) {
            throw new common_1.BadRequestException('Password must have at least 6 characters');
        }
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await this.hasher.hash(input.password);
        const user = new user_entity_1.User({
            email: input.email,
            password: hashedPassword,
            fullName: input.full_name,
            role: user_entity_1.UserRole.USER,
        });
        await this.userRepository.save(user);
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, bcrypt_hasher_1.BcryptHasher,
        jwt_1.JwtService])
], RegisterUserUseCase);
//# sourceMappingURL=register-user.use-case.js.map