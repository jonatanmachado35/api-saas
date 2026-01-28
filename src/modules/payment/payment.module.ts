import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaPaymentRepository } from './infra/repositories/prisma-payment.repository';
import { PrismaProductRepository } from './infra/repositories/prisma-product.repository';
import { AbacatePayService } from './infra/services/abacatepay.service';
import { PaymentController, WebhookController } from './infra/http/controllers/payment.controller';
import { ProductController, AdminProductController } from './infra/http/controllers/product.controller';
import {
  CreateSubscriptionPaymentUseCase,
  CreateCreditsPaymentUseCase,
  GetPaymentUseCase,
  ListPaymentsUseCase,
} from './application/use-cases/payment.use-cases';
import { ProcessPaymentWebhookUseCase } from './application/use-cases/webhook.use-case';
import {
  ListProductsUseCase,
  GetProductBySlugUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './application/use-cases/product.use-cases';
import { IamModule } from '../iam/iam.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [ConfigModule, IamModule, SubscriptionModule],
  controllers: [PaymentController, WebhookController, ProductController, AdminProductController],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: PrismaPaymentRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
    AbacatePayService,
    CreateSubscriptionPaymentUseCase,
    CreateCreditsPaymentUseCase,
    GetPaymentUseCase,
    ListPaymentsUseCase,
    ProcessPaymentWebhookUseCase,
    ListProductsUseCase,
    GetProductBySlugUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: ['PaymentRepository', 'ProductRepository', ProcessPaymentWebhookUseCase],
})
export class PaymentModule {}
