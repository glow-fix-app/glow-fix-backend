import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum DocumentType {
  BUSINESS_REGISTRATION = 'BUSINESS_REGISTRATION',
  OWNER_ID = 'OWNER_ID',
  INSURANCE_CERTIFICATE = 'INSURANCE_CERTIFICATE',
  SERVICE_LICENSE = 'SERVICE_LICENSE',
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UploadBusinessDocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType;
}

export class UpdateDocumentStatusDto {
  @ApiProperty({ enum: DocumentStatus })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejection_reason?: string;
}

export class BusinessDocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  rejection_reason?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}