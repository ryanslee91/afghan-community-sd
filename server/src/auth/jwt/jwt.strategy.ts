import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

// Request에서 토큰을 뽑아내는 함수에 타입 지정
const cookieExtractor = (req: Request): string | null => {
  console.log('req.cookies =', req.cookies);

  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.['access_token'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    if (typeof payload.sub !== 'number' || typeof payload.email !== 'string') {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 예시: PrismaService 주입 후 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, nickname: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
