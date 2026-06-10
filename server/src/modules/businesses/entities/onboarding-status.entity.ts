import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardingStatusEntity {
  @ApiProperty()
  hasBusiness: boolean;

  @ApiPropertyOptional({ nullable: true })
  businessStatus: string | null;

  @ApiProperty({ type: [String] })
  requiredDocuments: string[];

  @ApiProperty({ type: [String] })
  uploadedDocuments: string[];

  @ApiProperty({ type: [String] })
  missingDocuments: string[];

  @ApiProperty({ type: [String] })
  rejectedDocuments: string[];

  @ApiProperty()
  allRequiredDocumentsUploaded: boolean;

  @ApiProperty()
  allRequiredDocumentsApproved: boolean;

  @ApiProperty()
  hasOperatingHours: boolean;

  @ApiProperty()
  isReadyForReview: boolean;

  @ApiProperty()
  canGoLive: boolean;
}
