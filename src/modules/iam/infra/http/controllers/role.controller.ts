import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  @Get(':user_id/role')
  async getRole(@Param('user_id') userId: string) {
    const user = await this.userRepository.findById(userId);
    return {
      role: user?.role.toLowerCase() || null,
    };
  }
}
