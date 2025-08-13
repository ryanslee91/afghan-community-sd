import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  let authCookie: string[];
  it('/auth/login (POST) → 성공 시 Set-Cookie 헤더 포함', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201);

    const rawCookie = res.headers['set-cookie'];
    const cookies: string[] = Array.isArray(rawCookie)
      ? rawCookie
      : [rawCookie];
    authCookie = cookies.map((c) => c.split(';')[0]);

    // Set-Cookie 헤더가 있는지 확인
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('access_token=');
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  it('/auth/logout (POST) → 쿠키 제거 확인', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/auth/logout')
      .set('Cookie', authCookie.join('; '))
      .expect(201);

    // clearCookie는 HTTP에서 Set-Cookie로 만료시킵니다
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('access_token=;');
  });
});
