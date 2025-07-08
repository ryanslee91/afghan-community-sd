import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.login(user);

    // JWT 쿠키에 담기 (httpOnly 옵션 필수!)
    try {
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1일
        sameSite: 'lax',
        path: '/',
      });
      return { message: 'Login Success' };
    } catch (e) {
      console.error('There is an error with log in procedure', e);
    }
  }
}
