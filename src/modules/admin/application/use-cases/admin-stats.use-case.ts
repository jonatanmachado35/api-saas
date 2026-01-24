import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetAdminStatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const totalUsers = await this.prisma.user.count();
    const totalAgents = await this.prisma.agent.count();
    const totalSubscriptions = await this.prisma.subscription.count();
    const proSubscriptions = await this.prisma.subscription.count({
      where: { plan: 'PRO' },
    });

    return {
      total_users: totalUsers,
      total_agents: totalAgents,
      total_subscriptions: totalSubscriptions,
      pro_subscriptions: proSubscriptions,
    };
  }
}
