import { OtpPurpose } from './enums';
import { UUID } from './common';

export interface RegisterCustomerDto {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  marketingConsent?: boolean;
}

export interface LoginDto {
  identifier: string; // email or mobile
  password: string;
  rememberMe?: boolean;
}

export interface VerifyOtpDto {
  identifier: string;
  code: string;
  purpose: OtpPurpose;
}

export interface RequestPasswordResetDto {
  identifier: string; // email or mobile
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: UUID;
  email: string;
  mobileNumber: string;
  fullName: string;
  role: string;
  permissions: string[];
}