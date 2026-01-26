import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BcryptHasher } from './infra/hashing/bcrypt.hasher';
import { PrismaUserRepository } from './infra/repositories/prisma-user.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GoogleLoginUseCase } from './application/use-cases/google-login.use-case';
import { GitHubLoginUseCase } from './application/use-cases/github-login.use-case';
import { AuthController } from './infra/http/controllers/auth.controller';
import { JwtStrategy } from './infra/security/jwt.strategy';
import { ValidateSessionUseCase } from './application/use-cases/validate-session.use-case';
import { GetProfileUseCase, UpdateProfileUseCase } from './application/use-cases/profile.use-cases';
import { ProfileController } from './infra/http/controllers/profile.controller';
import { RoleController } from './infra/http/controllers/role.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController, ProfileController, RoleController],
  providers: [
    BcryptHasher,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    RegisterUserUseCase,
    LoginUseCase,
    GoogleLoginUseCase,
    GitHubLoginUseCase,
    ValidateSessionUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    JwtStrategy,
  ],
  exports: [
    'UserRepository',
    BcryptHasher,
    JwtModule,
    RegisterUserUseCase,
    LoginUseCase,
    GoogleLoginUseCase,
    GitHubLoginUseCase,
    ValidateSessionUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    JwtStrategy,
  ],
})
export class IamModule {}
