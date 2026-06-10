import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class AdminSetDocumentStatusDto {
  @ApiProperty({
    description: 'New status for the document',
    example: 'APPROVED',
    enum: ['APPROVED', 'REJECTED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: string;

  @ApiPropertyOptional({
    description: 'Rejection reason (required if status is REJECTED)',
    example: 'Document is unclear or invalid',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
