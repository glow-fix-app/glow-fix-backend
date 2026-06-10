import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class AdminSetBusinessStatusDto {
  @ApiProperty({
    description: 'New status for the business',
    example: 'APPROVED',
    enum: ['APPROVED', 'REJECTED', 'SUSPENDED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED', 'SUSPENDED'])
  status: string;

  @ApiPropertyOptional({
    description:
      'Rejection or suspension reason (required if status is REJECTED or SUSPENDED)',
    example: 'Missing required documents',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
