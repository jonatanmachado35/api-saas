import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidateSessionUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

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
    };
  }
}
