import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository.interface';
import { Plan as PrismaPlan, SubscriptionStatus as PrismaStatus } from '@prisma/client';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(sub: any): Subscription {
    return new Subscription(
      {
        userId: sub.user_id,
        plan: sub.plan as SubscriptionPlan,
        status: sub.status as SubscriptionStatus,
        credits: sub.credits,
        createdAt: sub.created_at,
        updatedAt: sub.updated_at,
      },
      sub.id,
    );
  }

  async save(subscription: Subscription): Promise<void> {
    const data = {
      id: subscription.id,
      user_id: subscription.userId,
      plan: subscription.plan as PrismaPlan,
      status: subscription.status as PrismaStatus,
      credits: subscription.credits,
    };

    await this.prisma.subscription.upsert({
      where: { id: subscription.id },
      update: {
        plan: data.plan,
        status: data.status,
        credits: data.credits,
      },
      create: data,
    });
  }

  async findById(id: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { id } });
    if (!sub) return null;
    return this.toDomain(sub);
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { user_id: userId } });
    if (!sub) return null;
    return this.toDomain(sub);
  }

  async findAll(): Promise<Subscription[]> {
    const subs = await this.prisma.subscription.findMany({
      orderBy: { created_at: 'desc' },
    });
    return subs.map((s) => this.toDomain(s));
  }

  async findAllWithUsers(): Promise<any[]> {
    const subs = await this.prisma.subscription.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' },
    });
    return subs.map((s) => ({
      id: s.id,
      user_id: s.user_id,
      plan: s.plan.toLowerCase(),
      status: s.status.toLowerCase(),
      credits: s.credits,
      owner_name: s.user.full_name,
      owner_email: s.user.email,
      created_at: s.created_at,
    }));
  }
}
