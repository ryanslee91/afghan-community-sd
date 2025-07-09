import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthUser } from './entities/user.entity';
import { OptionalAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(OptionalAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: Request & { user: AuthUser | null }) {
    if (!req.user) {
      console.log('no user → guest');
      return null;
    }

    const user = await this.userService.findById(req.user?.id);
    console.log('hey ryan', req.user, user);
    return user;
  }
}
