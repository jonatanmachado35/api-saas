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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_user_use_case_1 = require("../../../application/use-cases/register-user.use-case");
const login_use_case_1 = require("../../../application/use-cases/login.use-case");
const google_login_use_case_1 = require("../../../application/use-cases/google-login.use-case");
const validate_session_use_case_1 = require("../../../application/use-cases/validate-session.use-case");
const jwt_auth_guard_1 = require("../../security/jwt-auth.guard");
const register_dto_1 = require("../dtos/register.dto");
const login_dto_1 = require("../dtos/login.dto");
let AuthController = class AuthController {
    registerUseCase;
    loginUseCase;
    googleLoginUseCase;
    validateSessionUseCase;
    constructor(registerUseCase, loginUseCase, googleLoginUseCase, validateSessionUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.googleLoginUseCase = googleLoginUseCase;
        this.validateSessionUseCase = validateSessionUseCase;
    }
    async me(req) {
        return this.validateSessionUseCase.execute(req.user.id);
    }
    async register(body) {
        return this.registerUseCase.execute(body);
    }
    async login(body) {
        return this.loginUseCase.execute(body);
    }
    async googleLogin(body) {
        return this.googleLoginUseCase.execute(body);
    }
    async logout() {
        return { success: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validar sessao do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sessao valida' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token invalido ou expirado' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar novo usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email ja cadastrado ou senha muito curta' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login realizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email ou senha incorretos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('google'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login com Google' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login realizado com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Logout do usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout realizado com sucesso' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_user_use_case_1.RegisterUserUseCase,
        login_use_case_1.LoginUseCase,
        google_login_use_case_1.GoogleLoginUseCase,
        validate_session_use_case_1.ValidateSessionUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map