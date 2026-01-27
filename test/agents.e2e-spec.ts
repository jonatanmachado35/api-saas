import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Agents E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let freeUserToken: string;
  let freeUserId: string;
  let proUserToken: string;
  let proUserId: string;
  let agentId: string;

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
      where: { email: { contains: 'agent-' } },
    });

    // Criar usuário FREE
    const freeUserResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'agent-free-user@example.com',
        password: 'Test123456',
        full_name: 'Free User',
      });

    freeUserToken = freeUserResponse.body.token;
    freeUserId = freeUserResponse.body.user.id;

    // Criar usuário PRO
    const proUserResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'agent-pro-user@example.com',
        password: 'Test123456',
        full_name: 'Pro User',
      });

    proUserToken = proUserResponse.body.token;
    proUserId = proUserResponse.body.user.id;

    // Atualizar plano para PRO
    await prisma.subscription.update({
      where: { user_id: proUserId },
      data: { plan: 'PRO' },
    });
  });

  afterAll(async () => {
    // Limpar dados
    await prisma.agent.deleteMany({
      where: { user_id: { in: [freeUserId, proUserId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [freeUserId, proUserId] } },
    });
    await app.close();
  });

  describe('POST /agents', () => {
    it('deve permitir usuário PRO criar agent', async () => {
      const response = await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${proUserToken}`)
        .send({
          name: 'Test Agent',
          avatar: '🤖',
          description: 'Test description',
          prompt: 'You are a helpful assistant',
          category: 'Marketing',
          type: 'Assistant',
          visibility: 'PRIVATE',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Agent');
      expect(response.body).toHaveProperty('visibility', 'PRIVATE');
      
      agentId = response.body.id;
    });

    it('deve bloquear usuário FREE de criar agent', async () => {
      await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .send({
          name: 'Blocked Agent',
          avatar: '🤖',
          description: 'Should not be created',
        })
        .expect(403);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/agents')
        .send({
          name: 'Unauthorized Agent',
        })
        .expect(401);
    });

    it('deve retornar erro 400 com nome muito longo', async () => {
      await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${proUserToken}`)
        .send({
          name: 'A'.repeat(150),
          avatar: '🤖',
        })
        .expect(400);
    });
  });

  describe('GET /agents', () => {
    it('deve listar agents acessíveis ao usuário PRO', async () => {
      const response = await request(app.getHttpServer())
        .get('/agents')
        .set('Authorization', `Bearer ${proUserToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('deve retornar lista vazia ou apenas PUBLIC para usuário FREE', async () => {
      const response = await request(app.getHttpServer())
        .get('/agents')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // FREE user só vê PUBLIC agents
      const nonPublicAgents = response.body.filter(
        (agent: any) => agent.visibility !== 'PUBLIC',
      );
      expect(nonPublicAgents.length).toBe(0);
    });
  });

  describe('PUT /agents/:id', () => {
    it('deve atualizar agent próprio', async () => {
      const response = await request(app.getHttpServer())
        .put(`/agents/${agentId}`)
        .set('Authorization', `Bearer ${proUserToken}`)
        .send({
          name: 'Updated Agent Name',
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.agent).toHaveProperty('name', 'Updated Agent Name');
      expect(response.body.agent).toHaveProperty('description', 'Updated description');
    });
  });

  describe('DELETE /agents/:id', () => {
    it('deve deletar agent próprio', async () => {
      await request(app.getHttpServer())
        .delete(`/agents/${agentId}`)
        .set('Authorization', `Bearer ${proUserToken}`)
        .expect(200);
    });
  });

  describe('Fluxo completo de Agent CRUD', () => {
    it('deve completar fluxo: create → list → update → delete', async () => {
      // 1. Create
      const createResponse = await request(app.getHttpServer())
        .post('/agents')
        .set('Authorization', `Bearer ${proUserToken}`)
        .send({
          name: 'Flow Test Agent',
          avatar: '🚀',
          description: 'Complete flow test',
        })
        .expect(201);

      const flowAgentId = createResponse.body.id;

      // 2. List (deve conter o agent criado)
      const listResponse = await request(app.getHttpServer())
        .get('/agents')
        .set('Authorization', `Bearer ${proUserToken}`)
        .expect(200);

      const foundInList = listResponse.body.find((a: any) => a.id === flowAgentId);
      expect(foundInList).toBeDefined();

      // 3. Update
      const updateResponse = await request(app.getHttpServer())
        .put(`/agents/${flowAgentId}`)
        .set('Authorization', `Bearer ${proUserToken}`)
        .send({
          name: 'Updated Flow Agent',
        })
        .expect(200);

      expect(updateResponse.body.agent.name).toBe('Updated Flow Agent');

      // 4. Delete
      await request(app.getHttpServer())
        .delete(`/agents/${flowAgentId}`)
        .set('Authorization', `Bearer ${proUserToken}`)
        .expect(200);

      // Verificar que lista não contém mais o agent deletado
    });
  });
});
