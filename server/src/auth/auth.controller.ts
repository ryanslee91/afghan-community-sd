import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { AuthUser } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.login(user!);

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
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { success: true };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignUpDto): Promise<AuthUser> {
    return this.authService.signup(dto);
  }
}
