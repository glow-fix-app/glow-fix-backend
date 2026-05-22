export interface JwtPayload {
  sub: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser  {
  id: string;
  email: string;
  fullName: string;
  role: string;
  sessionId: string;
}