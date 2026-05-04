import { AdminRole, Permission, UserRole } from '../enums/index';
export interface JwtPayload {
    sub: string;
    role: UserRole;
    adminRole?: AdminRole;
    permissions: Permission[];
    sessionId: string;
    deviceFingerprint: string;
    iat: number;
    exp: number;
}
export interface JwtTokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface LoginRequest {
    identifier: string;
    password: string;
    deviceFingerprint?: string;
}
export interface LoginWithOtpRequest {
    mobileNumber: string;
    otp: string;
    deviceFingerprint?: string;
}
export interface RegisterRequest {
    fullName: string;
    mobileNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    marketingConsent?: boolean;
}
export interface VerifyOtpRequest {
    mobileNumber: string;
    otp: string;
    purpose: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET' | 'MFA';
}
export interface ForgotPasswordRequest {
    identifier: string;
}
export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface OAuthCallbackRequest {
    provider: 'google' | 'apple' | 'facebook';
    code: string;
    redirectUri: string;
}
export interface OAuthProfile {
    provider: 'google' | 'apple' | 'facebook';
    providerId: string;
    email: string;
    emailVerified: boolean;
    name: string;
    profilePhoto?: string;
}
export interface SessionInfo {
    id: string;
    userId: string;
    deviceInfo: DeviceInfo;
    createdAt: Date;
    lastActivityAt: Date;
    expiresAt: Date;
    isCurrent: boolean;
}
export interface DeviceInfo {
    userAgent: string;
    ipAddress: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
}
export interface MfaSetupResponse {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
}
export interface MfaVerifyRequest {
    code: string;
    type: 'totp' | 'sms' | 'email';
}
