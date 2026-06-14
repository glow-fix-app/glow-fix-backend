import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessLocationDto, OperatingHoursInputDto } from './create-business.dto';

export class UpdateBusinessDto {
  @ApiPropertyOptional({ example: 'Shine & Co. Detailing' })
  @IsOptional()
  @IsString()
  business_name?: string;

  @ApiPropertyOptional({ example: '123 Zamalek Street, Cairo, Egypt' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: BusinessLocationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessLocationDto)
  location?: BusinessLocationDto;

  @ApiPropertyOptional({ example: '0123456789' })
  @IsOptional()
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number format' })
  contact_phone?: string;

  @ApiPropertyOptional({ example: 'contact@shineco.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ example: 'Premium car wash and detailing service provider.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [OperatingHoursInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHoursInputDto)
  operating_hours?: OperatingHoursInputDto[];
}