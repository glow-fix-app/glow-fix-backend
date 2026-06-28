import { User, AuthProvider, OtpPurpose } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { UserRole, Permission } from '@glow-fix/types';

// ─── Shared shaped types ──────────────────────────────────────────────────────

export interface FormattedUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  role: string;
}

export interface CreateUserData {
  role: string;
  fullName: string;
  email: string;
  phone?: string | null;
  passwordHash?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface CreateBusinessData {
  managerId: string;
  businessName: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPhone?: string | null;
  contactEmail: string;
}

export interface CreateOAuthProviderData {
  userId: string;
  provider: string;
  providerUserId?: string;
  email: string;
}

export interface CreateUserAuthProviderData {
  userId: string;
  provider: string;
  email: string;
}

export interface CreateBusinessDocumentData {
  businessId: string;
  type: string;
  url: string;
  statusId: string;
}

export interface CreateAuditLogData {
  actorId: string;
  entityType: string;
  entityId: string;
  action: string;
  oldData?: Prisma.InputJsonValue;
  newData?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateImageData {
  url: string;
  entityType: string;
  entityId: string;
}

// ─── Repository interface ─────────────────────────────────────────────────────

export interface IAuthRepository {
  // User lookups
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByPhone(phone: string): Promise<User | null>;
  findUserByIdentifier(identifier: string): Promise<User | null>;
  findUserWithDeletedStatus(identifier: string): Promise<User | null>;
  getUserWithRelations(id: string): Promise<User | null>;

  // User mutations
  createUser(data: CreateUserData): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Role-specific setup
  createClient(userId: string): Promise<void>;
  createUserAuthProvider(data: CreateUserAuthProviderData): Promise<void>;

  // Business
  createBusiness(data: CreateBusinessData): Promise<{ id: string }>;
  createBusinessStatus(data: { businessId: string; statusId: string }): Promise<void>;
  createBusinessDocument(data: CreateBusinessDocumentData): Promise<void>;

  // Status
  findStatus(context: string): Promise<{ id: string } | null>;
  findOrCreateStatus(context: string): Promise<{ id: string }>;

  // OTP
  findLatestOtp(userId: string, purpose: OtpPurpose): Promise<{ id: string; createdAt: Date } | null>;
  invalidateOldOtps(userId: string, purpose: OtpPurpose): Promise<void>;
  createOtp(data: Record<string, unknown>): Promise<void>;
  markOtpAsUsed(otpId: string): Promise<void>;

  // OAuth
  findOAuthProvider(provider: AuthProvider, providerUserId: string): Promise<{ user: User } | null>;
  createOAuthProvider(data: CreateOAuthProviderData): Promise<void>;

  // Misc
  createAuditLog(data: CreateAuditLogData): Promise<void>;
  createImage(data: CreateImageData): Promise<void>;
}

// ─── Service interfaces ───────────────────────────────────────────────────────

export interface IAuthService {
  registerClient(dto: unknown, ipAddress: string, userAgent: string): Promise<RegistrationResult>;
  registerManager(dto: unknown, files: unknown, ipAddress: string, userAgent: string): Promise<RegistrationResult>;
  registerAdmin(dto: unknown, actorId: string, ipAddress: string, userAgent: string): Promise<RegistrationResult>;
  verifyOtp(dto: unknown, ipAddress: string, userAgent: string): Promise<AuthResult>;
  resendOtp(dto: unknown): Promise<{ message: string }>;
  login(dto: unknown, ipAddress: string, userAgent: string): Promise<LoginResult>;
  verifyMfaLogin(mfaToken: string, code: string, ipAddress: string, userAgent: string): Promise<AuthResult>;
  refreshTokens(refreshToken: string, ipAddress: string, userAgent: string): Promise<TokenResult>;
  logout(userId: string, sessionId: string): Promise<void>;
  logoutAllSessions(userId: string): Promise<{ sessionsRevoked: number }>;
  forgotPassword(dto: unknown): Promise<{ message: string }>;
  verifyResetOtp(dto: { email: string; otp: string }): Promise<{ resetToken: string }>;
  resetPassword(dto: unknown): Promise<{ message: string }>;
  changePassword(userId: string, dto: unknown): Promise<{ message: string }>;
  handleGoogleOAuth(profile: GoogleOAuthProfile, ipAddress: string, userAgent: string): Promise<GoogleAuthResult>;
}

// ─── Result types ─────────────────────────────────────────────────────────────

export interface RegistrationResult {
  message: string;
  requiresOtp: boolean;
}

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: FormattedUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResult extends AuthResult {
  requiresMfa?: boolean;
}

export interface GoogleAuthResult extends AuthResult {
  isNewUser: boolean;
}

// ─── Misc types ───────────────────────────────────────────────────────────────

export interface GoogleOAuthProfile {
  providerId: string;
  email: string;
  name: string;
  profilePhoto?: string;
}

export type RolePermissionsMap = Record<UserRole, Permission[]>;
