import { Module } from '@nestjs/common';
import { PrismaChatRepository } from './infra/repositories/prisma-chat.repository';
import { ChatController } from './infra/http/controllers/chat.controller';
import { ListChatsUseCase, SendMessageUseCase } from './application/use-cases/chat.use-cases';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [ChatController],
  providers: [
    PrismaChatRepository,
    ListChatsUseCase,
    SendMessageUseCase,
  ],
  exports: [PrismaChatRepository],
})
export class ChatModule { }
