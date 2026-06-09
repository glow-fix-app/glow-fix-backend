import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Category ID (WASH, REPAIR, etc.)' })
  @IsUUID()
  category_id: string;

  @ApiProperty({ example: 'Express Hand Wash' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({ example: 'Exterior wash, tire shine, quick interior vacuum' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}