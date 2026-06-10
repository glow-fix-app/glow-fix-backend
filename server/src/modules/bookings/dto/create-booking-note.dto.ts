import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingNoteDto {
  @ApiProperty({ description: 'The text content of the note' })
  @IsNotEmpty()
  @IsString()
  body: string;
}
