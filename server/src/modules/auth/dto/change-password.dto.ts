import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD } from '@glow-fix/utils';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD.MIN_LENGTH)
  @MaxLength(PASSWORD.MAX_LENGTH)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}