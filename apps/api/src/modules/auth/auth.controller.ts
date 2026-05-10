import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtPayload } from '@glow-fix/types';
import { JWT } from '@glow-fix/utils';

import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { SessionService } from './session.service';

import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
    private readonly sessionService: SessionService,
  ) {}

  // ─── Registration ───

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new customer account' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, OTP sent',
  })
  @ApiResponse({ status: 409, description: 'Email or mobile already exists' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ): Promise<{ message: string; requiresOtp: boolean }> {
    if (dto.password !== dto.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return this.authService.register(
      dto,
      req.ip || '',
      req.get('user-agent') || '',
    );
  }

  // ─── OTP Verification ───

  @Post('verify-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP for registration, login, or password reset',
  })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, unknown>> {
    const result = await this.authService.verifyOtp(
      dto,
      req.ip || '',
      req.get('user-agent') || '',
    );

    // Set refresh token as httpOnly cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      customer: result.customer,
    };
  }

  // ─── Resend OTP ───

  @Post('resend-otp')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP to email or mobile' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({
    status: 400,
    description: 'Already verified or cooldown active',
  })
  async resendOtp(@Body() dto: ResendOtpDto): Promise<{ message: string }> {
    return this.authService.resendOtp(dto);
  }

  // ─── Login ───

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email/mobile and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, unknown>> {
    const result = await this.authService.login(
      dto,
      req.ip || '',
      req.get('user-agent') || '',
    );

    if (result.requiresMfa) {
      return {
        requiresMfa: true,
        mfaToken: result.accessToken,
      };
    }

    // Set refresh token as httpOnly cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      customer: result.customer,
    };
  }

  // ─── Refresh Token ───

  @Post('refresh-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const result = await this.authService.refreshTokens(
      refreshToken,
      req.ip || '',
      req.get('user-agent') || '',
    );

    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };
  }

  // ─── Logout ───

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout current session' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.sub, user.sessionId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });

    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout all sessions' })
  async logoutAll(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; sessionsRevoked: number }> {
    const result = await this.authService.logoutAllSessions(user.sub);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });

    return {
      message: 'All sessions have been revoked',
      sessionsRevoked: result.sessionsRevoked,
    };
  }

  // ─── Password Management ───

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change password (requires current password)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'New password same as current' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
 
    const result = await this.authService.changePassword(user.sub, dto);
 
    // Clear refresh token cookie — all sessions were invalidated, force re-login
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
 
    return result;
  }
  // @Post('change-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'Change password (requires current password)' })
  // async changePassword(
  //   @Body() dto: ChangePasswordDto,
  //   @CurrentUser() user: JwtPayload,
  // ): Promise<{ message: string }> {
  //   if (dto.newPassword !== dto.confirmPassword) {
  //     throw new Error('Passwords do not match');
  //   }

  //   // Delegated to auth service — implementation similar to reset
  //   return { message: 'Password changed successfully' };
  // }

  // ─── Google OAuth ───

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth(): Promise<void> {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const googleUser = req.user as {
      providerId: string;
      email: string;
      name: string;
      profilePhoto?: string;
    };

    const result = await this.authService.handleGoogleOAuth(
      googleUser,
      req.ip || '',
      req.get('user-agent') || '',
    );

    // Set refresh token cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    // Redirect to frontend with access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      token: result.accessToken,
      isNewUser: result.isNewUser.toString(),
    });

    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }

  // ─── MFA ───

  // @Post('mfa/setup')
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'Start MFA setup — returns QR code and backup codes' })
  // async setupMfa(@CurrentUser() user: JwtPayload): Promise<Record<string, unknown>> {
  //   return this.mfaService.setupMfa(user.sub, user.sub); // email lookup needed
  // }

  @Post('mfa/setup')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Start MFA setup — returns QR code and backup codes',
  })
  async setupMfa(
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>> {
    const result = await this.mfaService.setupMfa(user.sub, user.sub);
    return result as unknown as Record<string, unknown>;
  }

  @Post('mfa/verify')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA code and enable 2FA' })
  async verifyMfa(
    @CurrentUser() user: JwtPayload,
    @Body('code') code: string,
  ): Promise<{ enabled: boolean }> {
    return this.mfaService.verifyAndEnableMfa(user.sub, code);
  }

  @Delete('mfa')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Disable MFA (requires current TOTP code)' })
  async disableMfa(
    @CurrentUser() user: JwtPayload,
    @Body('code') code: string,
  ): Promise<{ message: string }> {
    await this.mfaService.disableMfa(user.sub, code);
    return { message: 'Two-factor authentication has been disabled' };
  }

  // ─── Sessions ───

  @Get('sessions')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List active sessions' })
  async getSessions(
    @CurrentUser() user: JwtPayload,
  ): Promise<Record<string, unknown>[]> {
    const sessions = await this.sessionService.getActiveSessions(user.sub);
    return sessions.map((session) => ({
      ...session,
      isCurrent: session.id === user.sessionId,
    }));
  }

  @Delete('sessions/:sessionId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke a specific session' })
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.sessionService.invalidateSession(sessionId);
    return { message: 'Session revoked successfully' };
  }

  // ─── Helpers ───

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
