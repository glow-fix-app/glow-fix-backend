import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleEntity {
  @ApiProperty({ description: 'Vehicle record ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Client ID (from clients table)', example: '550e8400-e29b-41d4-a716-446655440000' })
  client_id: string;

  @ApiProperty({ description: 'License plate number', example: 'ABC 1234' })
  license_plate: string;

  @ApiPropertyOptional({ description: 'Vehicle model', example: 'Toyota Corolla' })
  model?: string;

  @ApiPropertyOptional({ description: 'Manufacturing year', example: 2021 })
  year?: number;

  @ApiPropertyOptional({ description: 'Vehicle color', example: 'Pearl White' })
  color?: string;

  @ApiProperty({ description: 'Created at timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updated_at: Date;
}

export class VehicleWithDetailsEntity extends VehicleEntity {
  @ApiPropertyOptional({ description: 'Client name' })
  client_name?: string;

  @ApiPropertyOptional({ description: 'Client email' })
  client_email?: string;

  @ApiPropertyOptional({ description: 'Total bookings for this vehicle' })
  total_bookings?: number;

  @ApiPropertyOptional({ description: 'Last booking date' })
  last_booking_at?: Date;

  @ApiPropertyOptional({ description: 'Total spent on this vehicle' })
  total_spent?: number;
}