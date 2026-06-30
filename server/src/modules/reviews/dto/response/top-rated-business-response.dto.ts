import { ApiProperty } from '@nestjs/swagger';

export class TopRatedBusinessResponseDto {
  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  average_rating: number;

  @ApiProperty()
  total_reviews: number;

  @ApiProperty()
  address: string;
}
