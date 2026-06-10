import { ApiProperty } from '@nestjs/swagger';
import { BookingEntity } from './booking.entity';

export class PaginatedBookingsMetadata {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total items matching filters' })
  total: number;

  @ApiProperty({ description: 'Total pages available' })
  total_pages: number;
}

export class PaginatedBookingsEntity {
  @ApiProperty({ description: 'List of bookings', type: [BookingEntity] })
  data: BookingEntity[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: PaginatedBookingsMetadata;
}
