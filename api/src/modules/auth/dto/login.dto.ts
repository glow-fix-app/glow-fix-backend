// dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'mahmoud@example.com or +201000000000', description: 'Email or phone number' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'User password' })
  @IsString()
  @MinLength(1)
  password: string;
}


// import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class LoginDto {
//   @ApiProperty({ example: 'ahmed@example.com', description: 'Email or mobile number' })
//   @IsString()
//   @IsNotEmpty()
//   identifier: string;

//   @ApiProperty({ example: 'MyStr0ng!Pass' })
//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   deviceFingerprint?: string;
// }