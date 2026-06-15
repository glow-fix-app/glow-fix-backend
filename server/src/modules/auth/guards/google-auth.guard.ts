import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      this.logger.error(`Google Auth Guard failed: ${err?.message || info?.message || 'No user returned'}`);
      const ctx = context.switchToHttp();
      const res = ctx.getResponse<Response>();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const errorMsg = err?.message || info?.message || 'Authentication failed';
      res.redirect(`${frontendUrl}/auth/login?error=${encodeURIComponent(errorMsg)}`);
      return null;
    }
    return user;
  }
}