import { Module } from '@nestjs/common';
import { PrismaChatRepository } from './infra/repositories/prisma-chat.repository';
import { ChatController } from './infra/http/controllers/chat.controller';
import { ListChatsUseCase, SendMessageUseCase, CreateChatUseCase, ListMessagesUseCase, ClearChatUseCase } from './application/use-cases/chat.use-cases';
import { IamModule } from '../iam/iam.module';
import { AiChatService } from './infra/external-api/ai-chat.service';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [IamModule, AgentsModule],
  controllers: [ChatController],
  providers: [
    PrismaChatRepository,
    ListChatsUseCase,
    SendMessageUseCase,
    CreateChatUseCase,
    ListMessagesUseCase,
    ClearChatUseCase,
    AiChatService,
  ],
  exports: [PrismaChatRepository],
})
export class ChatModule { }
