import { SetMetadata } from '@nestjs/common';
import { UserRole, AdminRole } from '@glow-fix/types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (UserRole | AdminRole)[]) =>
  SetMetadata(ROLES_KEY, roles);