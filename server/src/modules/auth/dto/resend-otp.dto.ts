import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from './verify-otp.dto';

export class ResendOtpDto {
  @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'ahmed@example.com', description: 'Use this OR phone' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.EMAIL_VERIFICATION })
  @IsEnum(OtpPurpose)
  purpose: OtpPurpose;
}

// import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
// import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
// import { OtpPurpose } from './verify-otp.dto';

// export class ResendOtpDto {
//   @ApiPropertyOptional({ example: '+201092887320', description: 'Use this OR email' })
//   @IsOptional()
//   @IsString()
//   mobileNumber?: string;

//   @ApiPropertyOptional({ example: 'jane@example.com', description: 'Use this OR mobileNumber' })
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.REGISTRATION })
//   @IsEnum(OtpPurpose)
//   purpose: OtpPurpose;
// }