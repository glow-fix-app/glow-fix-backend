import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Document type',
    example: 'BUSINESS_REGISTRATION',
    enum: ['BUSINESS_REGISTRATION', 'INSURANCE_CERTIFICATE', 'TAX_CARD'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['BUSINESS_REGISTRATION', 'INSURANCE_CERTIFICATE', 'TAX_CARD'])
  type: string;
}
