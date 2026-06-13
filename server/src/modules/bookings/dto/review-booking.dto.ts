import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested, IsUUID, IsNumber, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReviewStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export class ReviewBookingItemDto {
  @ApiProperty({ description: 'Business Service ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  businessServiceId: string;

  @ApiPropertyOptional({ description: 'Negotiated price for this service item', example: 150.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}

export class ReviewBookingDto {
  @ApiProperty({ description: 'Review decision (ACCEPTED or REJECTED)', enum: ReviewStatus })
  @IsEnum(ReviewStatus)
  @IsNotEmpty()
  status: ReviewStatus;

  @ApiPropertyOptional({ description: 'Reason for rejection if status is REJECTED', example: 'Provider fully booked' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({ type: [ReviewBookingItemDto], description: 'Updated service items or prices' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewBookingItemDto)
  items?: ReviewBookingItemDto[];

  @ApiPropertyOptional({ description: 'Expected delivery date and time if accepted', example: '2026-06-15T14:30:00.000Z' })
  @ValidateIf(o => o.status === ReviewStatus.ACCEPTED)
  @IsNotEmpty({ message: 'expectedDeliveryAt is required when accepting a booking' })
  @IsString()
  expectedDeliveryAt?: string;
}
