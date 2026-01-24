import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ListAdminSubscriptionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const subs = await this.prisma.subscription.findMany({
      include: { user: true },
    });

    const usersWithoutSub = await this.prisma.user.findMany({
      where: { subscription: null },
    });

    return {
      subscriptions: subs.map((s) => ({
        id: s.id,
        user_id: s.user_id,
        plan: s.plan.toLowerCase(),
        status: s.status.toLowerCase(),
        credits: s.credits,
        owner_name: s.user.full_name,
        owner_email: s.user.email,
        created_at: s.created_at,
      })),
      users_without_subscription: usersWithoutSub.map((u) => ({
        user_id: u.id,
        full_name: u.full_name,
      })),
    };
  }
}

export interface CreateAdminSubscriptionInput {
  user_id: string;
  plan: string;
  status?: string;
  credits?: number;
}

@Injectable()
export class CreateAdminSubscriptionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateAdminSubscriptionInput) {
    const existingSub = await this.prisma.subscription.findUnique({
      where: { user_id: input.user_id },
    });

    if (existingSub) {
      throw new BadRequestException('User already has a subscription');
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: input.user_id,
        plan: input.plan.toUpperCase() as any,
        status: (input.status?.toUpperCase() || 'ACTIVE') as any,
        credits: input.credits ?? 50,
      },
    });

    return {
      subscription: {
        id: subscription.id,
        user_id: subscription.user_id,
        plan: subscription.plan.toLowerCase(),
        status: subscription.status.toLowerCase(),
        credits: subscription.credits,
      },
      success: true,
    };
  }
}

export interface UpdateAdminSubscriptionInput {
  plan?: string;
  status?: string;
  credits?: number;
}

@Injectable()
export class UpdateAdminSubscriptionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(subscriptionId: string, input: UpdateAdminSubscriptionInput) {
    const existingSub = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSub) {
      throw new NotFoundException('Subscription not found');
    }

    const subscription = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        ...(input.plan && { plan: input.plan.toUpperCase() as any }),
        ...(input.status && { status: input.status.toUpperCase() as any }),
        ...(input.credits !== undefined && { credits: input.credits }),
      },
    });

    return {
      subscription: {
        id: subscription.id,
        user_id: subscription.user_id,
        plan: subscription.plan.toLowerCase(),
        status: subscription.status.toLowerCase(),
        credits: subscription.credits,
      },
      success: true,
    };
  }
}

@Injectable()
export class ListAllAgentsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const agents = await this.prisma.agent.findMany({
      include: { user: true },
    });

    const users = await this.prisma.user.findMany({
      select: { id: true, full_name: true },
    });

    return {
      agents: agents.map((a) => ({
        id: a.id,
        user_id: a.user_id,
        name: a.name,
        avatar: a.avatar,
        description: a.description,
        owner_name: a.user.full_name,
        created_at: a.created_at,
      })),
      users: users.map((u) => ({
        user_id: u.id,
        full_name: u.full_name,
      })),
    };
  }
}

export interface CreateAdminAgentInput {
  user_id: string;
  name: string;
  avatar?: string;
  description?: string;
}

@Injectable()
export class CreateAdminAgentUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateAdminAgentInput) {
    const agent = await this.prisma.agent.create({
      data: {
        user_id: input.user_id,
        name: input.name,
        avatar: input.avatar,
        description: input.description,
      },
    });

    return {
      agent: {
        id: agent.id,
        user_id: agent.user_id,
        name: agent.name,
        avatar: agent.avatar,
        description: agent.description,
        created_at: agent.created_at,
      },
      success: true,
    };
  }
}

@Injectable()
export class DeleteAdminAgentUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(agentId: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    await this.prisma.agent.delete({
      where: { id: agentId },
    });

    return { success: true };
  }
}
