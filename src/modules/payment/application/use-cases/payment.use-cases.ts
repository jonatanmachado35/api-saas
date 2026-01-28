import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Payment, PaymentType, PaymentStatus, PaymentFrequency } from '../../domain/entities/payment.entity';
import { ProductType } from '../../domain/entities/product.entity';
import { AbacatePayService } from '../../infra/services/abacatepay.service';

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
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly abacatePayService: AbacatePayService,
  ) {}

  async execute(input: CreateSubscriptionPaymentInput) {
    // Buscar produto do banco
    const product = await this.productRepository.findBySlug(input.plan);
    
    if (!product || !product.active || product.type !== ProductType.SUBSCRIPTION) {
      throw new BadRequestException('Invalid plan');
    }

    if (!product || !product.active || product.type !== ProductType.SUBSCRIPTION) {
      throw new BadRequestException('Invalid plan');
    }

    // Criar payment local
    const payment = new Payment({
      userId: input.userId,
      type: PaymentType.SUBSCRIPTION,
      amount: product.price,
      description: `Assinatura ${product.name} - Mensal`,
      status: PaymentStatus.PENDING,
      frequency: PaymentFrequency.MONTHLY,
      metadata: {
        plan: input.plan,
        email: input.email,
        productId: product.id,
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
          name: product.name,
          description: 'Assinatura mensal AgentChat',
          quantity: 1,
          price: product.price,
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
      amount: product.price,
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
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly abacatePayService: AbacatePayService,
  ) {}

  async execute(input: CreateCreditsPaymentInput) {
    // Buscar produto do banco
    const product = await this.productRepository.findBySlug(input.packageId);
    
    if (!product || !product.active || product.type !== ProductType.CREDITS) {
      throw new BadRequestException('Invalid package');
    }

    const totalCredits = (product.credits || 0) + (product.bonus || 0);

    // Criar payment local
    const payment = new Payment({
      userId: input.userId,
      type: PaymentType.CREDITS,
      amount: product.price,
      description: `Compra de ${totalCredits} créditos (${product.name})`,
      status: PaymentStatus.PENDING,
      frequency: PaymentFrequency.ONE_TIME,
      metadata: {
        packageId: input.packageId,
        credits: product.credits || 0,
        bonus: product.bonus || 0,
        totalCredits,
        email: input.email,
        productId: product.id,
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
          name: product.name,
          description: `${totalCredits} créditos (${product.credits} + ${product.bonus || 0} bônus)`,
          quantity: 1,
          price: product.price,
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
        credits: product.credits || 0,
        bonus: product.bonus || 0,
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
      amount: product.price,
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
