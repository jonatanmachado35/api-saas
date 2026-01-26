import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../prisma/prisma.service';

export interface GoogleLoginInput {
  google_token: string;
}

interface GooglePayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: GoogleLoginInput) {
    const googlePayload = await this.verifyGoogleToken(input.google_token);
    if (!googlePayload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    let user = await this.userRepository.findByGoogleId(googlePayload.sub);

    if (!user) {
      user = await this.userRepository.findByEmail(googlePayload.email);

      if (user) {
        // Link existing user with Google account
        const updatedUser = new User(
          {
            email: user.email,
            password: user.password,
            googleId: googlePayload.sub,
            fullName: user.fullName || googlePayload.name,
            avatarUrl: user.avatarUrl || googlePayload.picture,
            role: user.role,
          },
          user.id,
        );
        await this.userRepository.save(updatedUser);
        user = updatedUser;
      } else {
        // Create new user
        user = new User({
          email: googlePayload.email,
          googleId: googlePayload.sub,
          fullName: googlePayload.name,
          avatarUrl: googlePayload.picture,
          role: UserRole.USER,
        });
        await this.userRepository.save(user);
      }
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Buscar subscription do usuario
    const subscription = await this.prisma.subscription.findUnique({
      where: { user_id: user.id },
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

  private async verifyGoogleToken(token: string): Promise<GooglePayload | null> {
    try {
      // In production, verify the token with Google's API
      // For now, we decode the JWT token (Google ID tokens are JWTs)
      // In a real implementation, you should use google-auth-library
      const decoded = this.jwtService.decode(token) as GooglePayload;
      if (decoded && decoded.sub && decoded.email) {
        return decoded;
      }
      return null;
    } catch {
      return null;
    }
  }
}
