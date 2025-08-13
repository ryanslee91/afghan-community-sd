import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { Language, Role } from '@prisma/client';

// ✅ AuthService의 모든 메서드를 jest.fn()으로 래핑한 타입
type MockAuthService = jest.Mocked<AuthService>;

const createMockAuthService = (): MockAuthService =>
  ({
    validateUser: jest.fn(),
    login: jest.fn(),
  }) as unknown as MockAuthService;

// ✅ JwtAuthGuard mock (테스트에서는 항상 통과)
class MockJwtAuthGuard {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockAuthService;
  let res: Partial<Response>;

  beforeEach(async () => {
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: createMockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService) as MockAuthService;

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('JWT 쿠키를 설정하고 성공 메시지를 반환해야 함', async () => {
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        hashedPassword: 'hashed-password',
        nickname: 'tester',
        role: Role.USER,
        languages: [Language.ENGLISH],
        createdAt: new Date(),
      };
      const fakeToken = 'jwt.token.string';

      authService.validateUser.mockResolvedValue(fakeUser);
      authService.login.mockResolvedValue(fakeToken);

      const result = await controller.login(
        { email: 'test@example.com', password: 'password123' },
        res as Response,
      );
      const validateUser = jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(fakeUser);
      expect(validateUser).toHaveBeenCalledWith(
        1,
        'test@example.com',
        'password123',
        'tester',
        'USER',
        'ENGLISH',
        '2025-01-01',
      );
      const login = jest
        .spyOn(authService, 'login')
        .mockResolvedValue(fakeToken);
      expect(login).toHaveBeenCalledWith(fakeUser);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        fakeToken,
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({ message: 'Login Success' });
    });
  });

  describe('logout', () => {
    it('JWT 쿠키를 제거하고 성공 여부를 반환해야 함', () => {
      const result = controller.logout(res as Response, {} as any);

      expect(res.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result).toEqual({ success: true });
    });
  });
});
