import { Module } from '@nestjs/common';
import { PrismaSubscriptionRepository } from './infra/repositories/prisma-subscription.repository';
import { SubscriptionController, CreditsController } from './infra/http/controllers/subscription.controller';
import {
  GetSubscriptionUseCase,
  UpgradePlanUseCase,
  DowngradePlanUseCase,
  PurchaseCreditsUseCase,
  CreateSubscriptionUseCase,
} from './application/use-cases/subscription.use-cases';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [SubscriptionController, CreditsController],
  providers: [
    {
      provide: 'SubscriptionRepository',
      useClass: PrismaSubscriptionRepository,
    },
    GetSubscriptionUseCase,
    UpgradePlanUseCase,
    DowngradePlanUseCase,
    PurchaseCreditsUseCase,
    CreateSubscriptionUseCase,
  ],
  exports: ['SubscriptionRepository', CreateSubscriptionUseCase],
})
export class SubscriptionModule {}
