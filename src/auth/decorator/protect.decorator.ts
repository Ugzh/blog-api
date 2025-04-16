import { UserRoleEnum } from '../../user/_utils/user-role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../strategy/jwt-auth.guard';

export function Protect(...roles: UserRoleEnum[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard));
}
