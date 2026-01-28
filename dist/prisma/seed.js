"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
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
    console.log('🌱 Seeding products...');
    await prisma.product.upsert({
        where: { slug: 'pro' },
        update: {},
        create: {
            type: 'SUBSCRIPTION',
            slug: 'pro',
            name: 'Plano PRO',
            description: 'Assinatura mensal com 500 créditos',
            price: 4990,
            active: true,
        },
    });
    await prisma.product.upsert({
        where: { slug: 'starter' },
        update: {},
        create: {
            type: 'CREDITS',
            slug: 'starter',
            name: 'Pacote Starter',
            description: '100 créditos para começar',
            price: 990,
            credits: 100,
            bonus: 0,
            active: true,
        },
    });
    await prisma.product.upsert({
        where: { slug: 'popular' },
        update: {},
        create: {
            type: 'CREDITS',
            slug: 'popular',
            name: 'Pacote Popular',
            description: '500 créditos + 50 de bônus',
            price: 3990,
            credits: 500,
            bonus: 50,
            active: true,
        },
    });
    await prisma.product.upsert({
        where: { slug: 'pro-credits' },
        update: {},
        create: {
            type: 'CREDITS',
            slug: 'pro-credits',
            name: 'Pacote Pro',
            description: '1000 créditos + 150 de bônus',
            price: 6990,
            credits: 1000,
            bonus: 150,
            active: true,
        },
    });
    await prisma.product.upsert({
        where: { slug: 'enterprise' },
        update: {},
        create: {
            type: 'CREDITS',
            slug: 'enterprise',
            name: 'Pacote Enterprise',
            description: '5000 créditos + 1000 de bônus',
            price: 29990,
            credits: 5000,
            bonus: 1000,
            active: true,
        },
    });
    console.log('✅ Products seeded');
    console.log('🌱 Seeding LLMs...');
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000001',
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            model: 'gpt-4-turbo-preview',
            max_tokens: 128000,
            credit_cost: 3,
            active: true,
        },
    });
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000002',
            name: 'GPT-4',
            provider: 'OpenAI',
            model: 'gpt-4',
            max_tokens: 8192,
            credit_cost: 2,
            active: true,
        },
    });
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000003' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000003',
            name: 'GPT-3.5 Turbo',
            provider: 'OpenAI',
            model: 'gpt-3.5-turbo',
            max_tokens: 16385,
            credit_cost: 1,
            active: true,
        },
    });
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000004' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000004',
            name: 'Claude 3 Opus',
            provider: 'Anthropic',
            model: 'claude-3-opus-20240229',
            max_tokens: 200000,
            credit_cost: 3,
            active: true,
        },
    });
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000005' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000005',
            name: 'Claude 3 Sonnet',
            provider: 'Anthropic',
            model: 'claude-3-sonnet-20240229',
            max_tokens: 200000,
            credit_cost: 2,
            active: true,
        },
    });
    await prisma.llm.upsert({
        where: { id: '00000000-0000-0000-0000-llm000000006' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-llm000000006',
            name: 'Gemini Pro',
            provider: 'Google',
            model: 'gemini-pro',
            max_tokens: 32768,
            credit_cost: 1,
            active: true,
        },
    });
    console.log('✅ LLMs seeded');
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
//# sourceMappingURL=seed.js.map