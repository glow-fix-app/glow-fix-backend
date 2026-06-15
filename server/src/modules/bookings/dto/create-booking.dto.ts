import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsString, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class BookingItemDto {
  @ApiProperty({ description: 'Business Service ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  businessServiceId: string;
}

export class BookingImageDto {
  @ApiProperty({ description: 'Image URL', example: 'https://cdn.example.com/bookings/problems/abc.webp' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: 'R2 storage key', example: 'bookings/problems/abc.webp' })
  @IsOptional()
  @IsString()
  storageKey?: string;
}

export class CreateBookingDto {
  @ApiProperty({ description: 'Vehicle ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsString()
  vehicleId: string;

  @ApiProperty({ description: 'Business/Provider ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsString()
  businessId: string;

  @ApiProperty({ description: 'Scheduled Date & Time', example: '2026-06-15T10:00:00Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ description: 'Expected Delivery Date & Time', example: '2026-06-15T14:00:00Z' })
  @IsOptional()
  @IsDateString()
  expectedDeliveryAt?: string;

  @ApiProperty({ type: [BookingItemDto], description: 'Selected services for the booking' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];

  @ApiPropertyOptional({ description: 'Optional customer note/instruction', example: 'Please pay extra attention to the dashboard clean.' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ type: [BookingImageDto], description: 'Optional problem photos with storage keys' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingImageDto)
  images?: BookingImageDto[];
}
