import { Module } from '@nestjs/common';
import { PrismaAgentRepository } from './infra/repositories/prisma-agent.repository';
import { PrismaLlmRepository } from './infra/repositories/prisma-llm.repository';
import { AgentController } from './infra/http/controllers/agent.controller';
import { LlmController, AdminLlmController } from './infra/http/controllers/llm.controller';
import {
  CreateAgentUseCase,
  UpdateAgentUseCase,
  ListAgentsUseCase,
  DeleteAgentUseCase,
} from './application/use-cases/agent.use-cases';
import {
  ListLlmsUseCase,
  GetLlmByIdUseCase,
  CreateLlmUseCase,
  UpdateLlmUseCase,
  DeleteLlmUseCase,
} from './application/use-cases/llm.use-cases';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [AgentController, LlmController, AdminLlmController],
  providers: [
    {
      provide: 'AgentRepository',
      useClass: PrismaAgentRepository,
    },
    {
      provide: 'LlmRepository',
      useClass: PrismaLlmRepository,
    },
    CreateAgentUseCase,
    UpdateAgentUseCase,
    ListAgentsUseCase,
    DeleteAgentUseCase,
    ListLlmsUseCase,
    GetLlmByIdUseCase,
    CreateLlmUseCase,
    UpdateLlmUseCase,
    DeleteLlmUseCase,
  ],
  exports: ['AgentRepository', 'LlmRepository'],
})
export class AgentsModule {}
