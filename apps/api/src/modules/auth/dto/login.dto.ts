import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ahmed@example.com', description: 'Email or mobile number' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'MyStr0ng!Pass' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}