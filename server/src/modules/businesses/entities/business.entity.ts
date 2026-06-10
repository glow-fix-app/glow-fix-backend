import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessDocumentEntity } from './business-document.entity';
import { OperatingHourEntity } from './operating-hour.entity';

export class BusinessEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  latestStatus: string | null;

  @ApiPropertyOptional({ nullable: true })
  latestRejectionReason: string | null;

  @ApiProperty({ type: [OperatingHourEntity] })
  operatingHours: OperatingHourEntity[];

  @ApiProperty({ type: [BusinessDocumentEntity] })
  documents: BusinessDocumentEntity[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
