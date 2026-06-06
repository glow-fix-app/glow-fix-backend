import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
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

  @ApiPropertyOptional({ example: '+20123456789' })
  @IsOptional()
  @IsPhoneNumber()
  contact_phone?: string;

  @ApiPropertyOptional({ example: 'contact@shineco.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ type: [OperatingHoursInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHoursInputDto)
  operating_hours?: OperatingHoursInputDto[];
}