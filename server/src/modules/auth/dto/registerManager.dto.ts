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

/**
 * Used by workshop owners to self-register.
 * The MANAGER role is assigned immediately; the Business record and
 * admin approval happen separately via the Business onboarding flow.
 */
export class RegisterManagerDto {
  @ApiProperty({ example: 'Ahmed Khalil' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'ahmed@glowfix.io' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiPropertyOptional({ example: '01001234567' })
  @IsOptional()
  @Matches(/^\d{8,15}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, a number, and a special character',
  })
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;
}
