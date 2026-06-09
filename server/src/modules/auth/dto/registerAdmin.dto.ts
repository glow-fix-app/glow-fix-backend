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
 * Only an authenticated ADMIN can POST to /auth/register/admin.
 * The route is NOT decorated with @Public(), so the JWT guard enforces
 * authentication. The service then verifies role === 'ADMIN' as a
 * second layer of defence.
 */
export class RegisterAdminDto {
  @ApiProperty({ example: 'Glowfix Admin' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'admin2@glowfix.io' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiPropertyOptional({ example: '01009999999' })
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
