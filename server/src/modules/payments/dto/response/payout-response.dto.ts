import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  business_id: string;

  @ApiProperty()
  business_name: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  processed_at?: Date;

  @ApiProperty()
  created_at: Date;
}
