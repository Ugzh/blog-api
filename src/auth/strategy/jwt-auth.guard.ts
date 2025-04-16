import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../../user/_utils/user-role.enum';
import { User } from '../../user/schema/user.schema';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const roles = this.reflector.get<UserRoleEnum[]>(
        'roles',
        context.getHandler(),
      );
      if (!roles || !roles.length) return false;
      const request: Request = context.switchToHttp().getRequest();
      const user = request.user as User;
      return roles.includes(user.role);
    }
    return false;
  }
}
