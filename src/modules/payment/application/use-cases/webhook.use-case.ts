import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { SubscriptionRepository } from '../../../subscription/domain/repositories/subscription.repository.interface';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../../subscription/domain/entities/subscription.entity';
import { PaymentStatus } from '../../domain/entities/payment.entity';

export interface WebhookPayload {
  id: string; // billing ID do AbacatePay
  status: string;
  amount: number;
  frequency: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class ProcessPaymentWebhookUseCase {
  private readonly logger = new Logger(ProcessPaymentWebhookUseCase.name);

  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(payload: WebhookPayload) {
    this.logger.log(`Processing webhook for billing: ${payload.id}`);

    // Buscar payment pelo external_id
    const payment = await this.paymentRepository.findByExternalId(payload.id);

    if (!payment) {
      this.logger.warn(`Payment not found for external_id: ${payload.id}`);
      throw new BadRequestException('Payment not found');
    }

    // Já processado
    if (payment.status === PaymentStatus.PAID) {
      this.logger.log(`Payment already processed: ${payment.id}`);
      return { success: true, message: 'Already processed' };
    }

    // Processar pagamento baseado no status
    const status = payload.status.toUpperCase();

    if (status === 'PAID' || status === 'COMPLETED') {
      return await this.handlePaidPayment(payment, payload);
    }

    if (status === 'FAILED' || status === 'CANCELED') {
      payment.markAsFailed();
      await this.paymentRepository.save(payment);
      this.logger.log(`Payment marked as failed: ${payment.id}`);
    }

    return { success: true };
  }

  private async handlePaidPayment(payment: any, payload: WebhookPayload) {
    this.logger.log(`Processing paid payment: ${payment.id} - Type: ${payment.type}`);

    payment.markAsPaid(payload.id);
    await this.paymentRepository.save(payment);

    const metadata = payment.metadata || {};

    // Processar assinatura
    if (payment.type === 'SUBSCRIPTION') {
      await this.handleSubscriptionPayment(payment.userId, metadata);
    }

    // Processar créditos
    if (payment.type === 'CREDITS') {
      await this.handleCreditsPayment(payment.userId, metadata);
    }

    this.logger.log(`Payment processed successfully: ${payment.id}`);

    return { success: true, paymentId: payment.id };
  }

  private async handleSubscriptionPayment(userId: string, metadata: any) {
    const plan = (metadata.plan?.toUpperCase() || 'PRO') as SubscriptionPlan;

    let subscription = await this.subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      // Criar nova subscription
      subscription = new Subscription({
        userId,
        plan,
        status: SubscriptionStatus.ACTIVE,
        credits: plan === SubscriptionPlan.PRO ? 500 : 50,
      });
    } else {
      // Atualizar plano existente
      subscription = new Subscription(
        {
          ...subscription.props,
          plan,
          status: SubscriptionStatus.ACTIVE,
        },
        subscription.id,
      );
    }

    await this.subscriptionRepository.save(subscription);

    this.logger.log(`Subscription updated for user ${userId}: ${plan}`);
  }

  private async handleCreditsPayment(userId: string, metadata: any) {
    const subscription = await this.subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      this.logger.warn(`Subscription not found for user: ${userId}`);
      return;
    }

    const credits = metadata.credits || 0;
    const bonus = metadata.bonus || 0;
    const totalCredits = credits + bonus;

    const updatedSubscription = new Subscription(
      {
        ...subscription.props,
        credits: subscription.credits + totalCredits,
      },
      subscription.id,
    );

    await this.subscriptionRepository.save(updatedSubscription);

    this.logger.log(`Added ${totalCredits} credits to user ${userId}`);
  }
}
