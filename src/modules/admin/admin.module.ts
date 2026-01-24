import { Module } from '@nestjs/common';
import { AdminController } from './infra/http/controllers/admin.controller';
import { GetAdminStatsUseCase } from './application/use-cases/admin-stats.use-case';
import { ListUsersUseCase, ChangeUserRoleUseCase } from './application/use-cases/admin-user.use-cases';
import {
  ListAdminSubscriptionsUseCase,
  ListAllAgentsUseCase,
  CreateAdminSubscriptionUseCase,
  UpdateAdminSubscriptionUseCase,
  CreateAdminAgentUseCase,
  DeleteAdminAgentUseCase,
} from './application/use-cases/admin-mgmt.use-cases';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [AdminController],
  providers: [
    GetAdminStatsUseCase,
    ListUsersUseCase,
    ChangeUserRoleUseCase,
    ListAdminSubscriptionsUseCase,
    CreateAdminSubscriptionUseCase,
    UpdateAdminSubscriptionUseCase,
    ListAllAgentsUseCase,
    CreateAdminAgentUseCase,
    DeleteAdminAgentUseCase,
  ],
})
export class AdminModule {}
