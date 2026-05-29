// dto/get-users-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum UserRole {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export class GetUsersQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'jane', description: 'Search by name, email, or phone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Filter by email verification status' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  email_verified?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Filter by phone verification status' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  phone_verified?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;
}


// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
// import { Transform, Type } from 'class-transformer';

// export class GetUsersQueryDto {
//   @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page?: number = 1;

//   @ApiPropertyOptional({ example: 20, description: 'Items per page (max 100)' })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100)
//   limit?: number = 20;

//   @ApiPropertyOptional({ example: 'jane', description: 'Search by name, email, or mobile' })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiPropertyOptional({ example: true, description: 'Filter by email verification status' })
//   @IsOptional()
//   @Transform(({ value }: { value: string }) => value === 'true')
//   @IsBoolean()
//   emailVerified?: boolean;

//   @ApiPropertyOptional({ example: true, description: 'Filter by mobile verification status' })
//   @IsOptional()
//   @Transform(({ value }: { value: string }) => value === 'true')
//   @IsBoolean()
//   mobileVerified?: boolean;
// }