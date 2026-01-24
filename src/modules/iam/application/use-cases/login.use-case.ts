import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';
import { JwtService } from '@nestjs/jwt';

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
}
