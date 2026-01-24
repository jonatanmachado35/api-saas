import { Module } from '@nestjs/common';
import { PrismaContactRepository } from './infra/repositories/prisma-contact.repository';
import { SendContactUseCase } from './application/use-cases/send-contact.use-case';
import { ContactController } from './infra/http/controllers/contact.controller';

@Module({
  controllers: [ContactController],
  providers: [
    {
      provide: 'ContactRepository',
      useClass: PrismaContactRepository,
    },
    SendContactUseCase,
  ],
  exports: ['ContactRepository', SendContactUseCase],
})
export class ContactModule {}
