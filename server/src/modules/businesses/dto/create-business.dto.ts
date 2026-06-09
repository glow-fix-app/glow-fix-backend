import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BusinessLocationDto {
  @ApiProperty({ example: 30.0444 })
  @IsNumber()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({ example: 31.2357 })
  @IsNumber()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}

export class OperatingHoursInputDto {
  @ApiProperty({ enum: [0, 1, 2, 3, 4, 5, 6], description: '0=Sunday, 6=Saturday' })
  @IsNumber()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  open_time?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  close_time?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  is_closed?: boolean;
}

export class CreateBusinessDto {
  @ApiProperty({ example: 'Shine & Co. Detailing' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  business_name: string;

  @ApiProperty({ example: '123 Zamalek Street, Cairo, Egypt' })
  @IsString()
  address: string;

  @ApiProperty({ type: BusinessLocationDto })
  @ValidateNested()
  @Type(() => BusinessLocationDto)
  location: BusinessLocationDto;

  @ApiPropertyOptional({ example: '+20123456789' })
  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @ApiPropertyOptional({ example: 'contact@shineco.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ type: [OperatingHoursInputDto], description: 'Operating hours for each day' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHoursInputDto)
  operating_hours?: OperatingHoursInputDto[];
}