/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/entities/user.entity';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  public handleRequest<TUser extends AuthUser = AuthUser>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser | null {
    // 에러면 throw, 유저가 없으면 null, 있으면 user
    if (err) throw err;
    return user ?? null;
  }
}
