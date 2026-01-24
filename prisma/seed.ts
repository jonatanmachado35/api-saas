import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agentchat.com' },
    update: {},
    create: {
      email: 'admin@agentchat.com',
      password: hashedPassword,
      full_name: 'System Admin',
      role: 'ADMIN',
      subscription: {
        create: {
          plan: 'CUSTOM',
          credits: 9999,
          status: 'ACTIVE',
        },
      },
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Demo user with Pro plan
  const demoUserPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@agentchat.com' },
    update: {},
    create: {
      email: 'demo@agentchat.com',
      password: demoUserPassword,
      full_name: 'Demo User',
      role: 'USER',
      subscription: {
        create: {
          plan: 'PRO',
          credits: 500,
          status: 'ACTIVE',
        },
      },
    },
  });
  console.log('✅ Demo user created:', demoUser.email);

  // Free user
  const freeUserPassword = await bcrypt.hash('free123', 10);
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@agentchat.com' },
    update: {},
    create: {
      email: 'free@agentchat.com',
      password: freeUserPassword,
      full_name: 'Free User',
      role: 'USER',
      subscription: {
        create: {
          plan: 'FREE',
          credits: 50,
          status: 'ACTIVE',
        },
      },
    },
  });
  console.log('✅ Free user created:', freeUser.email);

  // Create demo agents for demo user
  const agent1 = await prisma.agent.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      user_id: demoUser.id,
      name: 'Assistente de Vendas',
      avatar: '🤖',
      description: 'Ajuda com estratégias de vendas e atendimento ao cliente',
    },
  });

  const agent2 = await prisma.agent.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      user_id: demoUser.id,
      name: 'Suporte Técnico',
      avatar: '🛠️',
      description: 'Auxilia com questões técnicas e troubleshooting',
    },
  });
  console.log('✅ Demo agents created');

  // Create demo chat
  const chat = await prisma.chat.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      user_id: demoUser.id,
      agent_id: agent1.id,
      title: 'Conversa sobre vendas',
      messages: {
        create: [
          {
            content: 'Olá! Como posso melhorar minhas vendas?',
            sender: 'USER',
          },
          {
            content: 'Olá! Posso ajudar com estratégias de vendas. Qual é o seu produto ou serviço?',
            sender: 'AGENT',
          },
        ],
      },
    },
  });
  console.log('✅ Demo chat created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
