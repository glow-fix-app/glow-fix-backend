import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  quality_rating?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  punctuality_rating?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  communication_rating?: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ReviewWithDetailsEntity extends ReviewEntity {
  @ApiProperty()
  client_name: string;

  @ApiPropertyOptional()
  client_avatar?: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  booking_code: string;

  @ApiProperty()
  service_title: string;
}

export class BusinessReviewSummaryEntity {
  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty()
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  @ApiProperty()
  average_quality: number;

  @ApiProperty()
  average_punctuality: number;

  @ApiProperty()
  average_communication: number;
}