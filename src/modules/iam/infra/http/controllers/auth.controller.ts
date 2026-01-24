import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { GoogleLoginUseCase } from '../../../application/use-cases/google-login.use-case';
import { ValidateSessionUseCase } from '../../../application/use-cases/validate-session.use-case';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto, GoogleLoginDto } from '../dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly validateSessionUseCase: ValidateSessionUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar sessao do usuario' })
  @ApiResponse({ status: 200, description: 'Sessao valida' })
  @ApiResponse({ status: 401, description: 'Token invalido ou expirado' })
  async me(@Req() req: any) {
    return this.validateSessionUseCase.execute(req.user.id);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email ja cadastrado ou senha muito curta' })
  async register(@Body() body: RegisterDto) {
    const { user, token } = await this.registerUseCase.execute(body);
    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.fullName,
        },
      },
      token,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do usuario' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Email ou senha incorretos' })
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com Google' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  async googleLogin(@Body() body: GoogleLoginDto) {
    return this.googleLoginUseCase.execute(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout do usuario' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  async logout() {
    return { success: true };
  }
}
