import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

// Must match OtpPurpose enum in prisma schema exactly
export enum OtpPurpose {
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  TWO_FACTOR = 'TWO_FACTOR',
}

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



// dto/verify-otp.dto.ts
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';

// export enum OtpPurpose {
//   EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
//   PHONE_VERIFICATION = 'PHONE_VERIFICATION',
//   LOGIN = 'LOGIN',
//   PASSWORD_RESET = 'PASSWORD_RESET',
// }

// export class VerifyOtpDto {
//   @ApiPropertyOptional({ example: 'user@example.com' })
//   @IsOptional()
//   @IsString()
//   email?: string;

//   @ApiPropertyOptional({ example: '+201000000000' })
//   @IsOptional()
//   @IsString()
//   phone?: string;

//   @ApiProperty({ example: '123456' })
//   @IsString()
//   @MinLength(6)
//   @MaxLength(6)
//   otp: string;

//   @ApiProperty({ enum: OtpPurpose })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }

// import {
//   IsOptional,
//   IsString,
//   IsNotEmpty,
//   IsEnum,
//   Matches,
//   IsEmail,
// } from 'class-validator';
// import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

// export enum OtpPurpose {
//   REGISTRATION = 'REGISTRATION',
//   LOGIN = 'LOGIN',
//   PASSWORD_RESET = 'PASSWORD_RESET',
//   MFA = 'MFA',
// }

// export class VerifyOtpDto {
//   @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
//   @IsOptional()
//   @IsString()
//   mobileNumber?: string;

//   @ApiPropertyOptional({ example: 'jane@example.com', description: 'Use this OR mobileNumber' })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiProperty({ example: '403930' })
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
//   otp: string;

//   @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }