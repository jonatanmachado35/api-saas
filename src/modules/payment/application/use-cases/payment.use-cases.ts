import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Payment, PaymentType, PaymentStatus, PaymentFrequency } from '../../domain/entities/payment.entity';
import { AbacatePayService } from '../../infra/services/abacatepay.service';

// Preços dos planos em centavos (R$)
const PLAN_PRICES: Record<string, number> = {
  pro: 4990, // R$ 49,90
};

// Preços dos pacotes de créditos em centavos (R$)
const CREDIT_PACKAGES_PRICES: Record<string, { price: number; credits: number; bonus: number }> = {
  starter: { price: 990, credits: 100, bonus: 0 },
  popular: { price: 3990, credits: 500, bonus: 50 },
  pro: { price: 6990, credits: 1000, bonus: 150 },
  enterprise: { price: 29990, credits: 5000, bonus: 1000 },
};

export interface CreateSubscriptionPaymentInput {
  userId: string;
  plan: string;
  email: string;
  returnUrl?: string;
}

@Injectable()
export class CreateSubscriptionPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly abacatePayService: AbacatePayService,
  ) {}

  async execute(input: CreateSubscriptionPaymentInput) {
    const planLower = input.plan.toLowerCase();
    
    if (!PLAN_PRICES[planLower]) {
      throw new BadRequestException('Invalid plan');
    }

    const price = PLAN_PRICES[planLower];

    // Criar payment local
    const payment = new Payment({
      userId: input.userId,
      type: PaymentType.SUBSCRIPTION,
      amount: price,
      description: `Assinatura ${input.plan.toUpperCase()} - Mensal`,
      status: PaymentStatus.PENDING,
      frequency: PaymentFrequency.MONTHLY,
      metadata: {
        plan: input.plan,
        email: input.email,
      },
    });

    await this.paymentRepository.save(payment);

    // Criar billing no AbacatePay
    const billingResponse = await this.abacatePayService.createBilling({
      frequency: 'MONTHLY',
      methods: ['PIX', 'CARD'],
      products: [
        {
          externalId: payment.id,
          name: `Plano ${input.plan.toUpperCase()}`,
          description: 'Assinatura mensal AgentChat',
          quantity: 1,
          price,
        },
      ],
      returnUrl: input.returnUrl,
      completionUrl: input.returnUrl,
      metadata: {
        paymentId: payment.id,
        userId: input.userId,
        email: input.email,
        type: 'subscription',
        plan: input.plan,
      },
    });

    if (billingResponse.error) {
      throw new BadRequestException('Failed to create payment');
    }

    // Atualizar payment com dados do AbacatePay
    payment.props.externalId = billingResponse.data.id;
    payment.props.paymentUrl = billingResponse.data.url;
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      externalId: billingResponse.data.id,
      paymentUrl: billingResponse.data.url,
      amount: price,
      status: 'pending',
    };
  }
}

export interface CreateCreditsPaymentInput {
  userId: string;
  packageId: string;
  email: string;
  returnUrl?: string;
}

@Injectable()
export class CreateCreditsPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly abacatePayService: AbacatePayService,
  ) {}

  async execute(input: CreateCreditsPaymentInput) {
    const packageData = CREDIT_PACKAGES_PRICES[input.packageId];
    
    if (!packageData) {
      throw new BadRequestException('Invalid package');
    }

    const totalCredits = packageData.credits + packageData.bonus;

    // Criar payment local
    const payment = new Payment({
      userId: input.userId,
      type: PaymentType.CREDITS,
      amount: packageData.price,
      description: `Compra de ${totalCredits} créditos (pacote ${input.packageId})`,
      status: PaymentStatus.PENDING,
      frequency: PaymentFrequency.ONE_TIME,
      metadata: {
        packageId: input.packageId,
        credits: packageData.credits,
        bonus: packageData.bonus,
        totalCredits,
        email: input.email,
      },
    });

    await this.paymentRepository.save(payment);

    // Criar billing no AbacatePay
    const billingResponse = await this.abacatePayService.createBilling({
      frequency: 'ONE_TIME',
      methods: ['PIX', 'CARD'],
      products: [
        {
          externalId: payment.id,
          name: `Pacote ${input.packageId.toUpperCase()}`,
          description: `${totalCredits} créditos (${packageData.credits} + ${packageData.bonus} bônus)`,
          quantity: 1,
          price: packageData.price,
        },
      ],
      returnUrl: input.returnUrl,
      completionUrl: input.returnUrl,
      metadata: {
        paymentId: payment.id,
        userId: input.userId,
        email: input.email,
        type: 'credits',
        packageId: input.packageId,
        credits: packageData.credits,
        bonus: packageData.bonus,
      },
    });

    if (billingResponse.error) {
      throw new BadRequestException('Failed to create payment');
    }

    // Atualizar payment com dados do AbacatePay
    payment.props.externalId = billingResponse.data.id;
    payment.props.paymentUrl = billingResponse.data.url;
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      externalId: billingResponse.data.id,
      paymentUrl: billingResponse.data.url,
      amount: packageData.price,
      credits: totalCredits,
      status: 'pending',
    };
  }
}

@Injectable()
export class GetPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return {
      id: payment.id,
      type: payment.type.toLowerCase(),
      amount: payment.amount,
      description: payment.description,
      status: payment.status.toLowerCase(),
      frequency: payment.frequency.toLowerCase(),
      paymentUrl: payment.paymentUrl,
      metadata: payment.metadata,
      createdAt: payment.props.createdAt,
    };
  }
}

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(userId: string) {
    const payments = await this.paymentRepository.findByUserId(userId);

    return payments.map((p) => ({
      id: p.id,
      type: p.type.toLowerCase(),
      amount: p.amount,
      description: p.description,
      status: p.status.toLowerCase(),
      frequency: p.frequency.toLowerCase(),
      paymentUrl: p.paymentUrl,
      createdAt: p.props.createdAt,
    }));
  }
}
