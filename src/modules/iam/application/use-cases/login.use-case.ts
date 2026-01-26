import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly hasher: BcryptHasher,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hasher.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Buscar subscription do usuario
    const subscription = await this.prisma.subscription.findUnique({
      where: { user_id: user.id },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: subscription?.plan || 'FREE',
        user_metadata: {
          full_name: user.fullName,
          avatar_url: user.avatarUrl,
        },
      },
      token,
    };
  }
}
