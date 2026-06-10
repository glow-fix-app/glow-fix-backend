import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportFindingDto {
  @ApiProperty({ description: 'The title of the issue found' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description of the issue' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Priority level', enum: ['CRITICAL', 'WARNING', 'INFO'] })
  @IsNotEmpty()
  @IsEnum(['CRITICAL', 'WARNING', 'INFO'])
  priority: 'CRITICAL' | 'WARNING' | 'INFO';
}
