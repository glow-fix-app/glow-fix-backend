import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  booking_id: string;

  @ApiProperty({ description: 'Overall rating (1-5)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Quality rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  quality_rating?: number;

  @ApiPropertyOptional({ description: 'Punctuality rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  punctuality_rating?: number;

  @ApiPropertyOptional({ description: 'Communication rating (1-5)', minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  communication_rating?: number;

  @ApiPropertyOptional({ description: 'Review comment', maxLength: 600 })
  @IsOptional()
  @IsString()
  @MaxLength(600)
  comment?: string;
}