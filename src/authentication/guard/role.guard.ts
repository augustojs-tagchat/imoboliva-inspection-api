import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../interface/requestWithUser.interface';

const RoleGuard = (role: string): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (user.role === role) {
        return true;
      } else {
        return false;
      }
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
