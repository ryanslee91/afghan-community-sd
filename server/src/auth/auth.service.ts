import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

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
}
