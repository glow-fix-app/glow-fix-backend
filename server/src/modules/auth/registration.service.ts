import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { OtpPurpose } from '@prisma/client';

import { WinstonLoggerService } from '../../common/logger/winston-logger.service';
import { StorageService } from '../../core/storage/storage.service';

import { AuthRepository } from './auth.repository';
import { PasswordService } from './password.service';
import { OtpService } from './otp.service';
import {
  EmailAlreadyExistsException,
  PhoneAlreadyExistsException,
  AdminOnlyException,
} from './exceptions/auth.exceptions';
import {
  RegistrationResult,
  CreateBusinessData,
} from './interfaces/auth.interface';
import {
  RegisterClientDto,
  RegisterManagerDto,
  RegisterAdminDto,
} from './dto/request';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly otpService: OtpService,
    private readonly storageService: StorageService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // ─── Public methods ────────────────────────────────────────────────────────

  async registerClient(
    dto: RegisterClientDto,
    ipAddress: string,
  ): Promise<RegistrationResult> {
    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.repository.createUser({
      role: 'CLIENT',
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? null,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
    });

    await this.repository.createClient(user.id);
    await this.repository.createUserAuthProvider({
      userId: user.id,
      provider: 'EMAIL',
      email: dto.email.toLowerCase(),
    });

    await this.sendVerificationOtps(user.id, user.email!, dto.phone);

    this.logger.log('Client registered', 'RegistrationService', {
      userId: user.id,
      email: user.email,
      ipAddress,
    });

    return this.buildRegistrationResponse(!!dto.phone);
  }

  async registerManager(
    dto: RegisterManagerDto,
    files: ManagerRegistrationFiles,
    ipAddress: string,
  ): Promise<RegistrationResult> {
    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.repository.createUser({
      role: 'MANAGER',
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? null,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
    });

    await this.repository.createUserAuthProvider({
      userId: user.id,
      provider: 'EMAIL',
      email: dto.email.toLowerCase(),
    });

    const businessData: CreateBusinessData = {
      managerId: user.id,
      businessName: dto.businessName,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      contactPhone: dto.phone ?? null,
      contactEmail: dto.email.toLowerCase(),
    };

    const business = await this.repository.createBusiness(businessData);

    const pendingStatus = await this.repository.findOrCreateStatus('PENDING_REVIEW');
    await this.repository.createBusinessStatus({
      businessId: business.id,
      statusId: pendingStatus.id,
    });

    await this.uploadBusinessDocuments(business.id, files);
    await this.sendVerificationOtps(user.id, user.email!, dto.phone);

    this.logger.log('Manager registered', 'RegistrationService', {
      userId: user.id,
      businessId: business.id,
      email: user.email,
      ipAddress,
    });

    return this.buildRegistrationResponse(!!dto.phone);
  }

  async registerAdmin(
    dto: RegisterAdminDto,
    actorId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<RegistrationResult> {
    const actor = await this.repository.findUserById(actorId);
    if (!actor || actor.role !== 'ADMIN') {
      throw new AdminOnlyException();
    }

    await this.assertUniqueEmailAndPhone(dto.email, dto.phone);

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.repository.createUser({
      role: 'ADMIN',
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? null,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
    });

    await this.repository.createUserAuthProvider({
      userId: user.id,
      provider: 'EMAIL',
      email: dto.email.toLowerCase(),
    });

    await this.repository.createAuditLog({
      actorId,
      entityType: 'USER',
      entityId: user.id,
      action: 'CREATED',
      newData: { role: 'ADMIN', email: user.email },
      ipAddress,
      userAgent,
    });

    await this.sendVerificationOtps(user.id, user.email!, dto.phone);

    this.logger.log('Admin registered', 'RegistrationService', {
      actorId,
      newAdminId: user.id,
      email: user.email,
      ipAddress,
    });

    return this.buildRegistrationResponse(!!dto.phone);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async assertUniqueEmailAndPhone(email: string, phone?: string): Promise<void> {
    const existingEmail = await this.repository.findUserByEmail(email);
    if (existingEmail) throw new EmailAlreadyExistsException();

    if (phone) {
      const existingPhone = await this.repository.findUserByPhone(phone);
      if (existingPhone) throw new PhoneAlreadyExistsException();
    }
  }

  private async sendVerificationOtps(
    userId: string,
    email: string,
    phone?: string,
  ): Promise<void> {
    await this.otpService.sendOtpToEmail(userId, email, OtpPurpose.EMAIL_VERIFICATION);
    if (phone) {
      await this.otpService.sendOtpToPhone(userId, phone, OtpPurpose.PHONE_VERIFICATION);
    }
  }

  private buildRegistrationResponse(hasPhone: boolean): RegistrationResult {
    return {
      message: hasPhone
        ? 'Registration successful. Verification codes have been sent to your email and phone.'
        : 'Registration successful. A verification code has been sent to your email.',
      requiresOtp: true,
    };
  }

  private async uploadBusinessDocuments(
    businessId: string,
    files: ManagerRegistrationFiles,
  ): Promise<void> {
    const documentTypes: Array<{ key: keyof ManagerRegistrationFiles; type: string }> = [
      { key: 'businessRegistration', type: 'BUSINESS_REGISTRATION' },
      { key: 'ownerID', type: 'OWNER_ID' },
      { key: 'insuranceCertificate', type: 'INSURANCE_CERTIFICATE' },
      { key: 'serviceLicense', type: 'SERVICE_LICENSE' },
    ];

    const pendingStatus = await this.repository.findOrCreateStatus('PENDING');

    for (const doc of documentTypes) {
      const fileArr = files[doc.key];
      if (fileArr?.[0]) {
        const file = fileArr[0];
        const { url } = await this.storageService.uploadFile(
          file.buffer,
          `businesses/${businessId}/documents`,
          file.mimetype,
          file.originalname,
        );
        await this.repository.createBusinessDocument({
          businessId,
          type: doc.type,
          url,
          statusId: pendingStatus.id,
        });
      }
    }
  }
}

// ─── Supporting types ──────────────────────────────────────────────────────────

export interface ManagerRegistrationFiles {
  businessRegistration?: Express.Multer.File[];
  ownerID?: Express.Multer.File[];
  insuranceCertificate?: Express.Multer.File[];
  serviceLicense?: Express.Multer.File[];
}
