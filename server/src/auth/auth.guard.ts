import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/entities/user.entity';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch (err) {
      console.error('Error with Activation');
    }
    return true;
  }
  public handleRequest<TUser extends AuthUser = AuthUser>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser | null {
    if (err) throw err;
    return user ?? null;
  }
}
