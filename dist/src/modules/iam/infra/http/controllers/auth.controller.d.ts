import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { GoogleLoginUseCase } from '../../../application/use-cases/google-login.use-case';
import { ValidateSessionUseCase } from '../../../application/use-cases/validate-session.use-case';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto, GoogleLoginDto } from '../dtos/login.dto';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly googleLoginUseCase;
    private readonly validateSessionUseCase;
    constructor(registerUseCase: RegisterUserUseCase, loginUseCase: LoginUseCase, googleLoginUseCase: GoogleLoginUseCase, validateSessionUseCase: ValidateSessionUseCase);
    me(req: any): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../../domain/entities/user.entity").UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
    }>;
    register(body: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../../domain/entities/user.entity").UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
        token: string;
    }>;
    login(body: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../../domain/entities/user.entity").UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
        token: string;
    }>;
    googleLogin(body: GoogleLoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../../../domain/entities/user.entity").UserRole;
            plan: import(".prisma/client").$Enums.Plan;
            user_metadata: {
                full_name: string | null | undefined;
                avatar_url: string | null | undefined;
            };
        };
        token: string;
    }>;
    logout(): Promise<{
        success: boolean;
    }>;
}
