// dto/update-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  full_name?: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  email?: string;

  @ApiPropertyOptional({ example: '+201012345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}

// import { ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsString,
//   IsEmail,
//   IsOptional,
//   MinLength,
//   MaxLength,
//   IsBoolean,
// } from 'class-validator';
// import { Transform } from 'class-transformer';

// export class UpdateUserDto {
//   @ApiPropertyOptional({ example: 'Jane Doe' })
//   @IsOptional()
//   @IsString()
//   @MinLength(2)
//   @MaxLength(100)
//   fullName?: string;

//   @ApiPropertyOptional({ example: 'jane@example.com' })
//   @IsOptional()
//   @IsEmail()
//   @Transform(({ value }: { value: string }) => value?.toLowerCase())
//   email?: string;

//   @ApiPropertyOptional({ example: '+201012345678' })
//   @IsOptional()
//   @IsString()
//   mobileNumber?: string;

//   @ApiPropertyOptional({ example: 'https://cdn.example.com/photo.jpg' })
//   @IsOptional()
//   @IsString()
//   profilePhotoUrl?: string;

//   @ApiPropertyOptional({ example: true })
//   @IsOptional()
//   @IsBoolean()
//   marketingConsent?: boolean;
// }