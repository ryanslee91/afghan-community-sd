import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { AuthUser } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, plain: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user?.hashedPassword)
      throw new UnauthorizedException('Email or Password error');

    const isMatch: boolean = await bcrypt.compare(plain, user.hashedPassword);
    if (!isMatch) throw new UnauthorizedException('Email or Password error');

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  async signup(dto: SignUpDto): Promise<AuthUser> {
    // 1) 중복 이메일 체크
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new BadRequestException('This e-mail address already exists.');
    }

    // 2) 비밀번호 해시
    const hashed = await bcrypt.hash(dto.password, 10);

    // 3) 유저 생성
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: hashed,
        nickname: dto.nickname,
        languages: dto.languages,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        nickname: true,
        languages: true,
        createdAt: true,
      },
    });

    return user;
  }
}
