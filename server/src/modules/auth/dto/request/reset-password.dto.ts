import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD } from '@glow-fix/utils';
import { MatchPasswords } from '../decorators/match-passwords.decorator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD.MIN_LENGTH)
  @MaxLength(PASSWORD.MAX_LENGTH)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  newPassword: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  @MatchPasswords('newPassword')
  confirmPassword: string;
}

export class VerifyResetOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;
}