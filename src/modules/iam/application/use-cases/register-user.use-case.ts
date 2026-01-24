import { Injectable, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../domain/entities/user.entity';
import { BcryptHasher } from '../../infra/hashing/bcrypt.hasher';

export interface RegisterUserInput {
  email: string;
  password: string;
  full_name: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly hasher: BcryptHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterUserInput) {
    if (!input.password || input.password.length < 6) {
      throw new BadRequestException('Password must have at least 6 characters');
    }

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hasher.hash(input.password);

    const user = new User({
      email: input.email,
      password: hashedPassword,
      fullName: input.full_name,
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
