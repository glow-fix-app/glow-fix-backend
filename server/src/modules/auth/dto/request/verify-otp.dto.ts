import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

import { OtpPurpose } from '@prisma/client';
export { OtpPurpose };

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'ahmed@example.com', description: 'Use this OR phone' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '403930' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.EMAIL_VERIFICATION })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}