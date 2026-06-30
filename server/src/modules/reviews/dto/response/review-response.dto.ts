import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  booking_id: string;

  @ApiProperty()
  rating: number;

  @ApiPropertyOptional()
  quality_rating?: number;

  @ApiPropertyOptional()
  punctuality_rating?: number;

  @ApiPropertyOptional()
  communication_rating?: number;

  @ApiPropertyOptional()
  comment?: string;

  @ApiPropertyOptional()
  reply?: string;

  @ApiPropertyOptional()
  replied_at?: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ReviewWithUserDto extends ReviewResponseDto {
  @ApiProperty()
  client_id: string;

  @ApiProperty()
  client_name: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;
}

export class BusinessReviewsResponseDto {
  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty({ type: [ReviewWithUserDto] })
  reviews: ReviewWithUserDto[];
}

export class RatingSummaryDto {
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

  @ApiPropertyOptional()
  average_quality?: number;

  @ApiPropertyOptional()
  average_punctuality?: number;

  @ApiPropertyOptional()
  average_communication?: number;
}