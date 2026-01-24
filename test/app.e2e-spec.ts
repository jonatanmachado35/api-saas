import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AgentChat API (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Module', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';

    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: testEmail,
            password: testPassword,
            full_name: 'Test User',
          })
          .expect(201);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(testEmail);
        testUserId = response.body.user.id;
        authToken = response.body.token;
      });

      it('should fail with short password', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'another@example.com',
            password: '12345',
            full_name: 'Test User',
          })
          .expect(400);
      });

      it('should fail with duplicate email', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: testEmail,
            password: testPassword,
            full_name: 'Another User',
          })
          .expect(409);
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testEmail,
            password: testPassword,
          })
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
        authToken = response.body.token;
      });

      it('should fail with wrong password', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testEmail,
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should fail with non-existent user', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testPassword,
          })
          .expect(401);
      });
    });

    describe('GET /api/auth/me', () => {
      it('should return current user', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('user');
      });

      it('should fail without token', async () => {
        await request(app.getHttpServer())
          .get('/api/auth/me')
          .expect(401);
      });
    });

    describe('POST /api/auth/logout', () => {
      it('should logout successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Agents Module', () => {
    let agentId: string;

    describe('POST /api/agents', () => {
      it('should create a new agent', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/agents')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            user_id: testUserId,
            name: 'Test Agent',
            avatar: '🤖',
            description: 'Test description',
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Test Agent');
        agentId = response.body.id;
      });

      it('should fail without auth', async () => {
        await request(app.getHttpServer())
          .post('/api/agents')
          .send({
            user_id: testUserId,
            name: 'Test Agent',
          })
          .expect(401);
      });
    });

    describe('GET /api/agents', () => {
      it('should list user agents', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/agents')
          .query({ user_id: testUserId })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('PUT /api/agents/:agent_id', () => {
      it('should update an agent', async () => {
        const response = await request(app.getHttpServer())
          .put(`/api/agents/${agentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: 'Updated Agent',
          })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      });
    });

    describe('DELETE /api/agents/:agent_id', () => {
      it('should delete an agent', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/api/agents/${agentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Subscriptions Module', () => {
    describe('GET /api/subscriptions/:user_id', () => {
      it('should get user subscription', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/subscriptions/${testUserId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('plan');
        expect(response.body).toHaveProperty('credits');
      });
    });

    describe('POST /api/subscriptions/upgrade', () => {
      it('should upgrade to pro plan', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/subscriptions/upgrade')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ plan: 'pro' })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.subscription.plan).toBe('pro');
      });
    });

    describe('POST /api/subscriptions/downgrade', () => {
      it('should downgrade to free plan', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/subscriptions/downgrade')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.subscription.plan).toBe('free');
      });
    });
  });

  describe('Contact Module', () => {
    describe('POST /api/contact', () => {
      it('should send contact form', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/contact')
          .send({
            name: 'Test Name',
            email: 'contact@example.com',
            subject: 'Test Subject Message',
            message: 'This is a test message with enough characters.',
          })
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
      });

      it('should fail with invalid email', async () => {
        await request(app.getHttpServer())
          .post('/api/contact')
          .send({
            name: 'Test Name',
            email: 'invalid-email',
            subject: 'Test Subject',
            message: 'This is a test message.',
          })
          .expect(400);
      });
    });
  });
});
