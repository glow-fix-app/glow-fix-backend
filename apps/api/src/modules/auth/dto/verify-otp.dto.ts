import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA = 'MFA',
}

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiPropertyOptional({ example: 'jane@example.com', description: 'Use this OR mobileNumber' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '403930' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

// // import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// // import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

// // export enum OtpPurpose {
// //   REGISTRATION = 'REGISTRATION',
// //   LOGIN = 'LOGIN',
// //   FORGOT_PASSWORD = 'FORGOT_PASSWORD',
// //   CHANGE_PASSWORD = 'CHANGE_PASSWORD',
// // }

// // export class VerifyOtpDto {
// //   @ApiProperty({
// //     example: '+201012345678',
// //     description: 'Mobile number (use this OR email)',
// //   })
// //   @IsOptional()
// //   @IsString()
// //   mobileNumber?: string;

// // @ApiPropertyOptional({
// //   example: 'jane@example.com',
// //   description: 'Email address (use this OR mobileNumber)',
// // })
// // @IsOptional()
// // @IsEmail()
// // email?: string;

// //   @ApiProperty({ example: '492817' })
// //   @IsString()
// //   @IsNotEmpty()
// //   otp: string;

// //   @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
// //   @IsString()
// //   @IsNotEmpty()
// //   purpose: OtpPurpose;
// // }

// import { 
//   IsOptional,
//   IsString,
//   IsNotEmpty,
//   IsEnum,
//   Matches,
//   IsEmail,
// } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export enum OtpPurpose {
//   REGISTRATION = 'REGISTRATION',
//   LOGIN = 'LOGIN',
//   PASSWORD_RESET = 'PASSWORD_RESET',
//   MFA = 'MFA',
// }

// export class VerifyOtpDto {
//   @ApiProperty({ example: '+12025551234' })
//   @IsString()
//   @IsNotEmpty()
//   mobileNumber: string;

//   @ApiPropertyOptional({
//     example: 'jane@example.com',
//     description: 'Email address (use this OR mobileNumber)',
//   })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiProperty({ example: '123456' })
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
//   otp: string;

//   @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }
