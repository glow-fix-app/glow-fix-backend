import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD } from '@glow-fix/utils';
import { MatchPasswords } from '../decorators/match-passwords.decorator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldStr0ng!Pass', required: false })
  @IsString()
  @IsOptional()
  currentPassword?: string;

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
  @MatchPasswords('newPassword')
  confirmPassword: string;
}