import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ProcessPayoutDto {
  @ApiProperty({ description: 'Payout ID' })
  @IsUUID()
  payout_id: string;

  @ApiProperty({ description: 'Amount to process (in EGP)' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
