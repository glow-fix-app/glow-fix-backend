import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEmail, IsPhoneNumber, MinLength, MaxLength } from 'class-validator';

export class UpdateClientProfileDto {
  @ApiPropertyOptional({ description: 'User full name', example: 'Mahmoud Ali' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  full_name?: string;

  @ApiPropertyOptional({ description: 'User email', example: 'mahmoud@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+201000000000' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ description: 'Marketing consent' })
  @IsOptional()
  @IsBoolean()
  marketing_consent?: boolean;
}

export class ChangePasswordDto {
  @ApiPropertyOptional({ description: 'Current password' })
  @IsOptional()
  @IsString()
  current_password?: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(8)
  new_password: string;

  @ApiProperty({ description: 'Confirm new password' })
  @IsString()
  @MinLength(8)
  confirm_password: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ description: 'Phone number to verify' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: 'OTP code' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}

export class ResendVerificationDto {
  @ApiPropertyOptional({ description: 'Send to email' })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional({ description: 'Send to phone' })
  @IsOptional()
  @IsBoolean()
  phone?: boolean;
}