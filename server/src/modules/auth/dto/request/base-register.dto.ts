import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { MatchPasswords } from '../decorators/match-passwords.decorator';

/**
 * Shared base fields for all registration DTOs.
 * Register-specific DTOs extend this to gain common field validation
 * and the cross-field password-match constraint in one place.
 */
export abstract class BaseRegisterDto {
  @ApiProperty({ example: 'Omar Nasser' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'omar@example.com' })
  @IsEmail()
  @Transform(({ value }) => (value as string)?.toLowerCase().trim())
  email: string;

  @ApiPropertyOptional({ example: '+201112223344' })
  @IsOptional()
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt hard limit
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, a number, and a special character',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MatchPasswords('password')
  confirmPassword: string;
}
