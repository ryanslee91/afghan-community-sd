// src/user/user.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthUser } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: Request & { user: AuthUser }) {
    const user = await this.userService.findById(req.user?.id);
    return user;
  }
}
