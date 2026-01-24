import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    return {
      id: user.id,
      user_id: user.id,
      full_name: user.fullName,
      avatar_url: user.avatarUrl,
      email: user.email,
      created_at: user.props.createdAt,
      updated_at: user.props.updatedAt,
    };
  }
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, input: UpdateProfileInput) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Profile not found');
    }

    const updatedUser = new User(
      {
        ...user.props,
        fullName: input.full_name ?? user.fullName,
        avatarUrl: input.avatar_url ?? user.avatarUrl,
      },
      user.id,
    );

    await this.userRepository.save(updatedUser);

    return {
      success: true,
      profile: {
        id: updatedUser.id,
        user_id: updatedUser.id,
        full_name: updatedUser.fullName,
        avatar_url: updatedUser.avatarUrl,
        email: updatedUser.email,
        created_at: updatedUser.props.createdAt,
        updated_at: new Date(),
      },
    };
  }
}
