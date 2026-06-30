import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BaseRegisterDto } from './base-register.dto';

/**
 * Used by workshop owners to self-register.
 * The MANAGER role is assigned immediately; the Business record and
 * admin approval happen separately via the Business onboarding flow.
 */
export class RegisterManagerDto extends BaseRegisterDto {
  @ApiProperty({ example: 'Auto Fix Shop' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  businessName: string;

  @ApiProperty({ example: '123 Main St, Cairo' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  address: string;

  @ApiProperty({ example: 30.0444 })
  @Transform(({ value }) => {
    const num = parseFloat(value as string);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 31.2357 })
  @Transform(({ value }) => {
    const num = parseFloat(value as string);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  longitude: number;
}
