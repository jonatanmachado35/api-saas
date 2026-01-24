import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class ValidateSessionUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.fullName,
          avatar_url: user.avatarUrl,
        },
      },
    };
  }
}
