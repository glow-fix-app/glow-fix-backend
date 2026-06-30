import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'mahmoud@example.com or +201000000000',
    description: 'Email or phone number',
  })
  @IsString()
  @IsNotEmpty({ message: 'Identifier (email or phone) is required' })
  identifier: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'User password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(1)
  password: string;
}