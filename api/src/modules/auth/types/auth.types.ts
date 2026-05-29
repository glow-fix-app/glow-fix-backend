import { Permission, UserRole } from '@glow-fix/types';

export interface JwtPayload {
  sub: string;
  role: UserRole;
  permissions: Permission[];
  sessionId: string;
  deviceFingerprint: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  sub?: string;
  email: string;
  fullName: string;
  role: UserRole;
  sessionId: string;
  permissions?: Permission[];
}
