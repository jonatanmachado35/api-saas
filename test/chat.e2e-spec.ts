import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Chat E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;
  let userId: string;
  let agentId: string;
  let chatId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();

    // Limpar dados de testes anteriores
    await prisma.user.deleteMany({
      where: { email: { contains: 'chat-test' } },
    });

    // Criar usuário PRO
    const userResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'chat-test-user@example.com',
        password: 'Test123456',
        full_name: 'Chat Test User',
      });

    userToken = userResponse.body.token;
    userId = userResponse.body.user.id;

    // Atualizar para PRO
    await prisma.subscription.update({
      where: { user_id: userId },
      data: { plan: 'PRO' },
    });

    // Criar um agent
    const agentResponse = await request(app.getHttpServer())
      .post('/api/agents')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Chat Test Agent',
        avatar: '💬',
        description: 'Agent for chat testing',
        prompt: 'You are a helpful assistant',
        type: 'assistant',
        tone: 'professional',
        style: 'formal',
        focus: 'support',
      });

    agentId = agentResponse.body.id;
  });

  afterAll(async () => {
    // Limpar dados
    await prisma.message.deleteMany({ where: { chat: { user_id: userId } } });
    await prisma.chat.deleteMany({ where: { user_id: userId } });
    await prisma.agent.deleteMany({ where: { user_id: userId } });
    await prisma.user.delete({ where: { id: userId } });
    await app.close();
  });

  describe('POST /chats', () => {
    it('deve criar um chat com agent válido', async () => {
      const response = await request(app.getHttpServer())
        .post('/chats')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          agent_id: agentId,
          title: 'Test Chat',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('agent_id', agentId);
      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('title', 'Test Chat');
      
      chatId = response.body.id;
    });

    it('deve criar chat sem título', async () => {
      const response = await request(app.getHttpServer())
        .post('/chats')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          agent_id: agentId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBeNull();

      // Limpar
      await prisma.chat.delete({ where: { id: response.body.id } });
    });

    it('deve retornar erro 404 com agent inexistente', async () => {
      await request(app.getHttpServer())
        .post('/chats')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          agent_id: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/chats')
        .send({
          agent_id: agentId,
        })
        .expect(401);
    });
  });

  describe('GET /chats', () => {
    it('deve listar chats do usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/chats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('agent_id');
      expect(response.body[0]).toHaveProperty('user_id', userId);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      await request(app.getHttpServer())
        .get('/chats')
        .expect(401);
    });
  });

  describe('GET /chats/:chat_id/messages', () => {
    it('deve listar mensagens de um chat (vazio inicialmente)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('deve retornar erro 404 para chat inexistente', async () => {
      await request(app.getHttpServer())
        .get('/chats/00000000-0000-0000-0000-000000000000/messages')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('POST /chats/:chat_id/messages', () => {
    it('deve enviar mensagem e receber resposta do agent', async () => {
      const response = await request(app.getHttpServer())
        .post(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Hello, agent!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('content', 'Hello, agent!');
      expect(response.body).toHaveProperty('sender', 'user');
      expect(response.body).toHaveProperty('agent_response');
      expect(response.body.agent_response).toHaveProperty('sender', 'agent');
      expect(response.body.agent_response).toHaveProperty('content');
    }, 35000); // Timeout maior para chamada externa

    it('deve retornar erro 404 para chat inexistente', async () => {
      await request(app.getHttpServer())
        .post('/chats/00000000-0000-0000-0000-000000000000/messages')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Test message',
        })
        .expect(404);
    });

    it('deve retornar erro 400 sem conteúdo', async () => {
      await request(app.getHttpServer())
        .post(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /chats/:chat_id/messages', () => {
    it('deve limpar todas as mensagens do chat', async () => {
      // Enviar mensagem primeiro
      await request(app.getHttpServer())
        .post(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Message to be deleted',
        });

      // Verificar que existem mensagens
      const beforeResponse = await request(app.getHttpServer())
        .get(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(beforeResponse.body.length).toBeGreaterThan(0);

      // Limpar mensagens
      const clearResponse = await request(app.getHttpServer())
        .delete(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(clearResponse.body).toHaveProperty('message', 'Chat cleared successfully');

      // Verificar que foi limpo
      const afterResponse = await request(app.getHttpServer())
        .get(`/chats/${chatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(afterResponse.body.length).toBe(0);
    }, 35000);

    it('deve retornar erro 404 para chat inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/chats/00000000-0000-0000-0000-000000000000/messages')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('Fluxo completo de Chat', () => {
    it('deve completar fluxo: create chat → send message → list messages → clear → verify empty', async () => {
      // 1. Create chat
      const chatResponse = await request(app.getHttpServer())
        .post('/chats')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          agent_id: agentId,
          title: 'Complete Flow Chat',
        })
        .expect(201);

      const flowChatId = chatResponse.body.id;

      // 2. Send message
      await request(app.getHttpServer())
        .post(`/chats/${flowChatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'First message in flow',
        })
        .expect(200);

      // 3. List messages (deve ter 2: user + agent)
      const messagesResponse = await request(app.getHttpServer())
        .get(`/chats/${flowChatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(messagesResponse.body.length).toBeGreaterThanOrEqual(2);

      // 4. Clear messages
      await request(app.getHttpServer())
        .delete(`/chats/${flowChatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // 5. Verify empty
      const emptyResponse = await request(app.getHttpServer())
        .get(`/chats/${flowChatId}/messages`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(emptyResponse.body.length).toBe(0);

      // Cleanup
      await prisma.chat.delete({ where: { id: flowChatId } });
    }, 35000);
  });
});
