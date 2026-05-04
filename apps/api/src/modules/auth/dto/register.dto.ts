import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PASSWORD } from '@glow-fix/utils';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => (value as string).trim())
  fullName: string;

  @ApiProperty({ example: '+12025551234' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'Please provide a valid phone number in international format',
  })
  mobileNumber: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 'MyStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD.MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD.MIN_LENGTH} characters`,
  })
  @MaxLength(PASSWORD.MAX_LENGTH)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  password: string;

  @ApiProperty({ example: 'MyStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiPropertyOptional({ example: 'GF-ABC123' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}