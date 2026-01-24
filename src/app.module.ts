import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SharedModule } from './modules/shared/shared.module';
import { IamModule } from './modules/iam/iam.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AgentsModule } from './modules/agents/agents.module';
import { ChatModule } from './modules/chat/chat.module';
import { AdminModule } from './modules/admin/admin.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SharedModule,
    IamModule,
    SubscriptionModule,
    AgentsModule,
    ChatModule,
    AdminModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
