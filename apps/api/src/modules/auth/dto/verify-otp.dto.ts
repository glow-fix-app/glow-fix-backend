import { IsString, IsNotEmpty, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA = 'MFA',
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+12025551234' })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}