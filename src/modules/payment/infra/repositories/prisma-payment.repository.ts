import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Payment, PaymentStatus, PaymentType, PaymentFrequency } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(payment: any): Payment {
    return new Payment(
      {
        userId: payment.user_id,
        type: payment.type as PaymentType,
        amount: payment.amount,
        description: payment.description,
        status: payment.status as PaymentStatus,
        frequency: payment.frequency as PaymentFrequency,
        externalId: payment.external_id,
        paymentUrl: payment.payment_url,
        metadata: payment.metadata,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
      },
      payment.id,
    );
  }

  async save(payment: Payment): Promise<void> {
    const data = {
      id: payment.id,
      user_id: payment.userId,
      type: payment.type,
      amount: payment.amount,
      description: payment.description,
      status: payment.status,
      frequency: payment.frequency,
      external_id: payment.externalId,
      payment_url: payment.paymentUrl,
      metadata: payment.metadata || {},
    };

    await this.prisma.payment.upsert({
      where: { id: payment.id },
      update: {
        status: data.status,
        external_id: data.external_id,
        payment_url: data.payment_url,
        metadata: data.metadata,
      },
      create: data,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) return null;
    return this.toDomain(payment);
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { external_id: externalId },
    });
    if (!payment) return null;
    return this.toDomain(payment);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    return payments.map((p) => this.toDomain(p));
  }
}
