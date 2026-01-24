import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository.interface';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../domain/entities/subscription.entity';

// Credit packages configuration
const CREDIT_PACKAGES: Record<string, { credits: number; bonus: number }> = {
  starter: { credits: 100, bonus: 0 },
  popular: { credits: 500, bonus: 50 },
  pro: { credits: 1000, bonus: 150 },
  enterprise: { credits: 5000, bonus: 1000 },
};

@Injectable()
export class GetSubscriptionUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(userId: string) {
    const sub = await this.subscriptionRepository.findByUserId(userId);
    if (!sub) {
      return null;
    }

    return {
      id: sub.id,
      user_id: sub.userId,
      plan: sub.plan.toLowerCase(),
      status: sub.status.toLowerCase(),
      credits: sub.credits,
      created_at: sub.props.createdAt,
      updated_at: sub.props.updatedAt,
    };
  }
}

@Injectable()
export class UpgradePlanUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(userId: string, plan: string) {
    const sub = await this.subscriptionRepository.findByUserId(userId);
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    const newPlan = plan.toUpperCase() as SubscriptionPlan;
    if (!Object.values(SubscriptionPlan).includes(newPlan)) {
      throw new BadRequestException('Invalid plan');
    }

    const additionalCredits = newPlan === SubscriptionPlan.PRO ? 500 : 0;

    const updatedSub = new Subscription(
      {
        ...sub.props,
        plan: newPlan,
        credits: sub.credits + additionalCredits,
      },
      sub.id,
    );

    await this.subscriptionRepository.save(updatedSub);

    return {
      subscription: {
        id: updatedSub.id,
        user_id: updatedSub.userId,
        plan: updatedSub.plan.toLowerCase(),
        status: updatedSub.status.toLowerCase(),
        credits: updatedSub.credits,
      },
      success: true,
    };
  }
}

@Injectable()
export class DowngradePlanUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(userId: string) {
    const sub = await this.subscriptionRepository.findByUserId(userId);
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    const updatedSub = new Subscription(
      {
        ...sub.props,
        plan: SubscriptionPlan.FREE,
      },
      sub.id,
    );

    await this.subscriptionRepository.save(updatedSub);

    return {
      subscription: {
        id: updatedSub.id,
        user_id: updatedSub.userId,
        plan: updatedSub.plan.toLowerCase(),
        status: updatedSub.status.toLowerCase(),
        credits: updatedSub.credits,
      },
      success: true,
    };
  }
}

@Injectable()
export class PurchaseCreditsUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(userId: string, packageId: string) {
    const sub = await this.subscriptionRepository.findByUserId(userId);
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    const creditPackage = CREDIT_PACKAGES[packageId];
    if (!creditPackage) {
      throw new BadRequestException('Invalid package');
    }

    const totalCreditsToAdd = creditPackage.credits + creditPackage.bonus;

    const updatedSub = new Subscription(
      {
        ...sub.props,
        credits: sub.credits + totalCreditsToAdd,
      },
      sub.id,
    );

    await this.subscriptionRepository.save(updatedSub);

    return {
      success: true,
      total_credits: updatedSub.credits,
    };
  }
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(userId: string, plan?: string, credits?: number) {
    const existing = await this.subscriptionRepository.findByUserId(userId);
    if (existing) {
      return existing;
    }

    const subscription = new Subscription({
      userId,
      plan: (plan?.toUpperCase() as SubscriptionPlan) || SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
      credits: credits ?? 50,
    });

    await this.subscriptionRepository.save(subscription);

    return subscription;
  }
}
