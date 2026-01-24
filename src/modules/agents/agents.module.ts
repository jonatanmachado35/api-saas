import { Module } from '@nestjs/common';
import { PrismaAgentRepository } from './infra/repositories/prisma-agent.repository';
import { AgentController } from './infra/http/controllers/agent.controller';
import {
  CreateAgentUseCase,
  UpdateAgentUseCase,
  ListAgentsUseCase,
  DeleteAgentUseCase,
} from './application/use-cases/agent.use-cases';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [AgentController],
  providers: [
    {
      provide: 'AgentRepository',
      useClass: PrismaAgentRepository,
    },
    CreateAgentUseCase,
    UpdateAgentUseCase,
    ListAgentsUseCase,
    DeleteAgentUseCase,
  ],
  exports: ['AgentRepository'],
})
export class AgentsModule {}
