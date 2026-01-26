"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt_hasher_1 = require("./infra/hashing/bcrypt.hasher");
const prisma_user_repository_1 = require("./infra/repositories/prisma-user.repository");
const register_user_use_case_1 = require("./application/use-cases/register-user.use-case");
const login_use_case_1 = require("./application/use-cases/login.use-case");
const google_login_use_case_1 = require("./application/use-cases/google-login.use-case");
const github_login_use_case_1 = require("./application/use-cases/github-login.use-case");
const auth_controller_1 = require("./infra/http/controllers/auth.controller");
const jwt_strategy_1 = require("./infra/security/jwt.strategy");
const validate_session_use_case_1 = require("./application/use-cases/validate-session.use-case");
const profile_use_cases_1 = require("./application/use-cases/profile.use-cases");
const profile_controller_1 = require("./infra/http/controllers/profile.controller");
const role_controller_1 = require("./infra/http/controllers/role.controller");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') || 'secret',
                    signOptions: { expiresIn: '7d' },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController, profile_controller_1.ProfileController, role_controller_1.RoleController],
        providers: [
            bcrypt_hasher_1.BcryptHasher,
            {
                provide: 'UserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            register_user_use_case_1.RegisterUserUseCase,
            login_use_case_1.LoginUseCase,
            google_login_use_case_1.GoogleLoginUseCase,
            github_login_use_case_1.GitHubLoginUseCase,
            validate_session_use_case_1.ValidateSessionUseCase,
            profile_use_cases_1.GetProfileUseCase,
            profile_use_cases_1.UpdateProfileUseCase,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [
            'UserRepository',
            bcrypt_hasher_1.BcryptHasher,
            jwt_1.JwtModule,
            register_user_use_case_1.RegisterUserUseCase,
            login_use_case_1.LoginUseCase,
            google_login_use_case_1.GoogleLoginUseCase,
            github_login_use_case_1.GitHubLoginUseCase,
            validate_session_use_case_1.ValidateSessionUseCase,
            profile_use_cases_1.GetProfileUseCase,
            profile_use_cases_1.UpdateProfileUseCase,
            jwt_strategy_1.JwtStrategy,
        ],
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map