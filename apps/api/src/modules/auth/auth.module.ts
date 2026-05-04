import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { PasswordService } from './password.service';
import { MfaService } from './mfa.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.accessExpiry'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    TokenService,
    SessionService,
    PasswordService,
    MfaService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, TokenService, SessionService, JwtAuthGuard],
})
export class AuthModule {}