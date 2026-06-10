import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateBusinessDto {
  @ApiPropertyOptional({
    description: 'Business name (3-100 characters)',
    example: 'Bright Auto Wash',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Business physical address',
    example: '123 Main St, Cairo, Egypt',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: 30.0444,
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: 31.2357,
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Business contact phone number',
    example: '+20123456789',
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Business contact email address',
    example: 'info@business.com',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
