import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OperatingHourDto } from './operating-hours.dto';

export class CreateBusinessDto {
  @ApiProperty({
    description: 'Business name (3-100 characters)',
    example: 'Bright Auto Wash',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  businessName: string;

  @ApiProperty({
    description: 'Business physical address',
    example: '123 Main St, Cairo, Egypt',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 30.0444,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 31.2357,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;

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

  @ApiPropertyOptional({
    description:
      'Operating hours (optional, can be added/updated later). Array of operating hour objects.',
    type: [OperatingHourDto],
    example: [
      {
        dayOfWeek: 0,
        openTime: '09:00',
        closeTime: '17:00',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHourDto)
  operatingHours?: OperatingHourDto[];
}
