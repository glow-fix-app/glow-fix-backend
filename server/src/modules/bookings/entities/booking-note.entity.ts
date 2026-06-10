import { ApiProperty } from '@nestjs/swagger';

export class BookingNoteEntity {
  @ApiProperty({ description: 'Note ID' })
  id: string;

  @ApiProperty({ description: 'Booking ID' })
  booking_id: string;

  @ApiProperty({ description: 'Note content body' })
  body: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}
