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
exports.GitHubLoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../../prisma/prisma.service");
let GitHubLoginUseCase = class GitHubLoginUseCase {
    userRepository;
    jwtService;
    prisma;
    constructor(userRepository, jwtService, prisma) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async execute(input) {
        const githubPayload = await this.verifyGitHubToken(input.github_token);
        if (!githubPayload) {
            throw new common_1.UnauthorizedException('Invalid GitHub token');
        }
        let user = await this.userRepository.findByGithubId(githubPayload.id);
        if (!user) {
            user = await this.userRepository.findByEmail(githubPayload.email);
            if (user) {
                const updatedUser = new user_entity_1.User({
                    email: user.email,
                    password: user.password,
                    googleId: user.googleId,
                    githubId: githubPayload.id,
                    fullName: user.fullName || githubPayload.name,
                    avatarUrl: user.avatarUrl || githubPayload.avatar_url,
                    role: user.role,
                }, user.id);
                await this.userRepository.save(updatedUser);
                user = updatedUser;
            }
            else {
                user = new user_entity_1.User({
                    email: githubPayload.email,
                    githubId: githubPayload.id,
                    fullName: githubPayload.name,
                    avatarUrl: githubPayload.avatar_url,
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
        const subscription = await this.prisma.subscription.findUnique({
            where: { user_id: user.id },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.fullName,
                avatar_url: user.avatarUrl,
                role: user.role,
                plan: subscription?.plan || 'FREE',
            },
            token,
        };
    }
    async verifyGitHubToken(token) {
        try {
            const axios = require('axios');
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            let email = userResponse.data.email;
            if (!email) {
                const emailsResponse = await axios.get('https://api.github.com/user/emails', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });
                const primaryEmail = emailsResponse.data.find((e) => e.primary);
                email = primaryEmail?.email || emailsResponse.data[0]?.email;
            }
            if (!email) {
                throw new common_1.UnauthorizedException('GitHub account must have a verified email');
            }
            return {
                id: userResponse.data.id.toString(),
                login: userResponse.data.login,
                email,
                name: userResponse.data.name,
                avatar_url: userResponse.data.avatar_url,
            };
        }
        catch (error) {
            console.error('GitHub token verification failed:', error);
            return null;
        }
    }
};
exports.GitHubLoginUseCase = GitHubLoginUseCase;
exports.GitHubLoginUseCase = GitHubLoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        prisma_service_1.PrismaService])
], GitHubLoginUseCase);
//# sourceMappingURL=github-login.use-case.js.map