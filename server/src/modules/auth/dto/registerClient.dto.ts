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
 
export class RegisterClientDto {
  @ApiProperty({ example: 'Omar Nasser' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;
 
  @ApiProperty({ example: 'omar@example.com' })
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
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
  confirmPassword: string;
}