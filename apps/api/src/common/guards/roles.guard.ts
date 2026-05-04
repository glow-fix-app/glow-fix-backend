import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, AdminRole, JwtPayload } from '@glow-fix/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(UserRole | AdminRole)[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.some(
      (role) => user.role === role || user.adminRole === role,
    );

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role privileges');
    }

    return true;
  }
}