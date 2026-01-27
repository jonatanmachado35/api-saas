import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

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
      where: { email: { contains: 'e2e-test' } },
    });
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (userId) {
      await prisma.user.deleteMany({
        where: { email: { contains: 'e2e-test' } },
      });
    }
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'Test123456',
          full_name: 'E2E Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'e2e-test@example.com');
      expect(response.body.user).toHaveProperty('role', 'USER');
      expect(response.body.user).toHaveProperty('plan', 'FREE');
      expect(response.body.user.user_metadata).toHaveProperty('full_name', 'E2E Test User');
      
      userId = response.body.user.id;
      authToken = response.body.token;
    });

    it('deve retornar erro 409 ao tentar registrar email duplicado', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'Test123456',
          full_name: 'Duplicate User',
        })
        .expect(409);
    });

    it('deve retornar erro 400 com senha muito curta', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'another-test@example.com',
          password: '123',
          full_name: 'Test User',
        })
        .expect(400);
    });

    it('deve retornar erro 400 com email inválido', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123456',
          full_name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'Test123456',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'e2e-test@example.com');
      expect(response.body.user).toHaveProperty('plan');
      
      authToken = response.body.token;
    });

    it('deve retornar erro 401 com email inexistente', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123456',
        })
        .expect(401);
    });

    it('deve retornar erro 401 com senha incorreta', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', 'e2e-test@example.com');
      expect(response.body.user).toHaveProperty('role', 'USER');
      expect(response.body.user).toHaveProperty('plan', 'FREE');
    });

    it('deve retornar erro 401 sem token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Fluxo completo de autenticação', () => {
    it('deve completar fluxo: register → login → me', async () => {
      const timestamp = Date.now();
      const email = `e2e-flow-test-${timestamp}@example.com`;
      const password = 'FlowTest123';

      // 1. Register
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password,
          full_name: 'Flow Test User',
        })
        .expect(201);

      const registeredUserId = registerResponse.body.user.id;
      
      // 2. Login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(200);

      const token = loginResponse.body.token;

      // 3. Validate session
      const meResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(meResponse.body.user.id).toBe(registeredUserId);
      expect(meResponse.body.user.email).toBe(email);

      // Cleanup
      await prisma.user.delete({ where: { id: registeredUserId } });
    });
  });
});
