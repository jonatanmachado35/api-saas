import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const users = await this.prisma.user.findMany({
      include: { subscription: true },
      orderBy: { created_at: 'desc' },
    });

    return users.map((u) => ({
      id: u.id,
      user_id: u.id,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      created_at: u.created_at,
      role: u.role.toLowerCase(),
      plan: u.subscription?.plan.toLowerCase() || null,
      status: u.subscription?.status.toLowerCase() || null,
      credits: u.subscription?.credits || 0,
    }));
  }
}

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, role: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roleValue = role === 'none' ? 'USER' : role.toUpperCase();

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: roleValue as any },
    });
  }
}
