import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaPaymentRepository } from './infra/repositories/prisma-payment.repository';
import { AbacatePayService } from './infra/services/abacatepay.service';
import { PaymentController, WebhookController } from './infra/http/controllers/payment.controller';
import {
  CreateSubscriptionPaymentUseCase,
  CreateCreditsPaymentUseCase,
  GetPaymentUseCase,
  ListPaymentsUseCase,
} from './application/use-cases/payment.use-cases';
import { ProcessPaymentWebhookUseCase } from './application/use-cases/webhook.use-case';
import { IamModule } from '../iam/iam.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [ConfigModule, IamModule, SubscriptionModule],
  controllers: [PaymentController, WebhookController],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepository,
    },
    AbacatePayService,
    CreateSubscriptionPaymentUseCase,
    CreateCreditsPaymentUseCase,
    GetPaymentUseCase,
    ListPaymentsUseCase,
    ProcessPaymentWebhookUseCase,
  ],
  exports: ['PaymentRepository', ProcessPaymentWebhookUseCase],
})
export class PaymentModule {}
